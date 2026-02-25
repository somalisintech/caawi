'use client';

import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '../ui/button';

export function MentorsSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(search, 500);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (debouncedSearch) {
      router.push(`?search=${encodeURIComponent(debouncedSearch)}`);
    } else {
      router.push('?');
    }
  }, [debouncedSearch, router]);

  function handleClear() {
    setSearch('');
    router.push('?');
  }

  return (
    <div className="relative flex gap-2">
      <Input
        className="bg-muted pr-8"
        placeholder="Search by name, role, company or country"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {search && (
        <Button size="icon" className="border border-input" variant="secondary" type="button" onClick={handleClear}>
          <X />
        </Button>
      )}
    </div>
  );
}
