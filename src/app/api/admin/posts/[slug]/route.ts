import { NextResponse } from 'next/server';
import { getPostBySlug, updatePost, deletePost } from '@/lib/posts';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  date: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  coverImage: z.string().optional(),
  content: z.string().min(1).optional(),
  draft: z.boolean().optional(),
});

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return NextResponse.json({ error: '文章不存在' }, { status: 404 });
    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: '获取文章失败' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const result = updateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const existing = await getPostBySlug(slug);
    if (!existing) return NextResponse.json({ error: '文章不存在' }, { status: 404 });

    await updatePost(slug, result.data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '更新文章失败' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const existing = await getPostBySlug(slug);
    if (!existing) return NextResponse.json({ error: '文章不存在' }, { status: 404 });

    await deletePost(slug);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '删除文章失败' }, { status: 500 });
  }
}
