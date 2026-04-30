'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { TocItem } from '@/types';

interface TableOfContentsProps {
  items: TocItem[];
}

function TocList({ items, activeId, onNavigate }: { items: TocItem[]; activeId: string; onNavigate?: () => void }) {
  return (
    <ul className="space-y-1 text-sm">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={() => onNavigate?.()}
            className={cn(
              'block py-1 transition-colors hover:text-blue-600 dark:hover:text-blue-400',
              item.level === 3 && 'pl-4',
              activeId === item.id
                ? 'text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <>
      {/* 桌面端侧栏 */}
      <nav className="hidden lg:block sticky top-24">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">目录</h3>
        <TocList items={items} activeId={activeId} />
      </nav>

      {/* 移动端浮动按钮 + 抽屉 */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={cn(
            'fixed bottom-28 right-4 z-40 w-10 h-10 rounded-full',
            'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
            'shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-300',
            mobileOpen && 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white border-blue-600'
          )}
          aria-label="目录"
        >
          ☰
        </button>

        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-30 bg-black/20"
              onClick={() => setMobileOpen(false)}
            />
            <nav className="fixed top-16 right-0 z-40 w-64 max-h-[70vh] overflow-y-auto bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 shadow-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">目录</h3>
              <TocList items={items} activeId={activeId} onNavigate={() => setMobileOpen(false)} />
            </nav>
          </>
        )}
      </div>
    </>
  );
}
