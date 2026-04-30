import type { Post } from '@/types';

interface JsonLdProps {
  post: Post;
}

export function JsonLd({ post }: JsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://travel-blog.vercel.app';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    keywords: post.tags.join(', '),
    url: `${siteUrl}/posts/${post.slug}`,
    image: post.coverImage || undefined,
    author: {
      '@type': 'Person',
      name: '旅游博主',
    },
    publisher: {
      '@type': 'Organization',
      name: '旅游博客',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
