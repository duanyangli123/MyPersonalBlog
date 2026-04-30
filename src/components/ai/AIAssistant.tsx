'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AIAssistantProps {
  content: string;
  title?: string;
}

interface AIResult {
  type: string;
  label: string;
  content: string;
}

async function callAIHelper(model: string, prompt: string, temperature = 0.7): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 90000);

  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt, temperature }),
      signal: controller.signal,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'AI request failed');
    return data.content;
  } finally {
    clearTimeout(timeout);
  }
}

export function AIAssistant({ content, title }: AIAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState('');
  const [results, setResults] = useState<AIResult[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [copied, setCopied] = useState('');

  const addResult = (type: string, label: string, content: string) => {
    setResults((prev) => [{ type, label, content }, ...prev.filter((r) => r.type !== type)]);
  };

  const handleAction = async (type: string, action: () => Promise<string>) => {
    setLoading(true);
    setActiveType(type);
    try {
      const result = await action();
      addResult(type, getLabel(type), result);
    } catch (error) {
      addResult(type, getLabel(type), '请求失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
    setLoading(false);
    setActiveType('');
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  const actions = [
    { type: 'polish', label: '润色文章', icon: '✨', color: 'blue' },
    { type: 'summary', label: '生成摘要', icon: '📝', color: 'green' },
    { type: 'seo', label: 'SEO 描述', icon: '🔍', color: 'purple' },
    { type: 'keywords', label: '提取关键词', icon: '🏷️', color: 'orange' },
    { type: 'titles', label: '标题建议', icon: '💡', color: 'pink' },
  ];

  const handlePolish = () => handleAction('polish', () =>
    callAIHelper('glm-5.1', `请润色以下旅游博客文章，使其更生动、更有感染力，保持原文意思和格式不变：\n\n${content}`, 0.7)
  );

  const handleSummary = () => handleAction('summary', () =>
    callAIHelper('glm-5.1', `请为以下文章生成一段简短的摘要（100字以内）：\n\n${content}`, 0.3)
  );

  const handleSEO = () => handleAction('seo', () =>
    callAIHelper('deepseek-v4', `为以下文章生成SEO友好的Meta描述（160字以内），标题：${title || ''}\n\n内容：${content.substring(0, 500)}`, 0.3)
  );

  const handleKeywords = () => handleAction('keywords', async () => {
    const result = await callAIHelper('glm-5.1', `提取以下文章的5-10个关键词，用逗号分隔，只返回关键词不要其他内容：\n\n${content}`, 0.2);
    return result.includes('配置 API 密钥') ? result : result.split(/[,，]/).map((k) => k.trim()).filter(Boolean).join('、');
  });

  const handleTitles = () => handleAction('titles', () =>
    callAIHelper('mimo-v2', `为以下文章生成3个更有吸引力的标题建议，每行一个，只返回标题不要序号和其他内容：\n原标题：${title || ''}\n\n内容摘要：${content.substring(0, 300)}`, 0.8)
  );

  const handlers: Record<string, () => void> = {
    polish: handlePolish,
    summary: handleSummary,
    seo: handleSEO,
    keywords: handleKeywords,
    titles: handleTitles,
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={cn(
          'w-12 h-12 rounded-full shadow-lg transition-all flex items-center justify-center text-xl',
          showPanel
            ? 'bg-gray-600 text-white'
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-110'
        )}
      >
        {showPanel ? '✕' : '🤖'}
      </button>

      {showPanel && (
        <div className="absolute bottom-16 right-0 w-80 max-h-[70vh] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">AI 助手</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">基于文章内容智能分析</p>
          </div>

          <div className="p-3 grid grid-cols-2 gap-2 border-b border-gray-200 dark:border-gray-700">
            {actions.map((action) => (
              <button
                key={action.type}
                onClick={() => handlers[action.type]()}
                disabled={loading}
                className={cn(
                  'px-3 py-2 text-xs rounded-lg transition-colors disabled:opacity-50 text-left',
                  getColorClasses(action.color),
                  loading && activeType === action.type && 'animate-pulse'
                )}
              >
                {action.icon} {loading && activeType === action.type ? '处理中...' : action.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {results.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">
                点击上方按钮使用 AI 功能
              </p>
            ) : (
              results.map((result) => (
                <div
                  key={result.type}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {result.label}
                    </span>
                    <button
                      onClick={() => handleCopy(result.content, result.type)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {copied === result.type ? '已复制' : '复制'}
                    </button>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-xs leading-relaxed">
                    {result.content}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getLabel(type: string): string {
  const labels: Record<string, string> = {
    polish: '润色结果',
    summary: '文章摘要',
    seo: 'SEO 描述',
    keywords: '关键词',
    titles: '标题建议',
  };
  return labels[type] || type;
}

function getColorClasses(color: string): string {
  const classes: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50',
    orange: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/50',
    pink: 'bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 hover:bg-pink-100 dark:hover:bg-pink-900/50',
  };
  return classes[color] || classes.blue;
}
