'use client';

import type { ReactNode } from 'react';

export function DevOnly({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV !== 'development') return null;
  return <>{children}</>;
}
