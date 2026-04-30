import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Post } from '@/types';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

let postsCache: Post[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000;

async function readPosts(): Promise<Post[]> {
  if (postsCache && Date.now() - cacheTime < CACHE_TTL) {
    return postsCache;
  }

  const files = await fs.readdir(postsDirectory);

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map(async (file) => {
        const slug = file.replace(/\.mdx$/, '');
        const filePath = path.join(postsDirectory, file);
        const fileContents = await fs.readFile(filePath, 'utf8');
        const { data, content } = matter(fileContents);
        const stats = readingTime(content);

        return {
          slug,
          title: data.title || slug,
          description: data.description || '',
          date: data.date || new Date().toISOString().split('T')[0],
          tags: data.tags || [],
          category: data.category || '未分类',
          coverImage: data.coverImage || '',
          readingTime: stats.text,
          content,
        };
      })
  );

  postsCache = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  cacheTime = Date.now();
  return postsCache;
}

export async function getPosts(): Promise<Post[]> {
  return readPosts();
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const posts = await readPosts();
  return posts.find((post) => post.slug === slug);
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await readPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

export async function getAllTags(): Promise<{ name: string; count: number }[]> {
  const posts = await readPosts();
  const tagMap = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function searchPosts(query: string): Promise<Post[]> {
  const posts = await readPosts();
  const q = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(q) ||
      post.description.toLowerCase().includes(q) ||
      post.tags.some((tag) => tag.toLowerCase().includes(q))
  );
}
