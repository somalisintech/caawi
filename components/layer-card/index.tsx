import type { FC, PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

/** LayerCard variant definitions (currently empty, reserved for future additions). */
export const LAYER_CARD_VARIANTS = {
  // LayerCard currently has no variant options but structure is ready for future additions
} as const;

export const LAYER_CARD_DEFAULT_VARIANTS = {} as const;

// Derived types from LAYER_CARD_VARIANTS
export type LayerCardVariantsProps = object;

export function layerCardVariants(_props: LayerCardVariantsProps = {}) {
  return cn(
    // Base styles
    'flex w-full flex-col overflow-hidden rounded-xl border border-border bg-muted text-card-foreground'
  );
}

/**
 * LayerCard component props.
 *
 * @example
 * ```tsx
 * <LayerCard>
 *   <LayerCard.Secondary>Next Steps</LayerCard.Secondary>
 *   <LayerCard.Primary>Get started</LayerCard.Primary>
 * </LayerCard>
 * ```
 */
export type LayerCardProps = PropsWithChildren<
  LayerCardVariantsProps & {
    /** Additional CSS classes merged via `cn()`. */
    className?: string;
  }
>;

/**
 * Elevated card with primary/secondary content layers for dashboard widgets.
 *
 * @example
 * ```tsx
 * <LayerCard>
 *   <LayerCard.Secondary>Getting Started</LayerCard.Secondary>
 *   <LayerCard.Primary>Quick start guide</LayerCard.Primary>
 * </LayerCard>
 * ```
 */
function LayerCardRoot({ children, className }: LayerCardProps) {
  return <div className={cn(layerCardVariants(), className)}>{children}</div>;
}

function LayerCardSecondary({ children, className }: LayerCardProps) {
  return <div className={cn('flex items-center gap-2 px-3 py-2 text-sm text-foreground', className)}>{children}</div>;
}

function LayerCardPrimary({ children, className }: LayerCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 overflow-hidden rounded-lg bg-background p-4 pr-3 text-inherit no-underline ring ring-border h-full',
        className
      )}
    >
      {children}
    </div>
  );
}

type LayerCardComponent = FC<LayerCardProps> & {
  Primary: FC<LayerCardProps>;
  Secondary: FC<LayerCardProps>;
};

const LayerCard = Object.assign(LayerCardRoot, {
  Primary: LayerCardPrimary,
  Secondary: LayerCardSecondary
}) as LayerCardComponent;

export { LayerCard };
export default LayerCard;
