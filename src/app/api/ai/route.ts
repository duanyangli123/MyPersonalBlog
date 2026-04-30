import { NextResponse } from 'next/server';
import { callAI } from '@/lib/ai/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { model, prompt, maxTokens, temperature } = body;

    if (!prompt) {
      return NextResponse.json({ error: '缺少 prompt 参数' }, { status: 400 });
    }

    const result = await callAI({
      model: model || 'glm-5.1',
      prompt,
      maxTokens: maxTokens || 1000,
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
