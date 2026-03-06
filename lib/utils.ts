import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MAX_PAGE } from './constants/data';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parsePage(raw?: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n) || !Number.isInteger(n) || n < 1) return 1;
  return Math.min(n, MAX_PAGE);
}
