'use client';

import Giscus from '@giscus/react';
import { useTheme } from 'next-themes';

interface CommentSectionProps {
  slug: string;
}

export function CommentSection({ slug }: CommentSectionProps) {
  const { theme } = useTheme();

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  if (!repo || !repoId || !categoryId) {
    return (
      <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">💬 评论</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          评论功能尚未配置。请在 .env.local 中设置 Giscus 相关环境变量。
        </p>
      </section>
    );
  }

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">💬 评论</h2>
      <Giscus
        repo={repo as `${string}/${string}`}
        repoId={repoId}
        category="General"
        categoryId={categoryId}
        mapping={process.env.NEXT_PUBLIC_GISCUS_MAPPING as any || 'pathname'}
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === 'dark' ? 'noborder_dark' : 'noborder_light'}
        lang="zh-CN"
        loading="lazy"
      />
    </section>
  );
}
