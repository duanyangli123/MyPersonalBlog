export interface Post {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  coverImage?: string;
  readingTime: string;
  content: string;
}

export interface Tag {
  name: string;
  count: number;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  date: string;
  avatar?: string;
}

export interface AIRequest {
  model: 'glm-5.1' | 'deepseek-v4' | 'mimo-v2' | 'mimo-v2-pro';
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  tokens: number;
  model: string;
}
