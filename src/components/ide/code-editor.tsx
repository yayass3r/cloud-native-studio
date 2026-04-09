'use client';

import dynamic from 'next/dynamic';
import { useIDEStore } from '@/store/ide-store';
import { useRef, useCallback } from 'react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-[#1e1e1e]">
      <div className="text-center text-muted-foreground">
        <div className="animate-spin w-8 h-8 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full mx-auto mb-3" />
        <p className="text-sm">جاري تحميل المحرر...</p>
      </div>
    </div>
  ),
});

function getLanguage(filePath: string | null): string {
  if (!filePath) return 'plaintext';
  const ext = filePath.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    js: 'javascript', jsx: 'javascript', ts: 'typescript', tsx: 'typescript',
    html: 'html', css: 'css', scss: 'scss', json: 'json', md: 'markdown',
    yaml: 'yaml', yml: 'yaml', py: 'python', rb: 'ruby', go: 'go',
    rs: 'rust', java: 'java', cpp: 'cpp', c: 'c', sh: 'shell', bash: 'shell',
    sql: 'sql', xml: 'xml', svg: 'xml',
  };
  return langMap[ext || ''] || 'plaintext';
}

export function CodeEditor({ isMobile = false }: { isMobile?: boolean }) {
  const activeFilePath = useIDEStore((s) => s.activeFilePath);
  const fileContents = useIDEStore((s) => s.fileContents);
  const setFileContent = useIDEStore((s) => s.setFileContent);
  const currentContent = activeFilePath ? fileContents[activeFilePath] || '' : '';
  const language = getLanguage(activeFilePath);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeFileRef = useRef(activeFilePath);

  // Keep ref in sync to avoid stale closure in debounce
  activeFileRef.current = activeFilePath;

  const handleEditorChange = useCallback((value: string | undefined) => {
    const filePath = activeFileRef.current;
    if (!filePath || value === undefined) return;

    // Update store immediately for reactive UI
    setFileContent(filePath, value);

    // Debounced write to WebContainer filesystem
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      const instance = useIDEStore.getState().webcontainerInstance;
      const savePath = activeFileRef.current;
      if (instance && savePath) {
        try {
          await instance.writeFile(savePath, value);
        } catch (err) {
          console.error('Failed to save file to WebContainer:', err);
        }
      }
    }, 500);
  }, [setFileContent]);

  if (!activeFilePath) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#1e1e1e]">
        <div className="text-center text-muted-foreground px-6">
          <FileIcon />
          <p className="text-base font-medium mt-4">{isMobile ? 'اختر ملفًا' : 'اختر ملفًا للتعديل'}</p>
          <p className="text-sm mt-1 text-muted-foreground/70">
            {isMobile ? 'انتقل إلى تبويب "الملفات" واختر ملفًا' : 'اختر ملفًا من مستعرض الملفات على اليمين'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <MonacoEditor
        height="100%"
        language={language}
        theme="vs-dark"
        value={currentContent}
        path={activeFilePath}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: !isMobile },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          lineNumbers: isMobile ? 'off' : 'on',
          glyphMargin: false,
          folding: !isMobile,
          lineDecorationsWidth: isMobile ? 8 : 10,
          lineNumbersMinChars: isMobile ? 0 : 3,
          renderLineHighlight: isMobile ? 'none' : 'all',
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          scrollbar: {
            verticalScrollbarSize: isMobile ? 6 : 10,
            horizontalScrollbarSize: isMobile ? 6 : 10,
          },
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: isMobile ? 8 : 12 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: true, indentation: !isMobile },
          quickSuggestions: !isMobile,
          suggestOnTriggerCharacters: !isMobile,
          parameterHints: { enabled: !isMobile },
          contextmenu: true,
          readOnly: false,
          domReadOnly: false,
        }}
      />
    </div>
  );
}

function FileIcon() {
  return (
    <svg className="w-14 h-14 mx-auto text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
