'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface PostItem {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  coverImage?: string;
  readingTime: string;
  draft: boolean;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(currentPage), limit: '15' });
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (status) params.set('status', status);

    try {
      const res = await fetch(`/api/admin/posts?${params}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, category, status]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async (slug: string) => {
    if (!confirm(`确定删除文章 "${slug}"？`)) return;
    await fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' });
    fetchPosts();
  };

  const handleBulkDelete = async () => {
    if (!selected.length || !confirm(`确定删除 ${selected.length} 篇文章？`)) return;
    await Promise.all(selected.map((slug) => fetch(`/api/admin/posts/${slug}`, { method: 'DELETE' })));
    setSelected([]);
    fetchPosts();
  };

  const toggleSelect = (slug: string) => {
    setSelected((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">文章管理</h1>
        <Link href="/admin/posts/new" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          + 新建文章
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          placeholder="搜索文章..."
          className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
        >
          <option value="">全部分类</option>
          <option value="旅行攻略">旅行攻略</option>
          <option value="旅行日记">旅行日记</option>
          <option value="随笔">随笔</option>
        </select>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
        >
          <option value="">全部状态</option>
          <option value="published">已发布</option>
          <option value="draft">草稿</option>
        </select>
        {selected.length > 0 && (
          <button onClick={handleBulkDelete} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700">
            删除选中 ({selected.length})
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="px-4 py-3 text-left w-10">
                    <input type="checkbox" onChange={(e) => setSelected(e.target.checked ? posts.map((p) => p.slug) : [])} />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">标题</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden md:table-cell">分类</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase hidden lg:table-cell">日期</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">状态</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">操作</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.slug} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.includes(post.slug)} onChange={() => toggleSelect(post.slug)} />
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{post.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{post.slug}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">{post.category}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">{post.date}</td>
                    <td className="px-4 py-3">
                      {post.draft ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">草稿</span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">已发布</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/posts/${post.slug}`} className="text-xs text-gray-400 hover:text-blue-500" target="_blank">查看</Link>
                        <Link href={`/admin/posts/${post.slug}`} className="text-xs text-blue-500 hover:text-blue-600">编辑</Link>
                        <button onClick={() => handleDelete(post.slug)} className="text-xs text-red-500 hover:text-red-600">删除</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">共 {total} 篇</p>
            <div className="flex gap-2">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50">上一页</button>
              <span className="px-3 py-1.5 text-sm text-gray-500">{currentPage}/{totalPages || 1}</span>
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-50">下一页</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
