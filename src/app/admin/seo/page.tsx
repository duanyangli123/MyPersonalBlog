'use client';

import { useState } from 'react';

export default function AdminSEOPage() {
  const [slug, setSlug] = useState('');
  const [ogPreview, setOgPreview] = useState<{ title: string; description: string; image: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/posts/${slug}`);
      const data = await res.json();
      if (data.title) {
        setOgPreview({
          title: data.title,
          description: data.description,
          image: data.coverImage || '',
        });
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">SEO 工具</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">OG 卡片预览</h2>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="输入文章 slug"
              className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
            />
            <button onClick={handlePreview} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {loading ? '...' : '预览'}
            </button>
          </div>

          {ogPreview && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              {ogPreview.image && (
                <div className="h-40 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <img src={ogPreview.image} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">{new URL('https://my-personal-blog-sage.vercel.app').hostname}</p>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mt-1">{ogPreview.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{ogPreview.description}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sitemap 预览</h2>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm font-mono text-gray-600 dark:text-gray-400 max-h-80 overflow-y-auto">
            <p className="text-green-600 dark:text-green-400"># 自动生成</p>
            <p className="mt-2">GET /sitemap.xml</p>
            <p className="mt-1 text-gray-400"># 包含所有已发布文章的 URL</p>
            <p className="mt-1 text-gray-400"># 更新频率: 每次构建时自动更新</p>
            <p className="mt-4 text-blue-500">https://my-personal-blog-sage.vercel.app/</p>
            <p className="text-blue-500">https://my-personal-blog-sage.vercel.app/posts/...</p>
            <p className="text-blue-500">https://my-personal-blog-sage.vercel.app/tags/...</p>
            <p className="text-blue-500">https://my-personal-blog-sage.vercel.app/categories/...</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Meta 标签检查</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          SEO 元数据在构建时自动生成，包含以下内容：
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {['title', 'description', 'openGraph', 'twitter', 'canonical', 'robots', 'sitemap', 'RSS', 'JSON-LD'].map((item) => (
            <div key={item} className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-green-500">✓</span>
              <span className="text-sm text-green-700 dark:text-green-400">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
