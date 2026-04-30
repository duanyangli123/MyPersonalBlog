'use client';

import { CommentSection } from '@/components/blog/CommentSection';
import { AIAssistant } from '@/components/ai/AIAssistant';

interface PostDetailClientProps {
  slug: string;
  content: string;
  title?: string;
}

export function PostDetailClient({ slug, content, title }: PostDetailClientProps) {
  return (
    <>
      <CommentSection slug={slug} />
      <AIAssistant content={content} title={title} />
    </>
  );
}
