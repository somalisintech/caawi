'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <Button variant="outline" size="icon" onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
      <Sun className="hidden dark:block transition-all" />
      <Moon className="block dark:hidden transition-all" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
