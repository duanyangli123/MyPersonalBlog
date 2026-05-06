'use client';

import { useState, useEffect, useCallback } from 'react';

export function ImageViewer() {
  const [src, setSrc] = useState<string | null>(null);

  const close = useCallback(() => setSrc(null), []);

  useEffect(() => {
    if (!src) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [src, close]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'IMG' || target.closest('a') || target.closest('button')) return;
      const article = target.closest('.prose');
      if (!article) return;
      setSrc((target as HTMLImageElement).src);
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
      onClick={close}
    >
      <img
        src={src}
        alt=""
        className="max-w-full max-h-full object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={close}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors text-lg"
        aria-label="关闭"
      >
        ✕
      </button>
    </div>
  );
}
