'use client';

import { useState } from 'react';
import { polishArticle, generateSummary, generateSEODescription, extractKeywords, suggestTitles } from '@/lib/ai/client';
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

export function AIAssistant({ content, title }: AIAssistantProps) {
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState('');
  const [results, setResults] = useState<AIResult[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [copied, setCopied] = useState('');

  const addResult = (type: string, label: string, content: string) => {
    setResults((prev) => [{ type, label, content }, ...prev.filter((r) => r.type !== type)]);
  };

  const handleAction = async (type: string, action: () => Promise<string | string[]>) => {
    setLoading(true);
    setActiveType(type);
    try {
      const result = await action();
      if (Array.isArray(result)) {
        addResult(type, getLabel(type), result.join('、'));
      } else {
        addResult(type, getLabel(type), result);
      }
    } catch (error) {
      addResult(type, getLabel(type), '请求失败，请稍后重试');
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

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={cn(
          'w-12 h-12 rounded-full shadow-lg transition-all flex items-center justify-center text-xl',
          showPanel
            ? 'bg-gray-600 text-white rotate-0'
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
                onClick={() => {
                  const handlers: Record<string, () => Promise<string | string[]>> = {
                    polish: () => polishArticle(content),
                    summary: () => generateSummary(content),
                    seo: () => generateSEODescription(title || '', content),
                    keywords: async () => (await extractKeywords(content)).join('、'),
                    titles: async () => (await suggestTitles(title || '', content)).join('\n'),
                  };
                  handleAction(action.type, handlers[action.type]);
                }}
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
