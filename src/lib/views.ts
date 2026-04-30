import fs from 'fs';
import path from 'path';

const VIEWS_FILE = path.join(process.cwd(), 'src/data/views.json');

function readViews(): Record<string, number> {
  try {
    const data = fs.readFileSync(VIEWS_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

function writeViews(views: Record<string, number>) {
  const dir = path.dirname(VIEWS_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(VIEWS_FILE, JSON.stringify(views, null, 2));
}

export function getViews(slug: string): number {
  const views = readViews();
  return views[slug] || 0;
}

export function getAllViews(): Record<string, number> {
  return readViews();
}

export function incrementViews(slug: string): number {
  const views = readViews();
  views[slug] = (views[slug] || 0) + 1;
  writeViews(views);
  return views[slug];
}
