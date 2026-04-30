'use client';

import { useEffect, useState } from 'react';

interface ViewCountProps {
  slug: string;
}

export function ViewCount({ slug }: ViewCountProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/views/${slug}`, { method: 'POST' })
      .then((res) => res.json())
      .then((data) => setViews(data.views))
      .catch(() => setViews(null));
  }, [slug]);

  if (views === null) return null;

  return (
    <span className="text-xs text-gray-500 dark:text-gray-400">
      {views} 次阅读
    </span>
  );
}
