'use client';

import { FileExplorer } from './file-explorer';
import { CodeEditor } from './code-editor';
import { TerminalPanel } from './terminal';
import { LivePreview } from './live-preview';
import { AIChat } from './ai-chat';
import { CommandBar } from './command-bar';
import { MobileNav } from './mobile-nav';
import { PromoBox } from './promo-box';
import { useIDEStore } from '@/store/ide-store';
import { useWebContainer } from '@/hooks/use-webcontainer';
import { useIsMobile } from '@/hooks/use-mobile';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  Cloud,
  Loader2,
  CheckCircle2,
  Code2,
  Info,
  PanelRightClose,
  PanelRightOpen,
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

function MobilePanel({ children, tabId }: { children: React.ReactNode; tabId: string }) {
  const { mobileActiveTab } = useIDEStore();
  return (
    <AnimatePresence mode="wait">
      {mobileActiveTab === tabId && (
        <motion.div
          key={tabId}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="h-full w-full"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MobileHeader() {
  const { isWebContainerReady, isBooting, mobileActiveTab, activeFilePath } = useIDEStore();
  const [promoOpen, setPromoOpen] = useState(false);

  const tabTitles: Record<string, string> = {
    editor: activeFilePath || 'المحرر',
    files: 'ملفات المشروع',
    preview: 'المعاينة الحية',
    terminal: 'الطرفية',
    ai: 'المساعد الذكي',
  };

  return (
    <>
      <header className="flex items-center justify-between px-3 py-2 bg-[#181818] border-b border-border/50 shrink-0 safe-top" style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0px))' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Cloud className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
              Cloud-Native
            </h1>
            <p className="text-[10px] text-muted-foreground leading-tight">{tabTitles[mobileActiveTab]}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isBooting && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-[11px]">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>تحميل</span>
            </div>
          )}
          {isWebContainerReady && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-[11px]">
              <CheckCircle2 className="w-3 h-3" />
              <span>جاهز</span>
            </div>
          )}
          <button
            onClick={() => setPromoOpen(true)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 active:bg-accent/30 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="عن المشروع"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>
      <PromoBox open={promoOpen} onOpenChange={setPromoOpen} />
    </>
  );
}

function DesktopHeader() {
  const { isWebContainerReady, isBooting, isAIChatOpen, toggleAIChat } = useIDEStore();
  const [promoOpen, setPromoOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between px-4 py-1.5 bg-[#181818] border-b border-border/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 flex items-center justify-center">
              <Cloud className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-sm font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Cloud-Native Studio
            </h1>
          </div>
          <div className="w-px h-5 bg-border/50" />
          <span className="text-xs text-muted-foreground hidden lg:inline">بيئة تطوير متكاملة في المتصفح</span>
        </div>
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
          <button
            onClick={toggleAIChat}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            title={isAIChatOpen ? 'إخفاء المساعد الذكي' : 'عرض المساعد الذكي'}
          >
            {isAIChatOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setPromoOpen(true)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            title="عن المشروع"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </header>
      <PromoBox open={promoOpen} onOpenChange={setPromoOpen} />
    </>
  );
}

function DesktopLayout() {
  const { isWebContainerReady, activeFilePath, isAIChatOpen } = useIDEStore();

  return (
    <>
      <DesktopHeader />
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={18} minSize={12} maxSize={30}>
            <div className="h-full bg-[#252526]">
              <FileExplorer />
            </div>
          </ResizablePanel>
          <ResizeHandle />
          <ResizablePanel defaultSize={isWebContainerReady ? 42 : 60} minSize={25}>
            <div className="h-full flex flex-col bg-[#1e1e1e]">
              <div className="flex items-center bg-[#252526] border-b border-border/50 shrink-0">
                {activeFilePath && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e1e] border-l border-border/50 text-sm">
                    <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="truncate max-w-[150px]">{activeFilePath}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <CodeEditor />
              </div>
              <CommandBar />
              <div className="h-[200px] shrink-0 border-t border-border/50">
                <TerminalPanel />
              </div>
            </div>
          </ResizablePanel>
          <ResizeHandle />
          <ResizablePanel defaultSize={isWebContainerReady ? 40 : 0} minSize={0}>
            <LivePreview />
          </ResizablePanel>
        </ResizablePanelGroup>
        {/* AI Chat sidebar - collapsible */}
        <AnimatePresence mode="wait">
          {isAIChatOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="h-full overflow-hidden border-l border-border/50"
            >
              <div className="w-[320px] h-full">
                <AIChat />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Floating AI button when sidebar is closed */}
        {!isAIChatOpen && (
          <button
            onClick={() => useIDEStore.getState().setIsAIChatOpen(true)}
            className="fixed bottom-4 left-4 z-50 p-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            title="فتح المساعد الذكي"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/></svg>
          </button>
        )}
      </div>
    </>
  );
}

function MobileLayout() {
  const { mobileActiveTab, activeFilePath } = useIDEStore();

  return (
    <>
      <MobileHeader />

      {/* Editor Tab */}
      <MobilePanel tabId="editor">
        <div className="h-full flex flex-col bg-[#1e1e1e]">
          {activeFilePath && (
            <div className="flex items-center bg-[#252526] border-b border-border/50 shrink-0 px-2">
              <div className="flex items-center gap-1.5 px-2 py-1.5 bg-[#1e1e1e] border-b-2 border-violet-500 text-xs rounded-t-sm">
                <Code2 className="w-3 h-3 text-muted-foreground" />
                <span className="truncate max-w-[180px]">{activeFilePath}</span>
              </div>
            </div>
          )}
          <div className="flex-1 overflow-hidden">
            <CodeEditor isMobile={true} />
          </div>
          <CommandBar isMobile={true} />
        </div>
      </MobilePanel>

      {/* Files Tab */}
      <MobilePanel tabId="files">
        <div className="h-full bg-[#252526]">
          <FileExplorer isMobile={true} />
        </div>
      </MobilePanel>

      {/* Preview Tab */}
      <MobilePanel tabId="preview">
        <LivePreview isMobile={true} />
      </MobilePanel>

      {/* Terminal Tab */}
      <MobilePanel tabId="terminal">
        <div className="h-full bg-[#0d1117]">
          <TerminalPanel />
        </div>
      </MobilePanel>

      {/* AI Tab */}
      <MobilePanel tabId="ai">
        <AIChat isMobile={true} />
      </MobilePanel>

      <MobileNav />
    </>
  );
}

export function IDELayout() {
  const isMobile = useIsMobile();
  useWebContainer();

  return (
    <div className="h-screen w-screen flex flex-col bg-[#1e1e1e] text-foreground overflow-hidden">
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </div>
  );
}
