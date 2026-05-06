import fs from 'fs/promises';
import path from 'path';

const VIEWS_FILE = path.join(process.cwd(), 'src/data/views.json');

let viewsCache: Record<string, number> | null = null;
let viewsCacheTime = 0;
const VIEWS_CACHE_TTL = 10_000;

async function readViews(): Promise<Record<string, number>> {
  if (viewsCache && Date.now() - viewsCacheTime < VIEWS_CACHE_TTL) {
    return viewsCache;
  }
  try {
    const data = await fs.readFile(VIEWS_FILE, 'utf8');
    viewsCache = JSON.parse(data);
  } catch {
    viewsCache = {};
  }
  viewsCacheTime = Date.now();
  return viewsCache!;
}

async function writeViews(views: Record<string, number>) {
  viewsCache = views;
  viewsCacheTime = Date.now();
  const dir = path.dirname(VIEWS_FILE);
  try { await fs.mkdir(dir, { recursive: true }); } catch {}
  await fs.writeFile(VIEWS_FILE, JSON.stringify(views, null, 2));
}

export async function getViews(slug: string): Promise<number> {
  const views = await readViews();
  return views[slug] || 0;
}

export async function getAllViews(): Promise<Record<string, number>> {
  return readViews();
}

export async function incrementViews(slug: string): Promise<number> {
  const views = await readViews();
  views[slug] = (views[slug] || 0) + 1;
  await writeViews(views);
  return views[slug];
}
