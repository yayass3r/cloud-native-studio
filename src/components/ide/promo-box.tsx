'use client';

import { useState } from 'react';
import { Copy, Check, Sparkles, Cpu, Globe, MessageSquareCode, Layout, Layers } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const promoSections = [
  {
    icon: <Cpu className="w-4 h-4 text-violet-400" />,
    title: 'الإطار التقني المتقدم',
    items: [
      'المحرك الأساسي: استخدام @webcontainer/api لتشغيل بيئة Node.js داخل المتصفح',
      'الإطار البرمجي: Next.js مع دعم SharedArrayBuffer',
      'الواجهة: Tailwind CSS، مكتبة Shadcn/ui، وخط Tajawal لدعم العربية',
    ],
  },
  {
    icon: <Layers className="w-4 h-4 text-cyan-400" />,
    title: 'الميزات والربط البرمجي',
    items: [
      'بيئة التشغيل: إعداد WebContainers لتشغيل npm install و npm run dev في المتصفح',
      'الربط الخارجي: دمج APIs لـ Supabase لقواعد البيانات و Vercel للنشر الفوري',
      'الذكاء الاصطناعي: واجهة تشات جانبية ترتبط بنماذج مفتوحة المصدر (Llama 3/DeepSeek) لتوليد الكود',
    ],
  },
  {
    icon: <Layout className="w-4 h-4 text-green-400" />,
    title: 'تجربة المستخدم',
    items: [
      'واجهة Split Screen (محرر Monaco، معاينة Iframe، دردشة ذكية)',
      'دعم كامل للـ RTL في الواجهة العربية',
      'تصميم متجاوب يعمل بسلاسة على الهاتف المحمول وسطح المكتب',
    ],
  },
];

const fullPromoText = `أنت خبير في هندسة البرمجيات السحابية وتقنيات الـ WebContainers. مهمتك هي بناء تطبيق ويب متطور يعمل كـ Full-Stack IDE داخل المتصفح، يشبه Replit في قوته و Kimi في ذكائه.

1. الإطار التقني المتقدم:
- المحرك الأساسي: استخدام @webcontainer/api لتشغيل بيئة Node.js داخل المتصفح.
- الإطار البرمجي: Next.js مع دعم SharedArrayBuffer.
- الواجهة: Tailwind CSS، مكتبة Shadcn/ui، وخط Tajawal لدعم العربية.

2. الميزات والربط البرمجي:
- بيئة التشغيل: إعداد WebContainers لتشغيل npm install و npm run dev في المتصفح.
- الربط الخارجي: دمج APIs لـ Supabase لقواعد البيانات و Vercel للنشر الفوري.
- الذكاء الاصطناعي: واجهة تشات جانبية ترتبط بنماذج مفتوحة المصدر (Llama 3/DeepSeek) لتوليد الكود.

3. تجربة المستخدم:
- واجهة Split Screen (محرر Monaco، معاينة Iframe، دردشة ذكية).
- دعم كامل للـ RTL في الواجهة العربية.

4. المطلوب الآن:
ابدأ بتزويدي بالخطوات التقنية لتهيئة WebContainer Instance داخل Next.js، وكود عرض مخرجات الـ Terminal، مع ملف index.js الأساسي للحاوية.`;

export function PromoBox({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullPromoText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = fullPromoText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-[#1a1b2e] border-violet-500/20 text-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-lg">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                Cloud-Native Studio
              </span>
              <span className="text-muted-foreground font-normal mr-2">— البرومو</span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-right" dir="rtl">
            وصف شامل للمشروع — بيئة تطوير متكاملة تعمل بالكامل داخل المتصفح
          </DialogDescription>
        </DialogHeader>

        {/* Promo Content */}
        <div className="space-y-5 mt-2" dir="rtl">
          {/* Hero Section */}
          <div className="relative rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-purple-600/5 to-cyan-600/10" />
            <div className="relative px-5 py-4 border border-violet-500/15 rounded-xl bg-[#12132a]/60">
              <p className="text-sm leading-relaxed text-foreground/90">
                أنت <strong className="text-violet-400">خبير في هندسة البرمجيات السحابية</strong> وتقنيات الـ WebContainers. مهمتك هي بناء تطبيق ويب متطور يعمل كـ{' '}
                <strong className="text-cyan-400">Full-Stack IDE</strong> داخل المتصفح، يشبه{' '}
                <strong className="text-green-400">Replit</strong> في قوته و{' '}
                <strong className="text-violet-400">Kimi</strong> في ذكائه.
              </p>
            </div>
          </div>

          {/* Feature Sections */}
          {promoSections.map((section, idx) => (
            <div key={idx} className="rounded-xl border border-border/40 overflow-hidden bg-[#12132a]/40">
              <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#181932] border-b border-border/30">
                {section.icon}
                <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              </div>
              <ul className="space-y-0">
                {section.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:bg-accent/20 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500/50 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Bottom CTA */}
          <div className="rounded-xl border border-violet-500/15 bg-gradient-to-r from-violet-600/5 to-cyan-600/5 px-5 py-3.5">
            <div className="flex items-start gap-2.5">
              <Globe className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1.5">4. المطلوب الآن:</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  ابدأ بتزويدي بالخطوات التقنية لتهيئة WebContainer Instance داخل Next.js، وكود عرض مخرجات الـ Terminal، مع ملف index.js الأساسي للحاوية.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copy Button */}
        <div className="flex items-center justify-end pt-2 border-t border-border/30 mt-4">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 min-h-[44px] ${
              copied
                ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                : 'bg-gradient-to-r from-violet-600 to-cyan-600 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>نسخ البرومو</span>
              </>
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
