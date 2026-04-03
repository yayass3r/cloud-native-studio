'use client';

import { useIDEStore, type MobileTab } from '@/store/ide-store';
import { Code2, FolderOpen, Eye, Terminal, Sparkles } from 'lucide-react';

const tabs: { id: MobileTab; label: string; icon: React.ReactNode }[] = [
  { id: 'editor', label: 'المحرر', icon: <Code2 className="w-5 h-5" /> },
  { id: 'files', label: 'الملفات', icon: <FolderOpen className="w-5 h-5" /> },
  { id: 'preview', label: 'المعاينة', icon: <Eye className="w-5 h-5" /> },
  { id: 'terminal', label: 'الطرفية', icon: <Terminal className="w-5 h-5" /> },
  { id: 'ai', label: 'المساعد', icon: <Sparkles className="w-5 h-5" /> },
];

export function MobileNav() {
  const { mobileActiveTab, setMobileActiveTab, isWebContainerReady, previewUrl } = useIDEStore();

  const handleTabClick = (tab: MobileTab) => {
    setMobileActiveTab(tab);
  };

  return (
    <nav className="flex items-center justify-around bg-[#181818] border-t border-border/50 shrink-0 safe-bottom" style={{ height: 'calc(3.5rem + env(safe-area-inset-bottom, 0px))', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {tabs.map((tab) => {
        const isActive = mobileActiveTab === tab.id;
        const isDisabled =
          (tab.id === 'preview' && !previewUrl) ||
          (tab.id === 'terminal' && !isWebContainerReady);

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            disabled={isDisabled}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all duration-200 min-h-[44px] ${
              isActive
                ? 'text-violet-400'
                : isDisabled
                  ? 'text-muted-foreground/30 cursor-not-allowed'
                  : 'text-muted-foreground active:text-foreground/70'
            }`}
          >
            <div className="relative">
              {tab.icon}
              {isActive && (
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-violet-400" />
              )}
              {tab.id === 'ai' && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </div>
            <span className="text-[10px] font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
