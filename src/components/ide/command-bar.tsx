'use client';

import { useState } from 'react';
import { useIDEStore } from '@/store/ide-store';
import { useWebContainer } from '@/hooks/use-webcontainer';
import { Terminal, Play, Trash2, Sparkles } from 'lucide-react';

export function CommandBar() {
  const [commandInput, setCommandInput] = useState('');
  const { clearTerminal, isWebContainerReady, isBooting } = useIDEStore();
  const { runCommand } = useWebContainer();

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;

    await runCommand(commandInput.trim());
    setCommandInput('');
  };

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
        <button
          onClick={clearTerminal}
          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          title="مسح الطرفية"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
