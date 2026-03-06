'use client';

import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';
import { Button } from '../ui/button';

type Props = {
  countries?: string[];
};

function buildUrl(search: string, country: string) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (country) params.set('country', country);
  return params.toString() ? `?${params}` : '?';
}

export function MentorsSearch({ countries = [] }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Country is read directly from URL — no local state needed (no debounce)
  const country = searchParams.get('country') ?? '';

  // Search needs local state only for debouncing the text input
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(search, 500);
  const isFirstRender = useRef(true);

  // Sync debounced search value to URL (external system)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    router.push(buildUrl(debouncedSearch, country));
  }, [debouncedSearch, router, country]);

  function handleCountryChange(value: string) {
    router.push(buildUrl(debouncedSearch, value));
  }

  function handleClear() {
    setSearch('');
    router.push('?');
  }

  const hasFilters = search || country;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          className="bg-muted"
          placeholder="Search by name, role, company or country"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {hasFilters && (
          <Button size="icon" className="border border-input" variant="secondary" type="button" onClick={handleClear}>
            <X />
          </Button>
        )}
      </div>
      {countries.length > 0 && (
        <Select value={country} onValueChange={handleCountryChange}>
          <SelectTrigger className="bg-muted">
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent className="max-h-48 overflow-y-auto">
            {countries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
