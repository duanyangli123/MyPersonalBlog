import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getPostBySlug, getPosts } from '@/lib/posts';
import { formatDate, extractToc } from '@/lib/utils';
import { ReadingProgressBar } from '@/components/blog/ReadingProgressBar';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { PostDetailClient } from '@/components/blog/PostDetailClient';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { PostNavigation } from '@/components/blog/PostNavigation';
import { ViewCount } from '@/components/blog/ViewCount';
import { JsonLd } from '@/components/blog/JsonLd';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { BookmarkButton } from '@/components/blog/BookmarkButton';
import { LikeButton } from '@/components/blog/LikeButton';
import { StarRating } from '@/components/blog/StarRating';
import { ReadingSettings } from '@/components/blog/ReadingSettings';
import { ReadingHistoryTracker } from '@/components/blog/ReadingHistoryTracker';
import { siteConfig } from '@/lib/config';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import Link from 'next/link';
import Image from 'next/image';
import remarkGfm from 'remark-gfm';
import rehypeChineseSlug from '@/lib/rehype-chinese-slug';
import rehypeCodeCopy from '@/lib/rehype-code-copy';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const siteUrl = siteConfig.url;

  return {
    title: `${post.title} | 旅游博客`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage.startsWith('/') ? `${siteUrl}${post.coverImage}` : post.coverImage, width: 800, height: 600 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage.startsWith('/') ? `${siteUrl}${post.coverImage}` : post.coverImage] : [],
    },
    alternates: {
      canonical: `${siteUrl}/posts/${slug}`,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const toc = extractToc(post.content);
  const allPosts = await getPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prev = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : undefined;
  const next = currentIndex > 0 ? allPosts[currentIndex - 1] : undefined;

  return (
    <>
      <JsonLd post={post} />
      <ReadingProgressBar />
      <article className="container mx-auto px-4 py-12">
        <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-8 inline-block">
          ← 返回首页
        </Link>

        {post.coverImage && (
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>·</span>
            <span>{post.readingTime}</span>
            <span>·</span>
            <ViewCount slug={post.slug} />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <ShareButtons title={post.title} slug={post.slug} />
            <BookmarkButton post={post} />
            <LikeButton slug={post.slug} />
            <ReadingSettings />
          </div>
          <div className="mt-3">
            <span className="text-xs text-gray-400 mr-2">评分</span>
            <StarRating slug={post.slug} />
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="prose prose-lg dark:prose-invert max-w-none flex-1 min-w-0 overflow-hidden">
            <MDXRemote
              source={post.content}
              options={{
                mdxOptions: {
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeChineseSlug, rehypeCodeCopy],
                },
              }}
            />
          </div>

          {toc.length > 0 && (
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <TableOfContents items={toc} />
            </aside>
          )}
        </div>

        <ErrorBoundary>
          <PostDetailClient slug={post.slug} content={post.content} title={post.title} />
        </ErrorBoundary>

        <ReadingHistoryTracker post={post} />

        <PostNavigation prev={prev} next={next} />

        <RelatedPosts currentSlug={post.slug} posts={allPosts} />
      </article>
    </>
  );
}
