import type { Post } from '@/types';
import { siteConfig } from '@/lib/config';

interface JsonLdProps {
  post: Post;
}

export function JsonLd({ post }: JsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    keywords: post.tags.join(', '),
    url: `${siteConfig.url}/posts/${post.slug}`,
    image: post.coverImage ? (post.coverImage.startsWith('/') ? `${siteConfig.url}${post.coverImage}` : post.coverImage) : undefined,
    author: {
      '@type': 'Person',
      name: siteConfig.author,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
