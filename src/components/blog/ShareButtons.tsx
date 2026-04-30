'use client';

import { useState } from 'react';
import { siteConfig } from '@/lib/config';

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const url = `${siteConfig.url}/posts/${slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: '微信',
      icon: '💬',
      href: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`,
    },
    {
      name: '微博',
      icon: '🔴',
      href: `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
    {
      name: 'Twitter',
      icon: '🐦',
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
  ];

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-500 dark:text-gray-400 mr-1">分享：</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title={`分享到${link.name}`}
        >
          {link.icon}
        </a>
      ))}
      <button
        onClick={copyLink}
        className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        {copied ? '已复制' : '复制链接'}
      </button>
    </div>
  );
}
