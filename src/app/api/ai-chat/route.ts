import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    // AI-powered response using z-ai-web-dev-sdk
    const ZAI = await import('z-ai-web-dev-sdk');
    const zai = await (ZAI.default || ZAI).create();

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `أنت مساعد ذكي متخصص في تطوير الويب. أنت تعمل داخل Cloud-Native Studio وهو بيئة تطوير متكاملة تعمل داخل المتصفح باستخدام WebContainers. أجب بلغة المستخدم. كن مختصرًا ومفيدًا. استخدم Markdown عند الحاجة.`
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = completion.choices?.[0]?.message?.content || 'عذراً، لم أتمكن من معالجة طلبك.';

    return NextResponse.json({ reply });
  } catch (error: any) {
    return NextResponse.json(
      { reply: `عذراً، حدث خطأ في الخادم: ${error.message}` },
      { status: 500 }
    );
  }
}
