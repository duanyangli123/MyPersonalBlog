import Link from 'next/link';
import { getAllCategories, getPostsByCategory } from '@/lib/posts';
import { PostCard } from '@/components/blog/PostCard';

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ category: c.name }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return { title: `${category} | 旅游博客` };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const posts = await getPostsByCategory(category);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/categories" className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block">
        ← 全部分类
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{category}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">共 {posts.length} 篇</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
