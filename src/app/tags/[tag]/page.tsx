import Link from 'next/link';
import { PostCard } from '@/components/blog/PostCard';
import { getPostsByTagAndPage, getAllTags } from '@/lib/posts';

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag: tag.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return { title: `标签: ${tag}` };
}

export default async function TagPage({ params, searchParams }: { params: Promise<{ tag: string }>; searchParams: Promise<{ page?: string }> }) {
  const { tag } = await params;
  const { page } = await searchParams;
  const currentPage = parseInt(page || '1', 10);
  const { posts, total, totalPages, currentPage: validPage } = await getPostsByTagAndPage(tag, currentPage);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/tags" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
        ← 所有标签
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        标签: {tag}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">共 {total} 篇</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav className="flex justify-center items-center gap-4 mt-12">
          {validPage > 1 ? (
            <Link href={`/tags/${tag}?page=${validPage - 1}`} className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              ← 上一页
            </Link>
          ) : <span className="px-4 py-2 text-sm text-gray-300 dark:text-gray-700">← 上一页</span>}

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link key={p} href={`/tags/${tag}?page=${p}`} className={cn('w-8 h-8 flex items-center justify-center text-sm rounded-lg transition-colors', p === validPage ? 'bg-blue-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800')}>
                {p}
              </Link>
            ))}
          </div>

          {validPage < totalPages ? (
            <Link href={`/tags/${tag}?page=${validPage + 1}`} className="px-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              下一页 →
            </Link>
          ) : <span className="px-4 py-2 text-sm text-gray-300 dark:text-gray-700">下一页 →</span>}
        </nav>
      )}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
