'use client';

import { useState, useRef, useEffect } from 'react';
import { siteConfig } from '@/lib/config';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showWechat, setShowWechat] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const url = `${siteConfig.url}/posts/${slug}`;

  useEffect(() => {
    if (!showWechat) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowWechat(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showWechat]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">分享：</span>

      <button
        onClick={handleShare}
        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="分享"
      >
        📤
      </button>

      <div className="relative" ref={panelRef}>
        <button
          onClick={() => setShowWechat(!showWechat)}
          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="微信"
        >
          💬
        </button>
        {showWechat && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-10">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">用微信扫码</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`}
              alt="微信分享二维码"
              className="w-[150px] h-[150px]"
            />
          </div>
        )}
      </div>

      <a
        href={`https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="微博"
      >
        🔴
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        title="Twitter"
      >
        🐦
      </a>

      <button
        onClick={() => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        {copied ? '已复制' : '复制链接'}
      </button>
    </div>
  );
}
