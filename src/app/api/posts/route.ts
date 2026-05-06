import { NextResponse } from 'next/server';
import { getPosts, searchPosts } from '@/lib/posts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  const posts = query ? await searchPosts(query) : await getPosts();

  const summaries = posts.map(({ content, ...rest }) => rest);

  return NextResponse.json(summaries);
}
