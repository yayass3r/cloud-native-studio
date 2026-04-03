'use client';

import { useIDEStore } from '@/store/ide-store';
import { Globe, RefreshCw, ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useState } from 'react';

export function LivePreview() {
  const { previewUrl, isWebContainerReady } = useIDEStore();
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      default: return 'w-full';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Preview Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/50 bg-[#252526]">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">المعاينة الحية</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-1 rounded transition-colors ${viewMode === 'desktop' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="سطح المكتب"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('tablet')}
            className={`p-1 rounded transition-colors ${viewMode === 'tablet' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="جهاز لوحي"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-1 rounded transition-colors ${viewMode === 'mobile' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="هاتف"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
          {previewUrl && (
            <>
              <div className="w-px h-4 bg-border/50 mx-1" />
              <button
                onClick={() => window.open(previewUrl, '_blank')}
                className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                title="فتح في نافذة جديدة"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  const iframe = document.querySelector('iframe');
                  if (iframe) iframe.src = iframe.src;
                }}
                className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                title="تحديث"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
        {!isWebContainerReady ? (
          <div className="text-center text-muted-foreground">
            <div className="animate-spin w-10 h-10 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full mx-auto mb-3" />
            <p className="text-sm">جاري تشغيل بيئة التطوير...</p>
            <p className="text-xs mt-1 text-muted-foreground/70">يرجى الانتظار حتى يتم تحميل WebContainer</p>
          </div>
        ) : !previewUrl ? (
          <div className="text-center text-muted-foreground">
            <Globe className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm">لا توجد معاينة متاحة</p>
            <p className="text-xs mt-1 text-muted-foreground/70">قم بتشغيل خادم التطوير باستخدام <code className="bg-muted px-1 py-0.5 rounded text-xs">npm run dev</code></p>
          </div>
        ) : (
          <div className={`h-full w-full ${getPreviewWidth()} transition-all duration-300 mx-auto`}>
            <iframe
              src={previewUrl}
              className="h-full w-full rounded border border-border/30 bg-white"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              title="Live Preview"
            />
          </div>
        )}
      </div>
    </div>
  );
}
