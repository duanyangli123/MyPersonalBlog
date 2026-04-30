# 个人博客网站 — 开发规范

## 一、代码规范

### TypeScript 配置
- 严格模式 (strict: true)
- 禁止 any 类型
- 异步操作必须处理错误
- 禁止未使用的变量

### ESLint 规则
- 使用 @next/eslint-plugin-next
- 组件使用函数式声明
- 禁止 console.log（生产环境）
- 必须处理 Promise

## 二、命名规范

### 文件命名
- components/: PascalCase (PostCard.tsx)
- lib/: camelCase (formatDate.ts)
- content/: kebab-case (my-first-post.mdx)
- 测试文件: *.test.tsx

### 变量/函数命名
- 组件名: PascalCase (PostCard)
- 函数名: camelCase (formatDate)
- 常量名: UPPER_SNAKE_CASE (MAX_POSTS)
- 类型名: PascalCase (Post)
- 布尔变量: is/has/can前缀 (isLoading)

## 三、组件规范

### 文件结构
1. 导入
2. 类型定义
3. 组件实现
4. 默认导出

### 组件原则
- 单一职责：一个组件只做一件事
- Props 接口：使用 interface 定义
- 样式处理：使用 cn() 合并 className
- 无状态提升：保持组件独立

### 示例
`	sx
import { cn } from '@/lib/utils';
import type { PostCardProps } from '@/types';

export function PostCard({ post, className }: PostCardProps) {
  return (
    <article className={cn('rounded-lg border', className)}>
      <h2>{post.title}</h2>
    </article>
  );
}
`

## 四、样式规范

- 使用 Tailwind CSS
- cn() 工具合并 className
- 响应式优先设计
- 暗色模式支持

`	sx
<button className={cn(
  'px-4 py-2 rounded-lg',
  variant === 'primary' && 'bg-primary text-white',
  disabled && 'opacity-50'
)}>
`

## 五、AI 调用规范

### 接口设计
`	ypescript
interface AIRequest {
  model: 'glm-5.1' | 'deepseek-v4' | 'mimo-v2' | 'mimo-v2-pro';
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}
`

### 调用规则
1. 所有 AI 调用必须有超时设置（30秒）
2. 必须处理错误并返回友好提示
3. 敏感内容必须过滤
4. 记录调用日志用于成本统计
5. 实现结果缓存减少重复调用

## 六、Git 规范

### 提交信息格式
`
feat: 新增文章搜索功能
fix: 修复暗色模式切换问题
docs: 更新 README 文档
style: 调整卡片组件样式
refactor: 重构文章列表组件
perf: 优化图片加载性能
test: 添加单元测试
`

### 分支策略
- main: 生产分支
- develop: 开发分支
- feature/*: 功能分支
- fix/*: 修复分支
- hotfix/*: 紧急修复

## 七、测试规范

### 测试文件命名
- 组件: PostCard.test.tsx
- 工具: formatDate.test.ts
- API: posts.test.ts

### 测试结构
`	ypescript
describe('PostCard', () => {
  it('renders post title', () => {
    render(<PostCard post={mockPost} />);
    expect(screen.getByText('标题')).toBeInTheDocument();
  });
});
`

### 覆盖率要求
- 关键交互组件: 必须测试
- 工具函数: 必须测试
- API 路由: 核心接口必须测试

## 八、目录结构

`
src/
├── app/                    # Next.js App Router
├── components/             # 组件
│   ├── ui/                 # 基础 UI 组件
│   ├── blog/               # 博客组件
│   ├── layout/             # 布局组件
│   └── ai/                 # AI 相关组件
├── lib/                    # 工具函数
│   ├── ai/                 # AI 模型调用
│   ├── db/                 # 数据库操作
│   └── utils/              # 通用工具
├── content/                # MDX 文章内容
├── types/                  # TypeScript 类型
└── styles/                 # 全局样式
`

## 九、代码审查清单

- [ ] TypeScript 严格模式无报错
- [ ] ESLint 无警告
- [ ] 组件有完整的 Props 类型定义
- [ ] 异步操作有错误处理
- [ ] 敏感信息未硬编码
- [ ] 代码有适当的注释
- [ ] 测试覆盖关键路径
- [ ] 响应式设计正常
- [ ] 暗色模式正常
- [ ] 性能无明显瓶颈
