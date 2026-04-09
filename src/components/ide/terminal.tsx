'use client';

import { useEffect, useRef } from 'react';
import { useIDEStore } from '@/store/ide-store';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

export function TerminalPanel() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const lastOutputLengthRef = useRef(0);
  const { terminalOutput, isWebContainerReady, runningProcess } = useIDEStore();

  // Create xterm instance once
  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const xterm = new XTerm({
      theme: {
        background: '#0d1117',
        foreground: '#c9d1d9',
        cursor: '#58a6ff',
        cursorAccent: '#0d1117',
        selectionBackground: '#264f78',
        black: '#484f58',
        red: '#ff7b72',
        green: '#3fb950',
        yellow: '#d29922',
        blue: '#58a6ff',
        magenta: '#bc8cff',
        cyan: '#39d353',
        white: '#b1bac4',
        brightBlack: '#6e7681',
        brightRed: '#ffa198',
        brightGreen: '#56d364',
        brightYellow: '#e3b341',
        brightBlue: '#79c0ff',
        brightMagenta: '#d2a8ff',
        brightCyan: '#56d364',
        brightWhite: '#f0f6fc',
      },
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
      fontSize: 12,
      lineHeight: 1.4,
      cursorBlink: true,
      cursorStyle: 'block',
      scrollback: 5000,
      scrollbackSensitivity: 60,
      allowProposedApi: true,
    });

    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.open(terminalRef.current);

    // Fit with slight delay
    const fitTimeout = setTimeout(() => fitAddon.fit(), 150);

    xtermRef.current = xterm;

    const handleResize = () => {
      setTimeout(() => fitAddon.fit(), 50);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(fitTimeout);
      window.removeEventListener('resize', handleResize);
      xterm.dispose();
      xtermRef.current = null;
      lastOutputLengthRef.current = 0;
    };
  }, []);

  // Write ONLY new output lines to xterm (fixes duplication bug)
  useEffect(() => {
    if (!xtermRef.current) return;

    const newLines = terminalOutput.slice(lastOutputLengthRef.current);
    if (newLines.length > 0) {
      xtermRef.current.write(newLines.join('\n') + '\n');
      lastOutputLengthRef.current = terminalOutput.length;
    }
  }, [terminalOutput]);

  // Connect xterm keyboard input to running process stdin
  useEffect(() => {
    const xterm = xtermRef.current;
    if (!xterm) return;

    const handleData = (data: string) => {
      if (!isWebContainerReady) return;

      const proc = useIDEStore.getState().runningProcess;
      if (proc && proc.input) {
        const writer = proc.input.getWriter();
        writer.write(data);
        writer.releaseLock();
      }
    };

    xterm.onData(handleData);

    return () => {
      xterm.offData(handleData);
    };
  }, [isWebContainerReady]);

  // Reset output tracker when terminal is cleared
  useEffect(() => {
    if (terminalOutput.length === 0 && lastOutputLengthRef.current > 0) {
      lastOutputLengthRef.current = 0;
      if (xtermRef.current) {
        xtermRef.current.clear();
      }
    }
  }, [terminalOutput.length]);

  return (
    <div className="h-full w-full bg-[#0d1117]">
      <div ref={terminalRef} className="h-full w-full" />
    </div>
  );
}
