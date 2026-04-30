import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    DOUBAO_API_KEY: process.env.DOUBAO_API_KEY ? '✅ 已配置' : '❌ 未配置',
    DOUBAO_MODEL_ID: process.env.DOUBAO_MODEL_ID || '❌ 未配置',
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY ? '✅ 已配置' : '❌ 未配置',
    MIMO_API_KEY: process.env.MIMO_API_KEY ? '✅ 已配置' : '❌ 未配置',
    MIMO_MODEL_ID: process.env.MIMO_MODEL_ID || '❌ 未配置',
  });
}
