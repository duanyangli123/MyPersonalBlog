import { NextResponse } from 'next/server';
import { getAllViews } from '@/lib/views';
import { getAllPostsAdmin } from '@/lib/posts';

export async function GET() {
  try {
    const views = await getAllViews();
    const posts = await getAllPostsAdmin();

    const totalViews = Object.values(views).reduce((sum, v) => sum + v, 0);
    const postsWithViews = posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      category: p.category,
      date: p.date,
      views: views[p.slug] || 0,
      draft: p.draft || false,
    }));

    postsWithViews.sort((a, b) => b.views - a.views);

    return NextResponse.json({
      totalViews,
      totalPosts: posts.length,
      publishedPosts: posts.filter((p) => !p.draft).length,
      draftPosts: posts.filter((p) => p.draft).length,
      posts: postsWithViews,
      views,
    });
  } catch {
    return NextResponse.json({ error: '获取统计数据失败' }, { status: 500 });
  }
}
