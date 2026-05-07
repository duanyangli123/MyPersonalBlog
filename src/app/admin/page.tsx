'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DashboardData {
  totalViews: number;
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  posts: { slug: string; title: string; views: number; date: string; draft: boolean }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/views')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500 dark:text-gray-400">加载中...</div>;
  }

  const topPosts = data?.posts.slice(0, 5) || [];
  const recentPosts = data?.posts.slice(0, 5) || [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">仪表盘</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <span className="text-3xl block mb-2">📚</span>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data?.totalPosts || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">文章总数</p>
        </div>
        <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <span className="text-3xl block mb-2">👁️</span>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data?.totalViews || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">总浏览量</p>
        </div>
        <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <span className="text-3xl block mb-2">✅</span>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data?.publishedPosts || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">已发布</p>
        </div>
        <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <span className="text-3xl block mb-2">📝</span>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data?.draftPosts || 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">草稿</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <Link
          href="/admin/posts/new"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          + 新建文章
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">热门文章</h2>
          <div className="space-y-3">
            {topPosts.map((post) => (
              <div key={post.slug} className="flex items-center justify-between">
                <Link href={`/admin/posts/${post.slug}`} className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 truncate flex-1">
                  {post.title}
                </Link>
                <span className="text-xs text-gray-400 ml-2">{post.views} 浏览</span>
              </div>
            ))}
            {topPosts.length === 0 && <p className="text-sm text-gray-400">暂无数据</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">最近文章</h2>
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div key={post.slug} className="flex items-center justify-between">
                <Link href={`/admin/posts/${post.slug}`} className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 truncate flex-1">
                  {post.title}
                  {post.draft && <span className="ml-2 text-xs text-orange-500">草稿</span>}
                </Link>
                <span className="text-xs text-gray-400 ml-2">{post.date}</span>
              </div>
            ))}
            {recentPosts.length === 0 && <p className="text-sm text-gray-400">暂无文章</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
