import fs from 'fs/promises';
import path from 'path';

const SETTINGS_PATH = path.join(process.cwd(), 'src/data/settings.json');
const ANALYTICS_PATH = path.join(process.cwd(), 'src/data/analytics.json');

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  author: string;
  siteUrl: string;
  social: {
    github: string;
    weibo: string;
    wechat: string;
    email: string;
  };
  ai: {
    defaultModel: string;
    maxTokens: number;
  };
}

const defaultSettings: SiteSettings = {
  siteName: '旅游博客',
  siteDescription: '记录每一次旅行的所见所闻，分享美丽的风景照片和有趣的故事',
  author: '旅游博主',
  siteUrl: 'https://my-personal-blog-sage.vercel.app',
  social: {
    github: '',
    weibo: '',
    wechat: '',
    email: '',
  },
  ai: {
    defaultModel: 'mimo-v2',
    maxTokens: 2000,
  },
};

export interface AnalyticsData {
  bookmarks: Record<string, number>;
  likes: Record<string, number>;
  ratings: Record<string, number[]>;
}

const defaultAnalytics: AnalyticsData = {
  bookmarks: {},
  likes: {},
  ratings: {},
};

async function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

export async function getSettings(): Promise<SiteSettings> {
  try {
    const raw = await fs.readFile(SETTINGS_PATH, 'utf8');
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await ensureDir(SETTINGS_PATH);
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf8');
}

export async function getAnalytics(): Promise<AnalyticsData> {
  try {
    const raw = await fs.readFile(ANALYTICS_PATH, 'utf8');
    return { ...defaultAnalytics, ...JSON.parse(raw) };
  } catch {
    return defaultAnalytics;
  }
}

export async function saveAnalytics(data: AnalyticsData): Promise<void> {
  await ensureDir(ANALYTICS_PATH);
  await fs.writeFile(ANALYTICS_PATH, JSON.stringify(data, null, 2), 'utf8');
}
