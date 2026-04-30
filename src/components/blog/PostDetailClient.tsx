'use client';

import { useEffect } from 'react';
import { CommentSection } from '@/components/blog/CommentSection';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { ImageViewer } from '@/components/ui/ImageViewer';

interface PostDetailClientProps {
  slug: string;
  content: string;
  title?: string;
}

export function PostDetailClient({ slug, content, title }: PostDetailClientProps) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains('code-copy-btn')) return;

      const pre = target.closest('pre');
      const code = pre?.querySelector('code');
      if (!code) return;

      navigator.clipboard.writeText(code.textContent || '');
      target.textContent = '已复制';
      setTimeout(() => { target.textContent = '复制'; }, 2000);
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <>
      <CommentSection slug={slug} />
      <AIAssistant content={content} title={title} />
      <ImageViewer />
    </>
  );
}
