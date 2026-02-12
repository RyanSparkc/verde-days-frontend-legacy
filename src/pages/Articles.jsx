import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, CalendarDays, Leaf } from 'lucide-react';
import { listArticles } from '@/services/articleService';
import { ease } from '@/constants/motion';

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

function ArticlesSkeleton() {
  return (
    <section className="relative overflow-hidden bg-cream pb-24 pt-28 md:pb-32 md:pt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="h-6 w-24 animate-pulse rounded-full bg-brand-light/20" />
        <div className="mt-4 h-12 w-2/3 animate-pulse rounded bg-brand-light/20 md:w-1/2" />
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl border border-brand-light/20 bg-white p-4">
              <div className="aspect-[16/10] animate-pulse rounded-xl bg-brand-light/20" />
              <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-brand-light/15" />
              <div className="mt-2 h-6 w-4/5 animate-pulse rounded bg-brand-light/20" />
              <div className="mt-2 h-4 w-full animate-pulse rounded bg-brand-light/15" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="bg-cream pb-24 pt-28 md:pb-32 md:pt-32">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-light/20 text-brand-dark">
          <Leaf size={26} strokeWidth={1.7} />
        </div>
        <h1 className="mt-6 font-display text-3xl font-light text-text-primary">植物日誌暫時沒有內容</h1>
        <p className="mt-3 text-sm text-text-secondary">我們正在整理新的文章，稍後回來看看。</p>
        <Link
          to="/products"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          先逛逛植物
          <ArrowRight size={16} strokeWidth={1.8} />
        </Link>
      </div>
    </section>
  );
}

function ArticleCard({ article, index }) {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease }}
      className="group overflow-hidden rounded-2xl border border-brand-light/25 bg-white/90 shadow-[0_6px_20px_rgba(92,107,74,0.05)]"
    >
      <Link to={`/article/${article.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
          <div className="absolute right-3 bottom-3 rounded-full bg-white/90 px-3 py-1 text-xs text-brand-dark backdrop-blur-sm">
            {article.tag?.[0] ? `#${article.tag[0]}` : '植物日誌'}
          </div>
        </div>

        <div className="px-5 py-5">
          <p className="flex items-center gap-1.5 text-xs tracking-[0.08em] text-text-secondary">
            <CalendarDays size={13} strokeWidth={1.7} />
            {formatDate(article.create_at)}
          </p>
          <h2 className="mt-3 font-display text-2xl font-light leading-tight text-text-primary transition-colors group-hover:text-brand-dark">
            {article.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-secondary">
            {article.description}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm text-brand-dark">
            閱讀文章
            <ArrowRight size={15} strokeWidth={1.8} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const fetchArticles = async () => {
      setIsLoading(true);
      setError('');

      try {
        const list = await listArticles();
        if (!isActive) return;
        setArticles(list);
      } catch {
        if (!isActive) return;
        setError('載入文章失敗，請稍後再試。');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    fetchArticles();

    return () => {
      isActive = false;
    };
  }, []);

  const [featuredArticle, ...otherArticles] = useMemo(() => articles, [articles]);

  if (isLoading) return <ArticlesSkeleton />;
  if (error) {
    return (
      <section className="bg-cream pb-24 pt-28 md:pb-32 md:pt-32">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="font-display text-2xl text-text-primary">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 cursor-pointer rounded-full border border-brand-light/45 px-5 py-2 text-sm text-brand-dark transition-colors hover:bg-brand-light/10"
          >
            重新整理
          </button>
        </div>
      </section>
    );
  }
  if (articles.length === 0) return <EmptyState />;

  return (
    <section className="relative overflow-hidden bg-cream pb-24 pt-28 md:pb-32 md:pt-32">
      <div className="pointer-events-none absolute -top-24 left-[8%] h-64 w-64 rounded-full bg-brand-light/18 blur-3xl" />
      <div className="pointer-events-none absolute right-[6%] bottom-6 h-72 w-72 rounded-full bg-terracotta/12 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
          className="mb-10 md:mb-12"
        >
          <p className="font-display text-xs uppercase tracking-[0.34em] text-brand">Journal</p>
          <h1 className="mt-3 font-display text-4xl font-light leading-tight text-text-primary md:text-5xl">
            植物日誌
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
            把照護技巧、空間靈感與選品觀點整理成可實際使用的內容，讓你在日常中慢慢養出自己的綠色節奏。
          </p>
        </motion.div>

        {featuredArticle ? (
          <motion.article
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease }}
            className="group relative mb-10 overflow-hidden rounded-3xl border border-brand-light/25 shadow-[0_10px_30px_rgba(92,107,74,0.1)] md:mb-12"
          >
            <Link to={`/article/${featuredArticle.id}`} className="block">
              <div className="grid min-h-[320px] md:grid-cols-[1.15fr_0.85fr]">
                <div className="relative order-2 p-7 md:order-1 md:p-10">
                  <p className="inline-flex items-center rounded-full bg-brand-light/18 px-3 py-1 text-xs tracking-[0.12em] text-brand-dark">
                    FEATURED
                  </p>
                  <h2 className="mt-4 font-display text-3xl font-light leading-tight text-text-primary md:text-4xl">
                    {featuredArticle.title}
                  </h2>
                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-text-secondary md:text-base">
                    {featuredArticle.description}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-text-secondary md:text-sm">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={14} strokeWidth={1.7} />
                      {formatDate(featuredArticle.create_at)}
                    </span>
                    {featuredArticle.tag?.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full bg-brand-light/14 px-2.5 py-1 text-brand-dark">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="mt-7 inline-flex items-center gap-1.5 text-sm text-brand-dark">
                    繼續閱讀
                    <ArrowRight size={15} strokeWidth={1.8} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </div>
                <div className="relative order-1 md:order-2">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="h-full w-full object-cover transition-transform duration-900 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/34 via-black/5 to-transparent" />
                </div>
              </div>
            </Link>
          </motion.article>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {otherArticles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
