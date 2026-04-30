import { NextResponse } from 'next/server';
import { getViews, incrementViews } from '@/lib/views';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const views = getViews(slug);
  return NextResponse.json({ slug, views });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const cookieHeader = request.headers.get('cookie') || '';
  const viewedKey = `_viewed_${slug}`;
  const hasViewed = cookieHeader.includes(`${viewedKey}=1`);

  if (hasViewed) {
    const views = getViews(slug);
    return NextResponse.json({ slug, views, counted: false });
  }

  const views = incrementViews(slug);
  const response = NextResponse.json({ slug, views, counted: true });
  response.cookies.set(viewedKey, '1', {
    maxAge: 86400,
    httpOnly: true,
    sameSite: 'lax',
  });
  return response;
}
