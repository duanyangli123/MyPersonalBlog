import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Post } from '@/types';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

let postsCache: Post[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000;

function invalidateCache() {
  postsCache = null;
  cacheTime = 0;
}

function parsePost(file: string, fileContents: string): Post {
  const slug = file.replace(/\.mdx$/, '');
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
    draft: data.draft || false,
  };
}

async function readPosts(options?: { includeDrafts?: boolean }): Promise<Post[]> {
  if (postsCache && Date.now() - cacheTime < CACHE_TTL) {
    const posts = options?.includeDrafts ? postsCache : postsCache.filter((p) => !p.draft);
    return posts;
  }

  const files = await fs.readdir(postsDirectory);

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map(async (file) => {
        const filePath = path.join(postsDirectory, file);
        const fileContents = await fs.readFile(filePath, 'utf8');
        return parsePost(file, fileContents);
      })
  );

  postsCache = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  cacheTime = Date.now();
  const result = options?.includeDrafts ? postsCache : postsCache.filter((p) => !p.draft);
  return result;
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

export async function getPostsByPage(page: number, limit = 9): Promise<{ posts: Post[]; total: number; totalPages: number; currentPage: number }> {
  const allPosts = await readPosts();
  const total = allPosts.length;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (currentPage - 1) * limit;
  const posts = allPosts.slice(start, start + limit);
  return { posts, total, totalPages, currentPage };
}

export async function getPostsByTagAndPage(tag: string, page: number, limit = 9): Promise<{ posts: Post[]; total: number; totalPages: number; currentPage: number }> {
  const allPosts = await readPosts();
  const filtered = allPosts.filter((post) => post.tags.includes(tag));
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));
  const start = (currentPage - 1) * limit;
  const posts = filtered.slice(start, start + limit);
  return { posts, total, totalPages, currentPage };
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  const posts = await readPosts();
  return posts.filter((post) => post.category === category);
}

export async function getAllCategories(): Promise<{ name: string; count: number }[]> {
  const posts = await readPosts();
  const catMap = new Map<string, number>();
  posts.forEach((post) => {
    catMap.set(post.category, (catMap.get(post.category) || 0) + 1);
  });
  return Array.from(catMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getArchive(): Promise<{ year: number; month: number; posts: Post[] }[]> {
  const posts = await readPosts();
  const map = new Map<string, Post[]>();
  posts.forEach((post) => {
    const d = new Date(post.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(post);
  });
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, posts]) => {
      const [y, m] = key.split('-').map(Number);
      return { year: y, month: m, posts };
    });
}

export async function getRandomPost(): Promise<Post> {
  const posts = await readPosts();
  return posts[Math.floor(Math.random() * posts.length)];
}

export async function getAllPostsAdmin(): Promise<Post[]> {
  return readPosts({ includeDrafts: true });
}

export async function createPost(data: {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  coverImage?: string;
  content: string;
  draft?: boolean;
}): Promise<void> {
  const filePath = path.join(postsDirectory, `${data.slug}.mdx`);
  const frontmatter: Record<string, unknown> = {
    title: data.title,
    description: data.description,
    date: data.date,
    tags: data.tags,
    category: data.category,
  };
  if (data.coverImage) frontmatter.coverImage = data.coverImage;
  if (data.draft) frontmatter.draft = true;

  const fileContent = matter.stringify(data.content, frontmatter);
  await fs.writeFile(filePath, fileContent, 'utf8');
  invalidateCache();
}

export async function updatePost(slug: string, data: {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  category?: string;
  coverImage?: string;
  content?: string;
  draft?: boolean;
}): Promise<void> {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  const existing = await fs.readFile(filePath, 'utf8');
  const { data: frontmatter, content: existingContent } = matter(existing);

  const newFrontmatter: Record<string, unknown> = {
    title: data.title ?? frontmatter.title,
    description: data.description ?? frontmatter.description,
    date: data.date ?? frontmatter.date,
    tags: data.tags ?? frontmatter.tags,
    category: data.category ?? frontmatter.category,
    coverImage: data.coverImage ?? frontmatter.coverImage,
  };
  if (data.draft !== undefined) {
    if (data.draft) newFrontmatter.draft = true;
    else delete newFrontmatter.draft;
  } else if (frontmatter.draft) {
    newFrontmatter.draft = frontmatter.draft;
  }

  const newContent = data.content ?? existingContent;
  const fileContent = matter.stringify(newContent, newFrontmatter);
  await fs.writeFile(filePath, fileContent, 'utf8');
  invalidateCache();
}

export async function deletePost(slug: string): Promise<void> {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  await fs.unlink(filePath);
  invalidateCache();
}

export type { Post };
