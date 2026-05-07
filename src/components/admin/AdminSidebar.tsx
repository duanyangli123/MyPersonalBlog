'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const menuItems = [
  { href: '/admin', icon: '📊', label: '仪表盘' },
  { href: '/admin/posts', icon: '📝', label: '文章管理' },
  { href: '/admin/media', icon: '🖼️', label: '媒体管理' },
  { href: '/admin/analytics', icon: '📈', label: '数据统计' },
  { href: '/admin/settings', icon: '⚙️', label: '站点设置' },
  { href: '/admin/seo', icon: '🔍', label: 'SEO工具' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <Link href="/admin" className="text-lg font-bold text-gray-900 dark:text-white">
          🛠️ 管理后台
        </Link>
        <Link href="/" className="text-xs text-gray-400 hover:text-blue-500 block mt-1">
          返回前台 →
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <span>🚪</span>
          <span>退出登录</span>
        </button>
      </div>
    </aside>
  );
}
