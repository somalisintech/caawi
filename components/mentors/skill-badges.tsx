import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Props = {
  skills: string[];
  max?: number;
  className?: string;
};

export function SkillBadges({ skills, max = 3, className }: Props) {
  if (skills.length === 0) return null;

  const visible = max === Infinity ? skills : skills.slice(0, max);
  const overflow = skills.length - visible.length;

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {visible.map((skill, i) => (
        <Badge key={`${skill}-${i}`} variant="secondary" className="text-xs">
          {skill}
        </Badge>
      ))}
      {overflow > 0 && (
        <Badge variant="outline" className="text-xs">
          +{overflow} more
        </Badge>
      )}
    </div>
  );
}
