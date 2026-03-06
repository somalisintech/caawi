'use client';

import { Filter, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/use-debounce';

type Props = {
  countries?: string[];
  allSkills?: Record<string, string[]>;
};

function buildUrl(search: string, country: string, skills: string[]) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (country) params.set('country', country);
  for (const skill of skills) {
    params.append('skills', skill);
  }
  return params.toString() ? `?${params}` : '?';
}

export function MentorsSearch({ countries = [], allSkills }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Country is read directly from URL — no local state needed (no debounce)
  const country = searchParams.get('country') ?? '';
  const selectedSkills = searchParams.getAll('skills');

  // Search needs local state only for debouncing the text input
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const debouncedSearch = useDebounce(search, 500);
  const isFirstRender = useRef(true);

  // Sync debounced search value to URL (external system)
  // selectedSkills is intentionally read from searchParams inside the callback
  // rather than listed as a dependency — it's derived from the URL and adding it
  // would cause an infinite re-render loop.
  const selectedSkillsRef = useRef(selectedSkills);
  selectedSkillsRef.current = selectedSkills;

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    router.push(buildUrl(debouncedSearch, country, selectedSkillsRef.current));
  }, [debouncedSearch, router, country]);

  function handleCountryChange(value: string) {
    router.push(buildUrl(debouncedSearch, value, selectedSkills));
  }

  function handleSkillToggle(skill: string) {
    const next = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];
    router.push(buildUrl(debouncedSearch, country, next));
  }

  function handleClear() {
    setSearch('');
    router.push('?');
  }

  const hasFilters = search || country || selectedSkills.length > 0;

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
      <div className="flex gap-2">
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
        {allSkills && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-muted gap-1.5">
                <Filter className="size-4" />
                Skills
                {selectedSkills.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0">
                    {selectedSkills.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-80 overflow-y-auto p-3" align="start">
              <div className="space-y-4">
                {Object.entries(allSkills).map(([category, skills]) => (
                  <div key={category}>
                    <div className="mb-2 text-xs font-medium uppercase text-muted-foreground">{category}</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      {skills.map((skill) => {
                        const skillId = `skill-${skill.replaceAll(/[^a-zA-Z0-9-_]/g, '-')}`;
                        return (
                          <div key={skill} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              id={skillId}
                              checked={selectedSkills.includes(skill)}
                              onCheckedChange={() => handleSkillToggle(skill)}
                            />
                            <label htmlFor={skillId} className="cursor-pointer">
                              {skill}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
