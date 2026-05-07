import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { requireAdmin } from '@/lib/auth';

const IMAGES_DIR = path.join(process.cwd(), 'public/images');

export async function GET() {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const files = await fs.readdir(IMAGES_DIR);
    const images = await Promise.all(
      files
        .filter((f) => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f))
        .map(async (f) => {
          const stat = await fs.stat(path.join(IMAGES_DIR, f));
          return {
            name: f,
            url: `/images/${f}`,
            size: stat.size,
            modified: stat.mtime.toISOString(),
          };
        })
    );
    images.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime());
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ error: '获取图片列表失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files.length) {
      return NextResponse.json({ error: '请选择文件' }, { status: 400 });
    }

    const uploaded: string[] = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      await fs.writeFile(path.join(IMAGES_DIR, filename), buffer);
      uploaded.push(`/images/${filename}`);
    }

    return NextResponse.json({ success: true, files: uploaded });
  } catch {
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('file');
    if (!filename) return NextResponse.json({ error: '文件名不能为空' }, { status: 400 });

    const filePath = path.join(IMAGES_DIR, filename);
    await fs.unlink(filePath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}
