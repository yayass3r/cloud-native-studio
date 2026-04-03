'use client';

import { FileExplorer } from './file-explorer';
import { CodeEditor } from './code-editor';
import { TerminalPanel } from './terminal';
import { LivePreview } from './live-preview';
import { AIChat } from './ai-chat';
import { CommandBar } from './command-bar';
import { useIDEStore } from '@/store/ide-store';
import { useWebContainer } from '@/hooks/use-webcontainer';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import {
  Cloud,
  Loader2,
  CheckCircle2,
  Code2,
} from 'lucide-react';

function ResizeHandle({ direction = 'horizontal' }: { direction?: 'horizontal' | 'vertical' }) {
  return (
    <ResizableHandle
      className={`group relative flex items-center justify-center ${
        direction === 'horizontal'
          ? 'w-1 hover:w-1.5 bg-transparent hover:bg-violet-500/30'
          : 'h-1 hover:h-1.5 bg-transparent hover:bg-violet-500/30'
      } transition-all duration-150`}
    >
      <div
        className={`rounded-sm transition-all duration-150 ${
          direction === 'horizontal'
            ? 'w-px h-8 group-hover:h-12 bg-border group-hover:bg-violet-500'
            : 'h-px w-8 group-hover:w-12 bg-border group-hover:bg-violet-500'
        }`}
      />
    </ResizableHandle>
  );
}

export function IDELayout() {
  const { isWebContainerReady, isBooting, activeFilePath } = useIDEStore();
  // Initialize WebContainer on mount
  useWebContainer();

  return (
    <div className="h-screen w-screen flex flex-col bg-[#1e1e1e] text-foreground overflow-hidden">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-1.5 bg-[#181818] border-b border-border/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 flex items-center justify-center">
              <Cloud className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Cloud-Native Studio
              </h1>
            </div>
          </div>
          <div className="w-px h-5 bg-border/50" />
          <span className="text-xs text-muted-foreground" dir="rtl">بيئة تطوير متكاملة في المتصفح</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {isBooting && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 text-xs">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>جاري التحميل</span>
              </div>
            )}
            {isWebContainerReady && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs">
                <CheckCircle2 className="w-3 h-3" />
                <span>جاهز</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* File Explorer */}
          <ResizablePanel defaultSize={18} minSize={12} maxSize={30}>
            <div className="h-full bg-[#252526]">
              <FileExplorer />
            </div>
          </ResizablePanel>

          <ResizeHandle />

          {/* Editor + Terminal */}
          <ResizablePanel defaultSize={isWebContainerReady ? 42 : 60} minSize={25}>
            <div className="h-full flex flex-col bg-[#1e1e1e]">
              {/* Editor Tabs */}
              <div className="flex items-center bg-[#252526] border-b border-border/50 shrink-0">
                <div className="flex items-center min-w-0">
                  {activeFilePath && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e1e] border-r border-border/50 text-sm">
                      <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="truncate max-w-[150px]">{activeFilePath}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Code Editor */}
              <div className="flex-1 overflow-hidden">
                <CodeEditor />
              </div>

              {/* Command Bar */}
              <CommandBar />

              {/* Terminal */}
              <div className="h-[200px] shrink-0 border-t border-border/50">
                <TerminalPanel />
              </div>
            </div>
          </ResizablePanel>

          <ResizeHandle />

          {/* Live Preview */}
          <ResizablePanel defaultSize={isWebContainerReady ? 40 : 0} minSize={0}>
            <LivePreview />
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* AI Chat */}
        <div className="w-[320px] shrink-0">
          <AIChat />
        </div>
      </div>
    </div>
  );
}
