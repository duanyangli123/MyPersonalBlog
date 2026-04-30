import { PostCard } from '@/components/blog/PostCard';
import { getPostsByTag } from '@/lib/posts';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return { title: `标签: ${tag}` };
}

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/tags" className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
        ← 所有标签
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        标签: {tag}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
