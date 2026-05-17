import Link from 'next/link';
import { cn } from '@/lib/utils';

const STATUS_TABS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'REVIEWED', label: 'Reviewed' },
  { value: 'ACTION_TAKEN', label: 'Actioned' },
  { value: 'DISMISSED', label: 'Dismissed' }
] as const;

type Props = {
  current: (typeof STATUS_TABS)[number]['value'];
};

export function AdminReportsStatusTabs({ current }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {STATUS_TABS.map((tab) => {
        const isActive = tab.value === current;
        const href = tab.value === 'PENDING' ? '?' : `?status=${tab.value}`;
        return (
          <Link
            key={tab.value}
            href={href}
            className={cn(
              'inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
              isActive
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
