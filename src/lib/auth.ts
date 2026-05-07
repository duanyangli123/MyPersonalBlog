import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me-in-production-32chars!');
const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY = '24h';

export async function signToken(payload: Record<string, unknown>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function requireAdmin(): Promise<NextResponse | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: '未授权' }, { status: 401 });
  const payload = await verifyToken(token);
  if (payload?.admin !== true) return NextResponse.json({ error: 'Token无效' }, { status: 401 });
  return null;
}

export async function getAdminFromCookies(): Promise<boolean> {
  const result = await requireAdmin();
  return result === null;
}

export function getCookieName(): string {
  return COOKIE_NAME;
}

export function getTokenExpiry(): number {
  return 24 * 60 * 60 * 1000;
}

export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  return password === adminPassword;
}
