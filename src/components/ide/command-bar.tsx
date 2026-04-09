'use client';

import { useState } from 'react';
import { useIDEStore } from '@/store/ide-store';
import { useWebContainer } from '@/hooks/use-webcontainer';
import { Terminal, Play, Trash2, Sparkles, RotateCcw } from 'lucide-react';

export function CommandBar({ isMobile = false }: { isMobile?: boolean }) {
  const [commandInput, setCommandInput] = useState('');
  const { clearTerminal, isWebContainerReady, isBooting, mobileActiveTab, setMobileActiveTab } = useIDEStore();
  const { runCommand, bootWebContainer } = useWebContainer();

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    await runCommand(commandInput.trim());
    setCommandInput('');
    if (isMobile) setMobileActiveTab('terminal');
  };

  const handleReboot = () => {
    clearTerminal();
    bootWebContainer();
  };

  if (isMobile) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-[#252526] border-t border-border/50 shrink-0">
        <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
        <form onSubmit={handleCommandSubmit} className="flex-1 flex items-center gap-2">
          <span className="text-muted-foreground text-sm font-mono">$</span>
          <input
            type="text"
            value={commandInput}
            onChange={(e) => setCommandInput(e.target.value)}
            placeholder="أدخل أمرًا..."
            disabled={!isWebContainerReady || isBooting}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
            dir="ltr"
          />
        </form>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => { runCommand('npm run dev'); setMobileActiveTab('terminal'); }}
            disabled={!isWebContainerReady || isBooting}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs bg-green-500/15 hover:bg-green-500/25 rounded-lg border border-green-500/20 text-green-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[36px]"
            dir="ltr"
          >
            <Play className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">run dev</span>
          </button>
          <button
            onClick={() => { runCommand('npm install'); setMobileActiveTab('terminal'); }}
            disabled={!isWebContainerReady || isBooting}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg bg-muted/30 hover:bg-accent/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="npm install"
          >
            <Terminal className="w-4 h-4" />
          </button>
          <button
            onClick={handleReboot}
            disabled={isBooting}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg bg-muted/30 hover:bg-accent/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="إعادة تشغيل البيئة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={clearTerminal}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg bg-muted/30 hover:bg-accent/50 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="مسح الطرفية"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Desktop layout
  const quickCommands = [
    { label: 'npm install', icon: <Terminal className="w-3.5 h-3.5" /> },
    { label: 'npm run dev', icon: <Play className="w-3.5 h-3.5" /> },
    { label: 'npm run build', icon: <Terminal className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#252526] border-b border-border/50">
      <Sparkles className="w-4 h-4 text-violet-400" />
      <form onSubmit={handleCommandSubmit} className="flex-1 flex items-center gap-2">
        <span className="text-muted-foreground text-sm font-mono">$</span>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder={isWebContainerReady ? "أدخل أمرًا... (مثال: npm run dev)" : "جاري تحميل البيئة..."}
          disabled={!isWebContainerReady || isBooting}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
          dir="ltr"
        />
      </form>
      <div className="flex items-center gap-1">
        {quickCommands.map((cmd) => (
          <button
            key={cmd.label}
            onClick={() => runCommand(cmd.label)}
            disabled={!isWebContainerReady || isBooting}
            className="flex items-center gap-1 px-2 py-0.5 text-xs bg-muted/50 hover:bg-accent/50 rounded border border-border/30 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title={cmd.label}
            dir="ltr"
          >
            {cmd.icon}
            {cmd.label}
          </button>
        ))}
        <div className="w-px h-4 bg-border/50 mx-0.5" />
        <button onClick={handleReboot} disabled={isBooting} className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50" title="إعادة تشغيل البيئة">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button onClick={clearTerminal} className="p-1 text-muted-foreground hover:text-foreground transition-colors" title="مسح الطرفية">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
