import { Suspense } from 'react';
import SearchContent from './SearchContent';

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">搜索文章</h1>
        <p className="text-gray-500 dark:text-gray-400">加载中...</p>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
