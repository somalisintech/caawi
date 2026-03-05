'use client';

import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { SkillPicker } from '@/components/skills/skill-picker';
import { Button } from '@/components/ui/button';
import type { OnboardingData } from '../onboarding-flow';

type Props = {
  selected: string[];
  skillsByCategory: Record<string, string[]>;
  onUpdate: (partial: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
  submitting: boolean;
};

export function SkillsStep({ selected, skillsByCategory, onUpdate, onNext, onBack, submitting }: Props) {
  return (
    <div className="space-y-4">
      <SkillPicker
        selected={selected}
        skillsByCategory={skillsByCategory}
        onChange={(skills) => onUpdate({ skills })}
      />
      <div className="flex justify-between pt-2">
        <Button type="button" variant="ghost" onClick={onBack} disabled={submitting}>
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <div className="flex gap-2">
          {selected.length === 0 ? (
            <Button type="button" variant="ghost" onClick={onNext} disabled={submitting}>
              Skip
            </Button>
          ) : null}
          <Button type="button" onClick={onNext} disabled={submitting}>
            {submitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {selected.length > 0 ? 'Next' : 'Continue'}
            {submitting ? null : <ArrowRight className="ml-2 size-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
