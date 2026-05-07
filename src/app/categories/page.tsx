import Link from 'next/link';
import { getAllCategories } from '@/lib/posts';

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  const icons: Record<string, string> = {
    '旅行攻略': '📖',
    '旅行日记': '✏️',
    '随笔': '💭',
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">分类</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">按文章类型浏览</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={`/categories/${encodeURIComponent(cat.name)}`}
            className="group block p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
          >
            <span className="text-3xl mb-3 block">{icons[cat.name] || '📋'}</span>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {cat.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{cat.count} 篇文章</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
