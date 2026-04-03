'use client';

import { useIDEStore } from '@/store/ide-store';
import { Globe, RefreshCw, ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react';
import { useState } from 'react';

export function LivePreview({ isMobile = false }: { isMobile?: boolean }) {
  const { previewUrl, isWebContainerReady } = useIDEStore();
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const iframe = document.querySelector('iframe');
    if (iframe) iframe.src = iframe.src;
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getPreviewWidth = () => {
    if (isMobile) return 'w-full';
    switch (viewMode) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      default: return 'w-full';
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e]">
      {/* Preview Toolbar */}
      <div className={`flex items-center justify-between border-b border-border/50 bg-[#252526] shrink-0 ${isMobile ? 'px-3 py-2.5' : 'px-3 py-1.5'}`}>
        <div className="flex items-center gap-2">
          <Globe className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} text-muted-foreground`} />
          <span className={`${isMobile ? 'text-sm font-medium' : 'text-xs'} text-muted-foreground`}>
            المعاينة الحية
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* View mode buttons only on desktop */}
          {!isMobile && (
            <>
              <button onClick={() => setViewMode('desktop')} className={`p-1 rounded transition-colors ${viewMode === 'desktop' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`} title="سطح المكتب">
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setViewMode('tablet')} className={`p-1 rounded transition-colors ${viewMode === 'tablet' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`} title="جهاز لوحي">
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setViewMode('mobile')} className={`p-1 rounded transition-colors ${viewMode === 'mobile' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'}`} title="هاتف">
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {previewUrl && (
            <>
              <button onClick={handleRefresh} className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors" title="تحديث">
                <RefreshCw className={`${isMobile ? 'w-4 h-4' : 'w-3.5 h-3.5'} ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              {!isMobile && (
                <button onClick={() => window.open(previewUrl, '_blank')} className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors" title="فتح في نافذة جديدة">
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <div className={`flex-1 flex items-center justify-center ${isMobile ? 'p-0' : 'p-2'} overflow-hidden`}>
        {!isWebContainerReady ? (
          <div className="text-center text-muted-foreground px-6">
            <div className="animate-spin w-10 h-10 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full mx-auto mb-3" />
            <p className="text-sm">جاري تشغيل بيئة التطوير...</p>
            <p className="text-xs mt-1 text-muted-foreground/70">يرجى الانتظار حتى يتم تحميل WebContainer</p>
          </div>
        ) : !previewUrl ? (
          <div className="text-center text-muted-foreground px-6">
            <Globe className="w-12 h-12 mx-auto mb-3 text-muted-foreground/40" />
            <p className="text-sm">لا توجد معاينة متاحة</p>
            <p className="text-xs mt-1 text-muted-foreground/70">
              {isMobile ? (
                <>انتقل إلى &quot;المحرر&quot; وشغّل <code className="bg-muted px-1 py-0.5 rounded text-xs">npm run dev</code></>
              ) : (
                <>قم بتشغيل خادم التطوير باستخدام <code className="bg-muted px-1 py-0.5 rounded text-xs">npm run dev</code></>
              )}
            </p>
          </div>
        ) : (
          <div className={`h-full w-full ${getPreviewWidth()} transition-all duration-300 ${isMobile ? '' : 'mx-auto'}`}>
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
