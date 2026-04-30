import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Post } from '@/types';

interface PostNavigationProps {
  prev: Post | undefined;
  next: Post | undefined;
}

export function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4">
      {prev ? (
        <Link
          href={`/posts/${prev.slug}`}
          className="group block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
        >
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">← 上一篇</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/posts/${next.slug}`}
          className="group block p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all text-right"
        >
          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">下一篇 →</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
