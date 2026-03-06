'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
};

export function StarRating({ value, onChange, readonly, size = 'md' }: Props) {
  const [hovered, setHovered] = useState(0);

  const starSize = size === 'sm' ? 'size-4' : 'size-5';

  return (
    <div role="radiogroup" aria-label="Rating" className="flex gap-0.5" onMouseLeave={() => !readonly && setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            className={cn(
              'transition-colors',
              readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110',
              filled ? 'text-amber-400' : 'text-muted-foreground/30'
            )}
          >
            <Star className={cn(starSize, filled && 'fill-current')} />
          </button>
        );
      })}
    </div>
  );
}
