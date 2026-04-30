import { NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/client';
import { checkRateLimit } from '@/lib/rate-limit';

const MAX_PROMPT_LENGTH = 5000;

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { ok, retryAfter } = checkRateLimit(ip);

  if (!ok) {
    return NextResponse.json(
      { error: `请求过于频繁，请 ${retryAfter} 秒后重试` },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const { model, prompt, maxTokens, temperature } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: '缺少 prompt 参数' }, { status: 400 });
    }

    if (prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json({ error: `prompt 过长，最多 ${MAX_PROMPT_LENGTH} 字符` }, { status: 400 });
    }

    const allowedModels = ['glm-5.1', 'deepseek-v4', 'mimo-v2', 'mimo-v2-pro'];
    const selectedModel = allowedModels.includes(model) ? model : 'mimo-v2';

    const result = await callAI({
      model: selectedModel,
      prompt,
      maxTokens: Math.min(maxTokens || 1000, 2000),
      temperature: temperature ?? 0.7,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('AI API route error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'AI request failed' },
      { status: 500 }
    );
  }
}
