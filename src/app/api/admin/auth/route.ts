import { NextResponse } from 'next/server';
import { signToken, verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: '请输入密码' }, { status: 400 });
    }

    if (!verifyPassword(password)) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 });
    }

    const token = await signToken({ admin: true });
    const isProd = process.env.NODE_ENV === 'production';

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
