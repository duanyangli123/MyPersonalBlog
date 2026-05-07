import Link from 'next/link';
import { getArchive } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

export default async function ArchivePage() {
  const archive = await getArchive();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">归档</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-12">按时间线浏览所有文章</p>

      <div className="relative">
        <div className="absolute left-4 md:left-8 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800" />

        {archive.map(({ year, month, posts }) => (
          <div key={`${year}-${month}`} className="relative mb-12 last:mb-0">
            <div className="absolute left-4 md:left-8 -translate-x-1/2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-gray-950 z-10" />

            <div className="pl-10 md:pl-16">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 sticky top-16 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm py-2 z-10">
                {year}年{month}月
                <span className="ml-2 text-sm font-normal text-gray-400">{posts.length}篇</span>
              </h2>

              <ul className="space-y-3">
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/posts/${post.slug}`}
                      className="group flex items-start gap-3 p-3 -ml-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <time className="text-xs text-gray-400 dark:text-gray-500 mt-1 whitespace-nowrap w-12">
                        {formatDate(post.date).slice(5)}
                      </time>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 line-clamp-1">
                          {post.description}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{post.readingTime}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
