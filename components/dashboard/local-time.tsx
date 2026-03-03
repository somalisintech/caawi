'use client';

type Props = {
  date: Date;
  format: 'date' | 'time' | 'datetime';
  className?: string;
};

const dateOptions: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'short',
  day: 'numeric'
};

const timeOptions: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: '2-digit'
};

const datetimeOptions: Intl.DateTimeFormatOptions = {
  ...dateOptions,
  ...timeOptions
};

const formatMap = {
  date: dateOptions,
  time: timeOptions,
  datetime: datetimeOptions
} as const;

export function LocalTime({ date, format, className }: Props) {
  const d = new Date(date);
  const formatted =
    format === 'time'
      ? d.toLocaleTimeString('en-US', formatMap[format])
      : d.toLocaleDateString('en-US', formatMap[format]);

  return (
    <time className={className} dateTime={d.toISOString()}>
      {formatted}
    </time>
  );
}
