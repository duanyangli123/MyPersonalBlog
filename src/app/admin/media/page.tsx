'use client';

import { useState, useEffect, useCallback } from 'react';

interface ImageItem {
  name: string;
  url: string;
  size: number;
  modified: string;
}

export default function AdminMediaPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState('');

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      setImages(data.images || []);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    const formData = new FormData();
    for (const file of files) formData.append('files', file);

    try {
      await fetch('/api/admin/media', { method: 'POST', body: formData });
      fetchImages();
    } catch {} finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`确定删除 ${filename}？`)) return;
    await fetch(`/api/admin/media?file=${encodeURIComponent(filename)}`, { method: 'DELETE' });
    fetchImages();
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(''), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">媒体管理</h1>
        <label className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 cursor-pointer transition-colors">
          {uploading ? '上传中...' : '+ 上传图片'}
          <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      </div>

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : images.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-6xl block mb-4">🖼️</span>
          <p className="text-gray-500">还没有图片</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {images.map((img) => (
            <div key={img.name} className="group relative bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all">
              <div className="aspect-square overflow-hidden">
                <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{img.name}</p>
                <p className="text-xs text-gray-400">{formatSize(img.size)}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copyUrl(img.url)}
                  className="px-2 py-1 text-xs bg-black/60 text-white rounded-lg hover:bg-black/80"
                >
                  {copied === img.url ? '✓' : '复制URL'}
                </button>
                <button
                  onClick={() => handleDelete(img.name)}
                  className="px-2 py-1 text-xs bg-red-600/80 text-white rounded-lg hover:bg-red-600"
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
