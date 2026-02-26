'use client';

import { cn } from '@/lib/utils';

const STEPS = ['Role', 'Profile', 'Skills'] as const;

type Props = {
  currentStep: number;
};

export function OnboardingProgress({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'size-2 rounded-full',
                  isActive && 'size-2.5 bg-primary',
                  isCompleted && 'bg-primary',
                  !isActive && !isCompleted && 'bg-muted-foreground/30'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium',
                  (isActive || isCompleted) && 'text-primary',
                  !isActive && !isCompleted && 'text-muted-foreground/50'
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 ? <div className="h-px w-8 bg-muted-foreground/20" /> : null}
          </div>
        );
      })}
    </div>
  );
}
