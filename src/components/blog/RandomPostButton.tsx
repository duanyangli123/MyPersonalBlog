'use client';

import { useRouter } from 'next/navigation';
import { getPosts } from '@/lib/posts';

interface RandomPostButtonProps {
  posts: { slug: string }[];
}

export function RandomPostButton({ posts }: RandomPostButtonProps) {
  const router = useRouter();

  const goRandom = () => {
    const post = posts[Math.floor(Math.random() * posts.length)];
    router.push(`/posts/${post.slug}`);
  };

  return (
    <button
      onClick={goRandom}
      className="px-6 py-3 border border-white/40 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
    >
      🎲 随机一篇
    </button>
  );
}
