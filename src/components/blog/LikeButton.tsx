'use client';

import { useState, useEffect, useCallback } from 'react';

interface LikeButtonProps {
  slug: string;
}

export function LikeButton({ slug }: LikeButtonProps) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem(`likes-${slug}`);
    if (raw) {
      const data = JSON.parse(raw);
      setLikes(data.count || 0);
      setLiked(data.liked || false);
    }
  }, [slug]);

  const toggle = useCallback(() => {
    setLiked((prev) => {
      const newLiked = !prev;
      setLikes((prevCount) => {
        const newCount = newLiked ? prevCount + 1 : Math.max(0, prevCount - 1);
        localStorage.setItem(`likes-${slug}`, JSON.stringify({ count: newCount, liked: newLiked }));
        return newCount;
      });
      return newLiked;
    });
  }, [slug]);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-200"
      style={{
        color: liked ? '#f59e0b' : undefined,
        backgroundColor: liked ? 'rgba(245,158,11,0.1)' : undefined,
      }}
      aria-label={liked ? '取消点赞' : '点赞'}
    >
      <span>{liked ? '⭐' : '☆'}</span>
      <span>{likes > 0 ? likes : ''}</span>
    </button>
  );
}
