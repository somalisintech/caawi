import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

function getPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];

  if (current > 3) {
    pages.push('...');
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push('...');
  }

  pages.push(total);
  return pages;
}

export function Pagination({ currentPage, totalPages, buildHref }: Props) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 py-4">
      {currentPage > 1 ? (
        <Button variant="outline" size="icon" asChild>
          <Link href={buildHref(currentPage - 1)} aria-label="Previous page">
            <ChevronLeft className="size-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled aria-label="Previous page" aria-disabled="true">
          <ChevronLeft className="size-4" />
        </Button>
      )}

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground" aria-hidden="true">
            ...
          </span>
        ) : page === currentPage ? (
          <Button key={page} variant="default" size="icon" aria-current="page" aria-label={`Page ${page}`}>
            {page}
          </Button>
        ) : (
          <Button key={page} variant="ghost" size="icon" asChild>
            <Link href={buildHref(page)} aria-label={`Page ${page}`}>
              {page}
            </Link>
          </Button>
        )
      )}

      {currentPage < totalPages ? (
        <Button variant="outline" size="icon" asChild>
          <Link href={buildHref(currentPage + 1)} aria-label="Next page">
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      ) : (
        <Button variant="outline" size="icon" disabled aria-label="Next page" aria-disabled="true">
          <ChevronRight className="size-4" />
        </Button>
      )}
    </nav>
  );
}
