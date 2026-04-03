'use client';

import dynamic from 'next/dynamic';
import { useIDEStore } from '@/store/ide-store';

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
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    html: 'html',
    css: 'css',
    scss: 'scss',
    json: 'json',
    md: 'markdown',
    yaml: 'yaml',
    yml: 'yaml',
    py: 'python',
    rb: 'ruby',
    go: 'go',
    rs: 'rust',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    sh: 'shell',
    bash: 'shell',
    sql: 'sql',
    xml: 'xml',
    svg: 'xml',
  };
  return langMap[ext || ''] || 'plaintext';
}

export function CodeEditor() {
  const { activeFilePath, fileContents } = useIDEStore();

  const currentContent = activeFilePath ? fileContents[activeFilePath] || '' : '';
  const language = getLanguage(activeFilePath);

  if (!activeFilePath) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-[#1e1e1e]">
        <div className="text-center text-muted-foreground">
          <FileIcon />
          <p className="text-lg font-medium mt-4">اختر ملفًا للتعديل</p>
          <p className="text-sm mt-1">اختر ملفًا من مستعرض الملفات على اليسار</p>
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
        options={{
          minimap: { enabled: true, scale: 2 },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          padding: { top: 12 },
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          bracketPairColorization: { enabled: true },
          guides: {
            bracketPairs: true,
            indentation: true,
          },
        }}
      />
    </div>
  );
}

function FileIcon() {
  return (
    <svg className="w-16 h-16 mx-auto text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}
