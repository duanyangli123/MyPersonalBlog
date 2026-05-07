import { NextResponse } from 'next/server';
import { getAllPostsAdmin, createPost } from '@/lib/posts';
import { requireAdmin } from '@/lib/auth';
import { z } from 'zod';

const postSchema = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, 'slug 只能包含小写字母、数字和连字符'),
  title: z.string().min(1, '标题不能为空'),
  description: z.string().min(1, '描述不能为空'),
  date: z.string().min(1),
  tags: z.array(z.string()).min(1, '至少一个标签'),
  category: z.string().min(1, '分类不能为空'),
  coverImage: z.string().optional(),
  content: z.string().min(1, '内容不能为空'),
  draft: z.boolean().optional(),
});

export async function GET(request: Request) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const tag = searchParams.get('tag') || '';
    const status = searchParams.get('status') || '';

    let posts = await getAllPostsAdmin();

    if (search) {
      const q = search.toLowerCase();
      posts = posts.filter(
        (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (category) posts = posts.filter((p) => p.category === category);
    if (tag) posts = posts.filter((p) => p.tags.includes(tag));
    if (status === 'draft') posts = posts.filter((p) => p.draft);
    if (status === 'published') posts = posts.filter((p) => !p.draft);

    const total = posts.length;
    const totalPages = Math.ceil(total / limit);
    const currentPage = Math.max(1, Math.min(page, totalPages || 1));
    const start = (currentPage - 1) * limit;
    const paged = posts.slice(start, start + limit).map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      tags: p.tags,
      category: p.category,
      coverImage: p.coverImage,
      readingTime: p.readingTime,
      draft: p.draft || false,
    }));

    return NextResponse.json({ posts: paged, total, totalPages, currentPage });
  } catch {
    return NextResponse.json({ error: '获取文章失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const body = await request.json();
    const result = postSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    await createPost(result.data);
    return NextResponse.json({ success: true, slug: result.data.slug }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'EEXIST') {
      return NextResponse.json({ error: '该 slug 已存在' }, { status: 409 });
    }
    return NextResponse.json({ error: '创建文章失败' }, { status: 500 });
  }
}
