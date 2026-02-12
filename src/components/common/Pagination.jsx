import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ pagination, onPageChange }) {
  const { total_pages, current_page, has_pre, has_next } = pagination;

  if (total_pages < 2) return null;

  const pages = Array.from({ length: total_pages }, (_, i) => i + 1);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="flex items-center justify-center gap-1.5"
      aria-label="分頁導覽"
    >
      {/* 上一頁 */}
      <button
        onClick={() => onPageChange(current_page - 1)}
        disabled={!has_pre}
        className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-all duration-300 hover:bg-white hover:text-brand-dark disabled:pointer-events-none disabled:opacity-30"
        aria-label="上一頁"
      >
        <ChevronLeft size={16} strokeWidth={1.5} />
      </button>

      {/* 頁碼 */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`relative flex h-9 w-9 items-center justify-center rounded-full text-sm transition-all duration-300 ${
            page === current_page
              ? 'bg-brand font-medium text-white'
              : 'text-text-secondary hover:bg-white hover:text-brand-dark'
          }`}
          aria-label={`第 ${page} 頁`}
          aria-current={page === current_page ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      {/* 下一頁 */}
      <button
        onClick={() => onPageChange(current_page + 1)}
        disabled={!has_next}
        className="flex h-9 w-9 items-center justify-center rounded-full text-text-secondary transition-all duration-300 hover:bg-white hover:text-brand-dark disabled:pointer-events-none disabled:opacity-30"
        aria-label="下一頁"
      >
        <ChevronRight size={16} strokeWidth={1.5} />
      </button>
    </motion.nav>
  );
}
