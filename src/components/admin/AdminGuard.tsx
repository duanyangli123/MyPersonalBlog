'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setOk(true);
      return;
    }
    const hasToken = document.cookie.includes('admin_token=');
    if (hasToken) {
      setOk(true);
    } else {
      router.replace('/admin/login');
    }
  }, [router, isLoginPage]);

  if (!ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500">验证身份中...</p>
      </div>
    );
  }

  return <>{children}</>;
}
