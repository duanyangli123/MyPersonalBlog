'use client';

import { useState, useEffect } from 'react';

interface SiteSettings {
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

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (path: string, value: string | number) => {
    if (!settings) return;
    const keys = path.split('.');
    const next = JSON.parse(JSON.stringify(settings));
    let obj: Record<string, unknown> = next;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]] as Record<string, unknown>;
    obj[keys[keys.length - 1]] = value;
    setSettings(next);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (res.ok) setMessage('保存成功');
      else setMessage('保存失败');
    } catch {
      setMessage('网络错误');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">加载中...</p>;
  if (!settings) return <p className="text-red-500">加载设置失败</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">站点设置</h1>
        <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {saving ? '保存中...' : '保存设置'}
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${message.includes('成功') ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">基本信息</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">站点名称</label>
              <input type="text" value={settings.siteName} onChange={(e) => update('siteName', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">站点描述</label>
              <textarea value={settings.siteDescription} onChange={(e) => update('siteDescription', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm resize-none" />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">作者</label>
              <input type="text" value={settings.author} onChange={(e) => update('author', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">站点 URL</label>
              <input type="text" value={settings.siteUrl} onChange={(e) => update('siteUrl', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">社交链接</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">GitHub</label>
                <input type="text" value={settings.social.github} onChange={(e) => update('social.github', e.target.value)} placeholder="https://github.com/xxx" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">微博</label>
                <input type="text" value={settings.social.weibo} onChange={(e) => update('social.weibo', e.target.value)} placeholder="https://weibo.com/xxx" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm" />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">邮箱</label>
                <input type="text" value={settings.social.email} onChange={(e) => update('social.email', e.target.value)} placeholder="your@email.com" className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm" />
              </div>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">AI 配置</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">默认模型</label>
                <select value={settings.ai.defaultModel} onChange={(e) => update('ai.defaultModel', e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm">
                  <option value="mimo-v2">MiMo V2</option>
                  <option value="mimo-v2-pro">MiMo V2 Pro</option>
                  <option value="deepseek-v4">DeepSeek V4</option>
                  <option value="glm-5.1">GLM 5.1</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">最大 Token 数</label>
                <input type="number" value={settings.ai.maxTokens} onChange={(e) => update('ai.maxTokens', parseInt(e.target.value) || 2000)} className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
