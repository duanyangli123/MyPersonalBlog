'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/admin/login') {
      setOk(true);
      return;
    }
    const token = document.cookie
      .split('; ')
      .find((c) => c.startsWith('admin_token='));
    if (token) {
      setOk(true);
    } else {
      router.replace('/admin/login');
    }
  }, [router, pathname]);

  if (!ok) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500">验证身份中...</p>
      </div>
    );
  }

  return <>{children}</>;
}
