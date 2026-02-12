import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminPagination({ pagination, onChangePage }) {
  if (!pagination || pagination.total_pages <= 1) return null;

  const pages = Array.from({ length: pagination.total_pages }, (_, idx) => idx + 1);

  return (
    <div className="mt-5 flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={!pagination.has_pre}
        onClick={() => onChangePage(pagination.current_page - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-light/30 text-text-secondary transition-colors hover:bg-brand-light/10 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ChevronLeft size={15} strokeWidth={1.8} />
      </button>

      {pages.map((page) => {
        const active = page === pagination.current_page;
        return (
          <button
            key={page}
            type="button"
            onClick={() => onChangePage(page)}
            className={`h-9 min-w-9 rounded-full border px-3 text-sm transition-colors ${
              active
                ? 'border-brand-light/45 bg-brand-light/18 text-brand-dark'
                : 'border-brand-light/25 text-text-secondary hover:bg-brand-light/10'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        disabled={!pagination.has_next}
        onClick={() => onChangePage(pagination.current_page + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-light/30 text-text-secondary transition-colors hover:bg-brand-light/10 disabled:cursor-not-allowed disabled:opacity-35"
      >
        <ChevronRight size={15} strokeWidth={1.8} />
      </button>
    </div>
  );
}
