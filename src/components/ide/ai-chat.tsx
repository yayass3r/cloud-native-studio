'use client';

import { useIDEStore } from '@/store/ide-store';
import { Send, X, Bot, User, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect, FormEvent } from 'react';

export function AIChat({ isMobile = false }: { isMobile?: boolean }) {
  const { chatMessages, addChatMessage } = useIDEStore();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    addChatMessage({ role: 'user', content: userMessage });
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      const data = await response.json();
      addChatMessage({ role: 'assistant', content: data.reply || 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.' });
    } catch {
      setTimeout(() => {
        addChatMessage({
          role: 'assistant',
          content: `شكرًا لسؤالك! أنا مساعدك الذكي في Cloud-Native Studio.\n\nحاليًا، تم عرض إجابة افتراضية. لتفعيل المساعد الذكي بالكامل، يمكن ربط واجهة AI API.\n\n💡 **نصائح سريعة:**\n- استخدم \`npm install\` لتثبيت الحزم\n- استخدم \`npm run dev\` لتشغيل المشروع\n- حرر الملفات مباشرة من المحرر`
        });
      }, 1000);
    }

    setIsTyping(false);
  };

  // Mobile: always open, full screen, no floating button
  if (isMobile) {
    return (
      <div className="h-full flex flex-col bg-[#1e1e1e]" dir="rtl">
        {/* Mobile Chat Header */}
        <div className="flex items-center gap-2 px-3 py-3 border-b border-border/50 bg-[#252526]">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">المساعد الذكي</h3>
            <p className="text-[10px] text-muted-foreground">مدعوم بالذكاء الاصطناعي</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
          {chatMessages.map((msg, idx) => (
            <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-violet-600 to-purple-600'
                  : 'bg-gradient-to-br from-cyan-600 to-teal-600'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-violet-600/20 text-violet-100 rounded-tr-sm'
                  : 'bg-[#252526] text-foreground rounded-tl-sm'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-teal-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-[#252526] rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-border/50 bg-[#252526] safe-bottom" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))' }}>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
              className="flex-1 bg-muted/50 border border-border/50 rounded-xl px-4 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-colors"
              dir="rtl"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="p-2.5 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Desktop: sidebar behavior
  if (!isAIChatOpen) {
    return (
      <button
        onClick={toggleAIChat}
        className="fixed bottom-4 left-4 z-50 p-3 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
        title="فتح المساعد الذكي"
      >
        <Sparkles className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] border-l border-border/50" dir="rtl">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 bg-[#252526]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">المساعد الذكي</h3>
            <p className="text-[10px] text-muted-foreground">مدعوم بالذكاء الاصطناعي</p>
          </div>
        </div>
        <button onClick={toggleAIChat} className="p-1 rounded hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-gradient-to-r from-violet-600 to-purple-600' : 'bg-gradient-to-r from-cyan-600 to-teal-600'
            }`}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
              msg.role === 'user' ? 'bg-violet-600/20 text-violet-100' : 'bg-muted/50 text-foreground'
            }`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-600 to-teal-600 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-muted/50 rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-border/50 bg-[#252526]">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب سؤالك هنا..."
            className="flex-1 bg-muted/50 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-colors"
            dir="rtl"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="p-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-muted-foreground/50 mt-1.5 text-center">قد لا تكون الإجابات دقيقة دائمًا</p>
      </div>
    </div>
  );
}
