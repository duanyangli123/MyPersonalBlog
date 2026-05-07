'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Post[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem('bookmarks');
    if (raw) setBookmarks(JSON.parse(raw));
  }, []);

  const removeBookmark = useCallback((slug: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((p) => p.slug !== slug);
      localStorage.setItem('bookmarks', JSON.stringify(next));
      return next;
    });
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">收藏</h1>
        <p className="text-gray-500 dark:text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">我的收藏</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        {bookmarks.length > 0 ? `已收藏 ${bookmarks.length} 篇文章` : '还没有收藏任何文章'}
      </p>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">📌</span>
          <p className="text-gray-500 dark:text-gray-400 mb-4">阅读文章时点击 ❤️ 即可收藏</p>
          <Link href="/posts" className="text-blue-600 dark:text-blue-400 hover:underline">
            去看看文章 →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((post) => (
            <article key={post.slug} className="group relative rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-all duration-300">
              {post.coverImage && (
                <div className="relative h-48 overflow-hidden">
                  <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                  <time>{formatDate(post.date)}</time>
                  <span>·</span>
                  <span>{post.readingTime}</span>
                </div>
                <Link href={`/posts/${post.slug}`}>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{post.description}</p>
                <button
                  onClick={() => removeBookmark(post.slug)}
                  className="text-xs text-red-500 hover:text-red-600 transition-colors"
                >
                  取消收藏
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
