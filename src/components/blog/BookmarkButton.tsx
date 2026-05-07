'use client';

import { useState, useEffect, useCallback } from 'react';

interface BookmarkButtonProps {
  post: {
    slug: string;
    title: string;
    description: string;
    date: string;
    coverImage?: string;
    readingTime: string;
  };
}

export function BookmarkButton({ post }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem('bookmarks');
    if (raw) {
      const bookmarks = JSON.parse(raw);
      setIsBookmarked(bookmarks.some((b: { slug: string }) => b.slug === post.slug));
    }
  }, [post.slug]);

  const toggle = useCallback(() => {
    const raw = localStorage.getItem('bookmarks') || '[]';
    const bookmarks = JSON.parse(raw);
    if (isBookmarked) {
      const next = bookmarks.filter((b: { slug: string }) => b.slug !== post.slug);
      localStorage.setItem('bookmarks', JSON.stringify(next));
      setIsBookmarked(false);
    } else {
      bookmarks.unshift(post);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  }, [isBookmarked, post]);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all duration-200"
      style={{
        color: isBookmarked ? '#ef4444' : undefined,
        backgroundColor: isBookmarked ? 'rgba(239,68,68,0.1)' : undefined,
      }}
      aria-label={isBookmarked ? '取消收藏' : '收藏文章'}
    >
      <span>{isBookmarked ? '❤️' : '🤍'}</span>
      <span className="hidden sm:inline">{isBookmarked ? '已收藏' : '收藏'}</span>
    </button>
  );
}
