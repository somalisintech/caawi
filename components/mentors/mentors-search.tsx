'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';

export function MentorsSearch() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (debouncedSearch) {
      router.push(`?search=${debouncedSearch}`);
    } else {
      router.push('?');
    }
  }, [debouncedSearch, router]);

  return (
    <Input
      className="bg-muted"
      placeholder="Search by name, role, company or country"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
