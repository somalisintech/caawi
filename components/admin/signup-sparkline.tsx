import type { DailyCount } from '@/lib/queries/admin-analytics';

type Props = {
  data: DailyCount[];
};

const WIDTH = 600;
const HEIGHT = 80;
const PADDING = 4;

export function SignupSparkline({ data }: Props) {
  const first = data[0];
  const last = data[data.length - 1];

  if (!first || !last) {
    return <p className="text-sm text-muted-foreground">No data yet.</p>;
  }

  const max = Math.max(1, ...data.map((d) => d.count));
  const innerWidth = WIDTH - PADDING * 2;
  const innerHeight = HEIGHT - PADDING * 2;
  const stepX = data.length > 1 ? innerWidth / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = PADDING + i * stepX;
    const y = PADDING + innerHeight - (d.count / max) * innerHeight;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const lastPoint = points[points.length - 1];
  const areaPath = lastPoint ? `${linePath} L${lastPoint.x},${HEIGHT - PADDING} L${PADDING},${HEIGHT - PADDING} Z` : '';

  return (
    <div className="-m-1 overflow-hidden">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="h-20 w-full"
        role="img"
        aria-label="Daily signups over the last 30 days"
      >
        <path d={areaPath} fill="currentColor" className="text-foreground/10" />
        <path d={linePath} fill="none" stroke="currentColor" strokeWidth={1.5} className="text-foreground" />
      </svg>
      <div className="mt-1 flex items-center justify-between text-[10px] tabular-nums text-muted-foreground">
        <span>{first.date}</span>
        <span>{last.date}</span>
      </div>
    </div>
  );
}
