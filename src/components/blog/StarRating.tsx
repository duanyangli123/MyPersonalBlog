'use client';

import { useState, useEffect, useCallback } from 'react';

interface StarRatingProps {
  slug: string;
}

export function StarRating({ slug }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const raw = localStorage.getItem(`rating-${slug}`);
    if (raw) setRating(JSON.parse(raw));
  }, [slug]);

  const rate = useCallback((value: number) => {
    const newRating = rating === value ? 0 : value;
    setRating(newRating);
    localStorage.setItem(`rating-${slug}`, JSON.stringify(newRating));
  }, [rating, slug]);

  if (!mounted) return <div className="h-6" />;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => rate(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-lg transition-transform duration-150 hover:scale-125"
          aria-label={`评${star}星`}
        >
          {star <= (hovered || rating) ? '⭐' : '☆'}
        </button>
      ))}
      {rating > 0 && <span className="text-xs text-gray-400 ml-1">{rating}/5</span>}
    </div>
  );
}
