# 个人博客网站 — 开发计划

## 一、项目概述

| 项目 | 说明 |
|------|------|
| 项目名称 | 个人博客网站 |
| 技术栈 | Next.js 14 (App Router) + TypeScript + Tailwind CSS + MDX |
| AI 集成 | GLM 5.1 / DeepSeek V4 Pro / Xiaomi MiMo V2 / Xiaomi MiMo V2 Pro |
| 开发工具 | OpenCode (编码 Agent) |

## 二、AI 模型分工

| 模型 | 定位 | 具体用途 |
|------|------|----------|
| GLM 5.1 | 中文内容引擎 | 博客文章撰写、润色、SEO优化、关键词提取 |
| DeepSeek V4 Pro | 代码生成引擎 | 组件开发、API设计、数据库Schema、测试用例 |
| Xiaomi MiMo V2 | 创意内容引擎 | 文章配图描述、社交媒体文案、创意标题 |
| Xiaomi MiMo V2 Pro | 高级分析引擎 | 文章推荐算法、用户行为分析、性能优化 |
| OpenCode | 编码 Agent | 代码实现、Bug修复、代码重构、自动化测试 |

## 三、技术栈

- 前端: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui + MDX
- 后端: SQLite (Prisma ORM)
- 部署: Vercel / Netlify

## 四、开发阶段

### 阶段一：项目初始化（1-2天）
- Next.js 14 + TypeScript 初始化
- Tailwind CSS + shadcn/ui 配置
- 目录结构规划
- ESLint + Prettier + Husky 配置
- 设计系统建立

### 阶段二：核心功能开发（3-5天）
- 文章系统（MDX支持）
- 文章列表/详情页
- 标签/分类系统
- 搜索功能
- 首页/关于/归档/项目展示页
- 暗色模式/阅读进度条/目录导航

### 阶段三：AI 功能集成（3-4天）
- AI 调用封装（统一接口）
- 文章润色、SEO优化、内容摘要
- 相关文章推荐、阅读时间估算
- 文章封面自动生成

### 阶段四：数据与后端（2-3天）
- SQLite + Prisma 配置
- 文章/标签 CRUD 接口
- 阅读量统计
- 评论系统（Giscus）

### 阶段五：优化与部署（2-3天）
- 性能优化（懒加载/代码分割/ISR）
- SEO优化（Meta/JSON-LD/Sitemap）
- Vercel 部署 + 域名配置

## 五、时间估算

| 阶段 | 工时 |
|------|------|
| 项目初始化 | 1-2天 |
| 核心功能开发 | 3-5天 |
| AI 功能集成 | 3-4天 |
| 数据与后端 | 2-3天 |
| 优化与部署 | 2-3天 |
| **总计** | **11-17天** |

## 六、成功指标

- 页面加载时间 < 2秒
- Lighthouse 性能评分 > 90
- 移动端适配完美
- SEO 评分 > 90
- AI 功能响应时间 < 5秒
