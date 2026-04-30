'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={cn(
        'fixed bottom-4 right-4 z-40 w-10 h-10 rounded-full',
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        'shadow-lg hover:shadow-xl hover:scale-110 transition-all',
        'flex items-center justify-center text-gray-600 dark:text-gray-300'
      )}
      aria-label="回到顶部"
    >
      ↑
    </button>
  );
}
