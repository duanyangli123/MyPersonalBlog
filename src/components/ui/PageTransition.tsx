'use client';

import { useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [fadeIn, setFadeIn] = useState(false);

  if (typeof window !== 'undefined' && !fadeIn) {
    requestAnimationFrame(() => setFadeIn(true));
  }

  return (
    <div
      className="transition-all duration-300 ease-out"
      style={{
        opacity: fadeIn ? 1 : 0,
        transform: fadeIn ? 'translateY(0)' : 'translateY(8px)',
      }}
    >
      {children}
    </div>
  );
}
