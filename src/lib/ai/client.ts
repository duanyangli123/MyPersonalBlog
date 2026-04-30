import type { AIRequest, AIResponse } from '@/types';

interface ModelConfig {
  name: string;
  baseUrl: string;
  apiKey: string;
  modelId: string;
  protocol: 'openai' | 'anthropic';
}

function getModelConfig(model: string): ModelConfig {
  const configs: Record<string, Partial<ModelConfig>> = {
    // 豆包 (Volcengine) — OpenAI 兼容
    'glm-5.1': {
      name: '豆包',
      baseUrl: process.env.DOUBAO_API_BASE || 'https://ark.cn-beijing.volces.com/api/v3',
      apiKey: process.env.DOUBAO_API_KEY || '',
      modelId: process.env.DOUBAO_MODEL_ID || 'ep-20250218052658-x5s8j',
      protocol: 'openai',
    },
    // DeepSeek — OpenAI 兼容
    'deepseek-v4': {
      name: 'DeepSeek V4 Pro',
      baseUrl: process.env.DEEPSEEK_API_BASE || 'https://api.deepseek.com/v1',
      apiKey: process.env.DEEPSEEK_API_KEY || '',
      modelId: process.env.DEEPSEEK_MODEL_ID || 'deepseek-chat',
      protocol: 'openai',
    },
    // MiMo V2.5 (Xiaomi) — OpenAI 兼容
    'mimo-v2': {
      name: 'MiMo V2.5',
      baseUrl: process.env.MIMO_API_BASE || 'https://token-plan-cn.xiaomimimo.com/v1',
      apiKey: process.env.MIMO_API_KEY || '',
      modelId: process.env.MIMO_MODEL_ID || 'mimo-v2.5',
      protocol: 'openai',
    },
    // MiMo V2.5 Pro (Xiaomi) — OpenAI 兼容
    'mimo-v2-pro': {
      name: 'MiMo V2.5 Pro',
      baseUrl: process.env.MIMO_PRO_API_BASE || 'https://token-plan-cn.xiaomimimo.com/v1',
      apiKey: process.env.MIMO_PRO_API_KEY || '',
      modelId: process.env.MIMO_PRO_MODEL_ID || 'mimo-v2.5-pro',
      protocol: 'openai',
    },
  };

  const config = configs[model] || configs['glm-5.1'];
  return {
    name: config.name || model,
    baseUrl: config.baseUrl || '',
    apiKey: config.apiKey || '',
    modelId: config.modelId || model,
    protocol: config.protocol || 'openai',
  };
}

export async function callAI(request: AIRequest): Promise<AIResponse> {
  const config = getModelConfig(request.model);

  if (!config.apiKey) {
    return {
      content: getMockResponse(request),
      tokens: 0,
      model: config.name,
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    if (config.protocol === 'anthropic') {
      // Anthropic 协议
      const response = await fetch(`${config.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: config.modelId,
          max_tokens: request.maxTokens || 1000,
          temperature: request.temperature ?? 0.7,
          system: '你是一个专业的旅游博客写作助手。',
          messages: [{ role: 'user', content: request.prompt }],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`AI API error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      return {
        content: data.content?.[0]?.text || '',
        tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        model: config.name,
      };
    } else {
      // OpenAI 兼容协议
      const response = await fetch(`${config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model: config.modelId,
          messages: [
            { role: 'system', content: '你是一个专业的旅游博客写作助手。' },
            { role: 'user', content: request.prompt },
          ],
          max_tokens: request.maxTokens || 1000,
          temperature: request.temperature ?? 0.7,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`AI API error (${response.status}): ${errText}`);
      }

      const data = await response.json();
      return {
        content: data.choices?.[0]?.message?.content || '',
        tokens: data.usage?.total_tokens || 0,
        model: config.name,
      };
    }
  } catch (error) {
    console.error('AI call failed:', error);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function getMockResponse(request: AIRequest): string {
  if (request.prompt.includes('润色')) {
    return '（AI 润色功能需要配置 API 密钥，请在 .env.local 中设置 DOUBAO_API_KEY）';
  }
  if (request.prompt.includes('摘要')) {
    return '（AI 摘要功能需要配置 API 密钥）';
  }
  if (request.prompt.includes('SEO') || request.prompt.includes('Meta')) {
    return '（AI SEO 功能需要配置 API 密钥）';
  }
  if (request.prompt.includes('关键词')) {
    return '（AI 关键词功能需要配置 API 密钥）';
  }
  if (request.prompt.includes('推荐') || request.prompt.includes('相关')) {
    return '（AI 推荐功能需要配置 API 密钥）';
  }
  return '（请配置 AI API 密钥以启用此功能）';
}

// 中文内容引擎 — 豆包
export async function polishArticle(content: string): Promise<string> {
  const result = await callAI({
    model: 'glm-5.1',
    prompt: `请润色以下旅游博客文章，使其更生动、更有感染力，保持原文意思和格式不变：\n\n${content}`,
    temperature: 0.7,
  });
  return result.content;
}

export async function generateSummary(content: string): Promise<string> {
  const result = await callAI({
    model: 'glm-5.1',
    prompt: `请为以下文章生成一段简短的摘要（100字以内）：\n\n${content}`,
    temperature: 0.3,
  });
  return result.content;
}

export async function generateSEODescription(title: string, content: string): Promise<string> {
  const result = await callAI({
    model: 'deepseek-v4',
    prompt: `为以下文章生成SEO友好的Meta描述（160字以内），标题：${title}\n\n内容：${content.substring(0, 500)}`,
    temperature: 0.3,
  });
  return result.content;
}

export async function extractKeywords(content: string): Promise<string[]> {
  const result = await callAI({
    model: 'glm-5.1',
    prompt: `提取以下文章的5-10个关键词，用逗号分隔，只返回关键词不要其他内容：\n\n${content}`,
    temperature: 0.2,
  });
  if (result.content.includes('配置 API 密钥')) return [];
  return result.content.split(/[,，]/).map((k) => k.trim()).filter(Boolean);
}

export async function suggestTitles(title: string, content: string): Promise<string[]> {
  const result = await callAI({
    model: 'mimo-v2',
    prompt: `为以下文章生成3个更有吸引力的标题建议，每行一个，只返回标题不要序号和其他内容：\n原标题：${title}\n\n内容摘要：${content.substring(0, 300)}`,
    temperature: 0.8,
  });
  if (result.content.includes('配置 API 密钥')) return [];
  return result.content.split('\n').filter(Boolean);
}

export async function getRelatedPosts(currentPost: string, allPosts: string[]): Promise<string[]> {
  const result = await callAI({
    model: 'mimo-v2-pro',
    prompt: `当前文章：${currentPost}\n\n其他文章列表：${allPosts.join('\n')}\n\n推荐3篇最相关的文章，用标题回答，每行一个：`,
    temperature: 0.3,
  });
  if (result.content.includes('配置 API 密钥')) return [];
  return result.content.split('\n').filter(Boolean);
}
