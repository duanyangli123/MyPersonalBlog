'use client';

import { Suspense } from 'react';
import { CommentSection } from '@/components/blog/CommentSection';
import { AIAssistant } from '@/components/ai/AIAssistant';
import { ImageViewer } from '@/components/ui/ImageViewer';

interface PostDetailClientProps {
  slug: string;
  content: string;
  title?: string;
}

function PostDetailFallback() {
  return <div className="h-20 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg mt-8" />;
}

export function PostDetailClient({ slug, content, title }: PostDetailClientProps) {
  return (
    <Suspense fallback={<PostDetailFallback />}>
      <CommentSection slug={slug} />
      <AIAssistant content={content} title={title} />
      <ImageViewer />
    </Suspense>
  );
}
