'use client';

import { Badge } from '@/components/ui/badge';

export function RelativeBadge({ date }: { date: Date }) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date);
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffDays = Math.round((targetDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0 || diffDays > 7) return null;

  const label = diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : `in ${diffDays} days`;

  return <Badge variant="secondary">{label}</Badge>;
}
