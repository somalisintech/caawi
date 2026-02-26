'use client';

import { GraduationCap, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { UserType } from '@/generated/prisma/browser';
import { cn } from '@/lib/utils';

type Props = {
  value: UserType | null;
  onSelect: (role: UserType) => void;
};

const roles = [
  {
    type: 'MENTEE' as const,
    icon: GraduationCap,
    title: "I'm looking for a mentor",
    description: 'Get guidance from experienced Somali professionals in your field'
  },
  {
    type: 'MENTOR' as const,
    icon: Users,
    title: 'I want to mentor others',
    description: 'Share your knowledge and help the next generation grow'
  }
];

export function RoleStep({ value, onSelect }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {roles.map(({ type, icon: Icon, title, description }) => (
        <Card
          key={type}
          className={cn(
            'cursor-pointer hover:border-primary hover:shadow-md',
            value === type && 'border-primary ring-2 ring-primary/20'
          )}
          onClick={() => onSelect(type)}
        >
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
              <Icon className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-pretty font-semibold">{title}</p>
              <p className="mt-1 text-pretty text-sm text-muted-foreground">{description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
