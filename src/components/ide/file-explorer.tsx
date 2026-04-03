'use client';

import { useIDEStore, type FileNode } from '@/store/ide-store';
import {
  FileText,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  FileCode,
  FileJson,
  File,
} from 'lucide-react';
import { useState } from 'react';

function getFileIcon(name: string, isMobile: boolean = false) {
  const size = isMobile ? 'w-5 h-5' : 'w-4 h-4';
  if (name.endsWith('.html')) return <FileCode className={`${size} text-orange-400`} />;
  if (name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.jsx') || name.endsWith('.tsx')) return <FileCode className={`${size} text-yellow-400`} />;
  if (name.endsWith('.json')) return <FileJson className={`${size} text-green-400`} />;
  if (name.endsWith('.css') || name.endsWith('.scss')) return <FileCode className={`${size} text-purple-400`} />;
  if (name.endsWith('.md')) return <FileText className={`${size} text-blue-400`} />;
  return <File className={`${size} text-muted-foreground`} />;
}

function FileTreeItem({ node, depth = 0, isMobile = false }: { node: FileNode; depth?: number; isMobile?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(depth === 0);
  const { activeFilePath, setActiveFile, mobileActiveTab, setMobileActiveTab } = useIDEStore();
  const isActive = activeFilePath === node.path;

  if (node.type === 'directory') {
    return (
      <div>
        <button
          className={`w-full flex items-center gap-2 px-3 hover:bg-accent/50 transition-colors rounded-sm text-muted-foreground ${
            isMobile ? 'py-2.5 min-h-[44px]' : 'py-1'
          }`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
          {isExpanded ? <FolderOpen className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} text-blue-400 shrink-0`} /> : <Folder className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} text-blue-400 shrink-0`} />}
          <span className={`truncate ${isMobile ? 'text-sm' : 'text-sm'}`}>{node.name}</span>
        </button>
        {isExpanded && node.children?.map((child) => (
          <FileTreeItem key={child.path} node={child} depth={depth + 1} isMobile={isMobile} />
        ))}
      </div>
    );
  }

  return (
    <button
      className={`w-full flex items-center gap-2.5 px-3 transition-colors rounded-sm ${
        isActive
          ? 'bg-violet-500/15 text-violet-300'
          : 'text-foreground hover:bg-accent/50'
      } ${isMobile ? 'py-2.5 min-h-[44px]' : 'py-1'}`}
      style={{ paddingLeft: `${depth * 16 + 24}px` }}
      onClick={() => {
        setActiveFile(node.path);
        if (isMobile) setMobileActiveTab('editor');
      }}
    >
      {getFileIcon(node.name, isMobile)}
      <span className={`truncate ${isMobile ? 'text-[15px]' : 'text-sm'}`}>{node.name}</span>
    </button>
  );
}

export function FileExplorer({ isMobile = false }: { isMobile?: boolean }) {
  const { files } = useIDEStore();

  return (
    <div className="h-full flex flex-col">
      <div className={`flex items-center justify-between ${isMobile ? 'px-4 py-3' : 'px-3 py-2'} border-b border-border/50`}>
        <h3 className={`font-semibold text-muted-foreground uppercase tracking-wider ${isMobile ? 'text-xs' : 'text-xs'}`}>
          {isMobile ? '📁 ملفات المشروع' : 'ملفات المشروع'}
        </h3>
      </div>
      <div className={`flex-1 overflow-y-auto py-1 scrollbar-thin ${isMobile ? 'px-1' : ''}`}>
        {files.length === 0 ? (
          <div className={`${isMobile ? 'px-4' : 'px-3'} py-8 text-sm text-muted-foreground text-center`}>
            <div className="animate-spin w-8 h-8 border-2 border-muted-foreground/20 border-t-muted-foreground rounded-full mx-auto mb-3" />
            <p>جاري تحميل الملفات...</p>
          </div>
        ) : (
          files.map((file) => (
            <FileTreeItem key={file.path} node={file} isMobile={isMobile} />
          ))
        )}
      </div>
    </div>
  );
}
