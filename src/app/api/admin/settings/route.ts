import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/admin-data';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: '获取设置失败' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const body = await request.json();
    await saveSettings(body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '保存设置失败' }, { status: 500 });
  }
}
