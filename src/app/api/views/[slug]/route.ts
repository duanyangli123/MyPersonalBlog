import { NextResponse } from 'next/server';
import { getViews, incrementViews } from '@/lib/views';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const views = getViews(slug);
  return NextResponse.json({ slug, views });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const views = incrementViews(slug);
  return NextResponse.json({ slug, views });
}
