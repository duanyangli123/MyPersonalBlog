'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminGuard } from '@/components/admin/AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden">
          <div className="p-6 md:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
