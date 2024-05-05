'use client';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Props = {
  searchQuery?: string;
};

export function MentorsSearch({ searchQuery = '' }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    if (debouncedSearch) {
      return router.push(`?search=${debouncedSearch}`);
    }
    return router.push('?');
  }, [router, debouncedSearch]);

  return (
    <Input
      className="bg-muted"
      placeholder="Search by name, role, company or country"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
