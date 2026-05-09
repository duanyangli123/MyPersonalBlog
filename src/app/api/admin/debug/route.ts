import { NextResponse } from 'next/server';

export async function GET() {
  const hasPassword = !!process.env.ADMIN_PASSWORD;
  const hasSecret = !!process.env.JWT_SECRET;
  return NextResponse.json({
    hasAdminPassword: hasPassword,
    hasJwtSecret: hasSecret,
    nodeEnv: process.env.NODE_ENV,
  });
}
