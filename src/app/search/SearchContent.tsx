'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PostCard } from '@/components/blog/PostCard';
import type { Post } from '@/types';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [debouncedQuery, router]);

  const filteredPosts = debouncedQuery.trim()
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          post.tags.some((tag) => tag.toLowerCase().includes(debouncedQuery.toLowerCase()))
      )
    : posts;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">搜索文章</h1>
      <input
        type="text"
        placeholder="输入关键词搜索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="搜索文章"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-8"
      />
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">加载中...</p>
      ) : filteredPosts.length === 0 && debouncedQuery.trim() ? (
        <p className="text-gray-500 dark:text-gray-400">未找到相关文章</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
