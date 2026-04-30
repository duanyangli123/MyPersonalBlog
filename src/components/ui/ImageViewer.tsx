'use client';

import { useState, useEffect } from 'react';

export function ImageViewer() {
  const [src, setSrc] = useState<string | null>(null);

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
      onClick={() => setSrc(null)}
    >
      <img
        src={src}
        alt=""
        className="max-w-full max-h-full object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}
