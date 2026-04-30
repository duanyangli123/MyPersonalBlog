export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">关于我</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p>
          你好！我是一个热爱旅行的人，喜欢用镜头记录世界各地的美丽风景。
        </p>
        <p>
          这个博客是我分享旅行经历和故事的地方。在这里，你可以找到：
        </p>
        <ul>
          <li>🌍 各地旅游攻略</li>
          <li>📸 风景摄影作品</li>
          <li>📝 旅行日记和心得</li>
          <li>🗺️ 路线规划建议</li>
        </ul>
        <p>
          希望通过这个博客，能够帮助更多人发现世界的美好，开启属于自己的旅行故事。
        </p>
      </div>
    </div>
  );
}
