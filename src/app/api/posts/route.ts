import { NextResponse } from 'next/server';
import { getPosts, searchPosts } from '@/lib/posts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (query) {
    const posts = await searchPosts(query);
    return NextResponse.json(posts);
  }

  const posts = await getPosts();
  return NextResponse.json(posts);
}
