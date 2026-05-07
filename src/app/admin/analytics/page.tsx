'use client';

import { useState, useEffect } from 'react';

interface AnalyticsData {
  totalViews: number;
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  posts: { slug: string; title: string; category: string; date: string; views: number; draft: boolean }[];
  views: Record<string, number>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'views' | 'date'>('views');

  useEffect(() => {
    fetch('/api/admin/views')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">加载中...</p>;

  const sortedPosts = [...(data?.posts || [])].sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const categoryStats = data?.posts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const maxViews = Math.max(...sortedPosts.map((p) => p.views), 1);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">数据统计</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data?.totalViews || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">总浏览量</p>
        </div>
        <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data?.totalPosts || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">文章总数</p>
        </div>
        <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data?.publishedPosts || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">已发布</p>
        </div>
        <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data?.draftPosts || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">草稿</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">文章浏览量</h2>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'views' | 'date')} className="text-sm px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <option value="views">按浏览量</option>
              <option value="date">按日期</option>
            </select>
          </div>
          <div className="space-y-3">
            {sortedPosts.map((post) => (
              <div key={post.slug} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{post.title}</p>
                </div>
                <div className="w-32 flex-shrink-0">
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(post.views / maxViews) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs text-gray-400 w-12 text-right">{post.views}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">分类分布</h2>
          <div className="space-y-3">
            {Object.entries(categoryStats).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">{cat}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{count} 篇</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
