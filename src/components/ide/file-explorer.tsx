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

function getFileIcon(name: string) {
  if (name.endsWith('.html')) return <FileCode className="w-4 h-4 text-orange-400" />;
  if (name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.jsx') || name.endsWith('.tsx')) return <FileCode className="w-4 h-4 text-yellow-400" />;
  if (name.endsWith('.json')) return <FileJson className="w-4 h-4 text-green-400" />;
  if (name.endsWith('.css') || name.endsWith('.scss')) return <FileCode className="w-4 h-4 text-purple-400" />;
  if (name.endsWith('.md')) return <FileText className="w-4 h-4 text-blue-400" />;
  return <File className="w-4 h-4 text-muted-foreground" />;
}

function FileTreeItem({ node, depth = 0 }: { node: FileNode; depth?: number }) {
  const [isExpanded, setIsExpanded] = useState(depth === 0);
  const { activeFilePath, setActiveFile } = useIDEStore();
  const isActive = activeFilePath === node.path;

  if (node.type === 'directory') {
    return (
      <div>
        <button
          className="w-full flex items-center gap-1.5 px-2 py-1 text-sm hover:bg-accent/50 transition-colors rounded-sm"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          )}
          {isExpanded ? (
            <FolderOpen className="w-4 h-4 text-blue-400 shrink-0" />
          ) : (
            <Folder className="w-4 h-4 text-blue-400 shrink-0" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {isExpanded && node.children?.map((child) => (
          <FileTreeItem key={child.path} node={child} depth={depth + 1} />
        ))}
      </div>
    );
  }

  return (
    <button
      className={`w-full flex items-center gap-1.5 px-2 py-1 text-sm transition-colors rounded-sm ${
        isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'
      }`}
      style={{ paddingLeft: `${depth * 12 + 20}px` }}
      onClick={() => setActiveFile(node.path)}
    >
      {getFileIcon(node.name)}
      <span className="truncate">{node.name}</span>
    </button>
  );
}

export function FileExplorer() {
  const { files } = useIDEStore();

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 py-2 border-b border-border/50">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">ملفات المشروع</h3>
      </div>
      <div className="flex-1 overflow-y-auto py-1 scrollbar-thin">
        {files.length === 0 ? (
          <div className="px-3 py-4 text-sm text-muted-foreground text-center">
            جاري تحميل الملفات...
          </div>
        ) : (
          files.map((file) => (
            <FileTreeItem key={file.path} node={file} />
          ))
        )}
      </div>
    </div>
  );
}
