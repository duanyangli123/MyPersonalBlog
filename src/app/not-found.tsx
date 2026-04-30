import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="text-8xl font-bold text-gray-200 dark:text-gray-800 mb-4">404</div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        迷路了？
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
        你要找的页面不存在，可能已经搬走了，或者从来没有存在过。
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          回到首页
        </Link>
        <Link
          href="/posts"
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          看看文章
        </Link>
      </div>
    </div>
  );
}
