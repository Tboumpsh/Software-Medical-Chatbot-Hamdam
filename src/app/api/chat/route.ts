// =====================================================================
//  Hamdam – /api/chat Route (Fully Local – No External AI API)
//  Processes messages using local knowledge base, intent classifier,
//  and response engine. Zero external dependencies.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkSafety, isPrescriptiveRequest } from '@/features/chat/utils/safetyCheck';
import { classify } from '@/lib/ai/intentClassifier';
import { generateResponse, streamChunks } from '@/lib/ai/responseEngine';
import { CHAT_CONSTANTS } from '@/features/chat/constants';

const ChatRequestSchema = z.object({
  sessionId: z.string().min(1).max(128),
  message: z.string().min(1).max(CHAT_CONSTANTS.MAX_MESSAGE_LENGTH),
  mode: z.enum(['medical', 'software']),
  history: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(4000) })).max(CHAT_CONSTANTS.MAX_HISTORY_LENGTH),
});

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX ?? '60', 10);
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '3600000', 10);
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.resetAt < now) { rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs }); return true; }
  if (entry.count >= maxRequests) return false;
  entry.count++;
  return true;
}

function auditLog(event: Record<string, string | number>) {
  console.warn('[AUDIT]', JSON.stringify({ ...event, ts: new Date().toISOString() }));
}

const STREAM_DELAY_MS = 28;
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'تعداد درخواست‌های شما به حداکثر رسیده است.' }, { status: 429 });
  }

  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'داده نامعتبر است.' }, { status: 400 }); }

  const parsed = ChatRequestSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'ورودی نامعتبر است.' }, { status: 400 });

  const { sessionId, message, mode, history } = parsed.data;
  const safety = checkSafety(message);

  auditLog({ type: 'chat', sessionId, mode, safetyLevel: safety.level, msgLen: message.length });

  if (safety.level === 'emergency' && safety.emergencyAction) {
    const phoneText = safety.emergencyAction.phoneNumber ? `\n\n📞 **شماره اضطراری: ${safety.emergencyAction.phoneNumber}**` : '';
    return NextResponse.json({
      id: crypto.randomUUID(),
      content: `🚨 **${safety.emergencyAction.message}**${phoneText}\n\nلطفاً **همین الان** اقدام کنید.`,
      safetyLevel: 'emergency',
      emergencyAction: safety.emergencyAction,
    });
  }

  if (mode === 'medical' && isPrescriptiveRequest(message)) {
    return NextResponse.json({
      id: crypto.randomUUID(),
      content: 'متأسفم، تجویز دارو یا توصیه دوز مصرف خارج از توانایی من است. این کار فقط توسط **پزشک یا داروساز** مجاز است.',
      safetyLevel: 'caution',
    });
  }

  const classifierResult = classify(message, history);
  const generated = generateResponse(classifierResult, mode, message);

  const encoder = new TextEncoder();
  const responseId = crypto.randomUUID();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ id: responseId, safetyLevel: generated.safetyLevel })}\n\n`));
        for (const chunk of streamChunks(generated.content)) {
          await sleep(STREAM_DELAY_MS);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
        }
        if (generated.followUps?.length) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ followUps: generated.followUps })}\n\n`));
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      } catch {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'خطا در ارسال پاسخ.' })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Safety-Level': generated.safetyLevel,
      'X-Accel-Buffering': 'no',
    },
  });
}
