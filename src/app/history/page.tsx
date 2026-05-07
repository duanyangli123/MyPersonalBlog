'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

interface HistoryItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  coverImage?: string;
  readingTime: string;
  visitedAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem('reading-history');
    if (raw) setHistory(JSON.parse(raw));
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('reading-history');
    setHistory([]);
  };

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">阅读历史</h1>
        <p className="text-gray-500 dark:text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">阅读历史</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {history.length > 0 ? `共 ${history.length} 条记录` : '暂无阅读记录'}
          </p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            清空历史
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">📖</span>
          <p className="text-gray-500 dark:text-gray-400 mb-4">还没有阅读记录</p>
          <Link href="/posts" className="text-blue-600 dark:text-blue-400 hover:underline">
            开始阅读 →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <Link
              key={`${item.slug}-${item.visitedAt}`}
              href={`/posts/${item.slug}`}
              className="group flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition-all duration-300"
            >
              {item.coverImage && (
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="64px" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
                  {item.description}
                </p>
              </div>
              <time className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                {item.visitedAt}
              </time>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
