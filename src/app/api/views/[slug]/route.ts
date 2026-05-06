import { NextResponse } from 'next/server';
import { getViews, incrementViews } from '@/lib/views';
import { checkRateLimit } from '@/lib/rate-limit';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const views = await getViews(slug);
  return NextResponse.json({ slug, views });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  const { ok } = checkRateLimit(`views:${ip}`);
  if (!ok) {
    const views = await getViews(slug);
    return NextResponse.json({ slug, views, counted: false });
  }

  const cookieHeader = request.headers.get('cookie') || '';
  const viewedKey = `_viewed_${slug}`;
  const hasViewed = cookieHeader.includes(`${viewedKey}=1`);

  if (hasViewed) {
    const views = await getViews(slug);
    return NextResponse.json({ slug, views, counted: false });
  }

  const views = await incrementViews(slug);
  const response = NextResponse.json({ slug, views, counted: true });
  response.cookies.set(viewedKey, '1', {
    maxAge: 86400,
    httpOnly: true,
    sameSite: 'lax',
  });
  return response;
}
