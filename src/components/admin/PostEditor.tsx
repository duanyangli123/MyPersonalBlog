'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PostData {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  coverImage: string;
  content: string;
  draft: boolean;
}

interface PostEditorProps {
  mode: 'new' | 'edit';
  initialSlug?: string;
}

const defaultPost: PostData = {
  slug: '',
  title: '',
  description: '',
  date: new Date().toISOString().split('T')[0],
  tags: [],
  category: '旅行日记',
  coverImage: '',
  content: '',
  draft: false,
};

export function PostEditor({ mode, initialSlug }: PostEditorProps) {
  const [post, setPost] = useState<PostData>(defaultPost);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(mode === 'edit');
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (mode === 'edit' && initialSlug) {
      fetch(`/api/admin/posts/${initialSlug}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.error) setError(data.error);
          else setPost({ ...defaultPost, ...data, slug: initialSlug });
        })
        .catch(() => setError('加载文章失败'))
        .finally(() => setLoading(false));
    }
  }, [mode, initialSlug]);

  const update = useCallback((field: keyof PostData, value: unknown) => {
    setPost((prev) => ({ ...prev, [field]: value }));
  }, []);

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !post.tags.includes(tag)) {
      update('tags', [...post.tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    update('tags', post.tags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!post.title || !post.description || !post.content) {
      setError('标题、描述和内容不能为空');
      return;
    }
    if (mode === 'new' && !post.slug) {
      setError('slug 不能为空');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const url = mode === 'new' ? '/api/admin/posts' : `/api/admin/posts/${initialSlug}`;
      const method = mode === 'new' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/admin/posts');
      } else {
        setError(data.error || '保存失败');
      }
    } catch {
      setError('网络错误');
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = () => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, '-')
      .replace(/^-+|-+$/g, '');
    update('slug', slug);
  };

  if (loading) return <p className="text-gray-500">加载中...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/posts" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">← 返回</Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {mode === 'new' ? '新建文章' : '编辑文章'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setPreview(!preview)} className="px-4 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
            {preview ? '编辑' : '预览'}
          </button>
          <button
            onClick={() => { update('draft', true); handleSave(); }}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? '保存中...' : '保存草稿'}
          </button>
          <button
            onClick={() => { update('draft', false); handleSave(); }}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? '发布中...' : '发布'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-6">
        <div className="space-y-4">
          {mode === 'new' && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={post.slug}
                onChange={(e) => update('slug', e.target.value)}
                placeholder="文章 slug (英文/数字/连字符)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={generateSlug} className="px-3 py-2.5 text-sm rounded-xl border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800" title="从标题生成">
                🔄
              </button>
            </div>
          )}

          <input
            type="text"
            value={post.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="文章标题"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <textarea
            value={post.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="文章描述（用于 SEO 和摘要）"
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          {preview ? (
            <div className="prose prose-sm dark:prose-invert max-w-none p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 min-h-[400px]">
              <h1>{post.title || '无标题'}</h1>
              <p className="text-gray-500">{post.description || '无描述'}</p>
              <hr />
              <pre className="whitespace-pre-wrap text-sm">{post.content || '无内容'}</pre>
            </div>
          ) : (
            <textarea
              value={post.content}
              onChange={(e) => update('content', e.target.value)}
              placeholder="文章正文（支持 MDX/Markdown）"
              rows={20}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            />
          )}
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">基本信息</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">分类</label>
                <select
                  value={post.category}
                  onChange={(e) => update('category', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                >
                  <option value="旅行攻略">旅行攻略</option>
                  <option value="旅行日记">旅行日记</option>
                  <option value="随笔">随笔</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">日期</label>
                <input
                  type="date"
                  value={post.date}
                  onChange={(e) => update('date', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">封面图 URL</label>
                <input
                  type="text"
                  value={post.coverImage}
                  onChange={(e) => update('coverImage', e.target.value)}
                  placeholder="/images/xxx.jpg"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">标签</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="hover:text-red-500">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="输入标签"
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
              />
              <button onClick={addTag} className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                +
              </button>
            </div>
          </div>

          <div className="p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">状态</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => update('draft', false)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${!post.draft ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
              >
                已发布
              </button>
              <button
                onClick={() => update('draft', true)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${post.draft ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
              >
                草稿
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
