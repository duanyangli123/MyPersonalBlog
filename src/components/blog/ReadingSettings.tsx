'use client';

import { useState, useEffect, useCallback } from 'react';

export function ReadingSettings() {
  const [fontSize, setFontSize] = useState(16);
  const [immersive, setImmersive] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('reading-settings');
    if (saved) {
      const s = JSON.parse(saved);
      setFontSize(s.fontSize || 16);
      if (s.immersive) setImmersive(true);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const prose = document.querySelector('.prose') as HTMLElement | null;
    if (prose) prose.style.fontSize = `${fontSize}px`;

    document.body.classList.toggle('immersive-mode', immersive);

    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const toc = document.querySelector('aside');
    if (header) (header as HTMLElement).style.display = immersive ? 'none' : '';
    if (footer) (footer as HTMLElement).style.display = immersive ? 'none' : '';
    if (toc) (toc as HTMLElement).style.display = immersive ? 'none' : '';

    localStorage.setItem('reading-settings', JSON.stringify({ fontSize, immersive }));
  }, [fontSize, immersive, mounted]);

  const changeFontSize = useCallback((delta: number) => {
    setFontSize((prev) => Math.max(14, Math.min(24, prev + delta)));
  }, []);

  const toggleImmersive = useCallback(() => {
    setImmersive((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!immersive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setImmersive(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [immersive]);

  if (!mounted) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
        aria-label="阅读设置"
      >
        ⚙️
      </button>

      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-56 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl z-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">字号</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeFontSize(-1)}
                className="w-7 h-7 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                A-
              </button>
              <span className="text-xs text-gray-500 w-6 text-center">{fontSize}</span>
              <button
                onClick={() => changeFontSize(1)}
                className="w-7 h-7 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                A+
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">沉浸模式</span>
            <button
              onClick={toggleImmersive}
              className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${immersive ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${immersive ? 'translate-x-5' : 'left-0.5'}`}
              />
            </button>
          </div>

          {immersive && (
            <p className="text-xs text-gray-400 mt-2">按 Esc 退出沉浸模式</p>
          )}
        </div>
      )}

      {immersive && (
        <button
          onClick={toggleImmersive}
          className="fixed top-4 right-4 z-50 px-3 py-1.5 text-xs rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
        >
          ✕ 退出沉浸
        </button>
      )}
    </div>
  );
}
