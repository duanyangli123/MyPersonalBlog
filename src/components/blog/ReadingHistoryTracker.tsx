'use client';

import { useEffect } from 'react';

interface ReadingHistoryTrackerProps {
  post: {
    slug: string;
    title: string;
    description: string;
    date: string;
    coverImage?: string;
    readingTime: string;
  };
}

export function ReadingHistoryTracker({ post }: ReadingHistoryTrackerProps) {
  useEffect(() => {
    const raw = localStorage.getItem('reading-history') || '[]';
    const history = JSON.parse(raw);
    const filtered = history.filter((h: { slug: string }) => h.slug !== post.slug);
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    filtered.unshift({
      ...post,
      visitedAt: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
    });
    localStorage.setItem('reading-history', JSON.stringify(filtered.slice(0, 50)));
  }, [post]);

  return null;
}
