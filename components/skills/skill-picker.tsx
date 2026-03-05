'use client';

import { useCallback, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Props = {
  selected: string[];
  skillsByCategory: Record<string, string[]>;
  onChange: (skills: string[]) => void;
};

export function SkillPicker({ selected, skillsByCategory, onChange }: Props) {
  const categories = Object.keys(skillsByCategory);
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const [activeCategory, setActiveCategory] = useState<string | null>(() => {
    if (selected.length === 0) return null;
    return categories.find((cat) => skillsByCategory[cat]?.some((s) => selectedSet.has(s))) ?? null;
  });

  const toggleSkill = useCallback(
    (skill: string) => {
      const next = selectedSet.has(skill) ? selected.filter((s) => s !== skill) : [...selected, skill];
      onChange(next);
    },
    [selected, selectedSet, onChange]
  );

  const activeSkills = activeCategory ? skillsByCategory[activeCategory] : [];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            className={cn('cursor-pointer', activeCategory !== category && 'hover:bg-muted')}
            onClick={() => setActiveCategory(activeCategory === category ? null : category)}
          >
            {category}
          </Badge>
        ))}
      </div>
      {activeCategory ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Select skills in <span className="font-medium text-foreground">{activeCategory}</span>
            {selected.length > 0 ? <span className="tabular-nums"> &middot; {selected.length} selected</span> : null}
          </p>
          <div className="flex flex-wrap gap-2">
            {activeSkills?.map((skill) => {
              const isSelected = selectedSet.has(skill);
              return (
                <Badge
                  key={skill}
                  variant={isSelected ? 'default' : 'secondary'}
                  className={cn('cursor-pointer', !isSelected && 'hover:bg-muted')}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
