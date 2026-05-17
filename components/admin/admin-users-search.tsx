'use client';

import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All users' },
  { value: 'active', label: 'Active' },
  { value: 'banned', label: 'Banned' },
  { value: 'admin', label: 'Admins' }
];

function buildUrl(search: string, status: string) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (status && status !== 'all') params.set('status', status);
  return params.toString() ? `?${params}` : '?';
}

export function AdminUsersSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const status = searchParams.get('status') ?? 'all';
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(search, 400);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    router.push(buildUrl(debouncedSearch, status));
  }, [debouncedSearch, router, status]);

  function handleStatusChange(value: string) {
    router.push(buildUrl(debouncedSearch, value));
  }

  function handleClear() {
    setSearch('');
    router.push('?');
  }

  const hasFilters = search || (status && status !== 'all');

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Input
        className="bg-card"
        placeholder="Search by name or email"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select value={status} onValueChange={handleStatusChange}>
        <SelectTrigger className="bg-card sm:w-44">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasFilters && (
        <Button size="icon" className="border border-input" variant="secondary" type="button" onClick={handleClear}>
          <X />
        </Button>
      )}
    </div>
  );
}
