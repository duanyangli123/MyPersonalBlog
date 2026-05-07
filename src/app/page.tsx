import Link from 'next/link';
import { PostCard } from '@/components/blog/PostCard';
import { getPosts } from '@/lib/posts';
import { Typewriter } from '@/components/ui/Typewriter';
import { RandomPostButton } from '@/components/blog/RandomPostButton';
import type { Post } from '@/types';

export default async function Home() {
  const allPosts = await getPosts();
  const posts = allPosts.slice(0, 6);

  const slugs = allPosts.map((p: Post) => ({ slug: p.slug }));
  const categories = [...new Set(allPosts.map((p: Post) => p.category))];

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="relative mb-16 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 text-white px-8 py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('/images/photo-1469854523086-cc02fe5d8800.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 via-blue-500/60 to-cyan-400/40" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            🌏 旅游博客
          </h1>
          <div className="text-lg text-blue-100 mb-8 h-8">
            <Typewriter
              texts={[
                '记录每一次旅行的所见所闻',
                '探索中国的山川湖海',
                '分享美丽的风景和有趣的故事',
                '在路上，遇见更好的自己',
              ]}
              speed={80}
              deleteSpeed={40}
              pauseDuration={2500}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/posts"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              浏览全部文章
            </Link>
            <RandomPostButton posts={slugs} />
            <Link
              href="/categories"
              className="px-6 py-3 border border-white/40 text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              📂 分类浏览
            </Link>
          </div>
        </div>
        <div className="relative z-10 mt-8 flex items-center gap-6 text-sm text-blue-200">
          <span>📚 {allPosts.length} 篇文章</span>
          <span>🏷️ {new Set(allPosts.flatMap((p: Post) => p.tags)).size} 个标签</span>
          <span>📂 {categories.length} 个分类</span>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">最新文章</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: Post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        {allPosts.length > 6 && (
          <div className="text-center mt-8">
            <Link
              href="/posts"
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              查看全部 {allPosts.length} 篇文章 →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
