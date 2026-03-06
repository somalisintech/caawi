const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Formats a date as "Mon YYYY" (e.g. "Jan 2025").
 */
export function formatMemberSince(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return `${MONTH_NAMES[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}
