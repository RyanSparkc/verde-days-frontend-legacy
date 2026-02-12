import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Leaf } from 'lucide-react';
import { getArticleById, listRelatedArticles } from '@/services/articleService';
import { ease } from '@/constants/motion';

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const estimateReadTime = (content) => {
  const text = content || '';
  const readingSpeed = 380;
  return Math.max(1, Math.ceil(text.length / readingSpeed));
};

function DetailSkeleton() {
  return (
    <section className="bg-cream pb-24 pt-28 md:pb-32 md:pt-32">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="h-5 w-24 animate-pulse rounded bg-brand-light/20" />
        <div className="mt-6 h-12 w-2/3 animate-pulse rounded bg-brand-light/20" />
        <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-brand-light/15" />
        <div className="mt-8 aspect-[16/9] animate-pulse rounded-3xl bg-brand-light/20" />
        <div className="mt-8 space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-brand-light/15" />
          <div className="h-4 w-full animate-pulse rounded bg-brand-light/15" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-brand-light/15" />
        </div>
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <section className="bg-cream pb-24 pt-28 md:pb-32 md:pt-32">
      <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-light/20 text-brand-dark">
          <Leaf size={26} strokeWidth={1.7} />
        </div>
        <h1 className="mt-6 font-display text-3xl font-light text-text-primary">找不到這篇文章</h1>
        <p className="mt-3 text-sm text-text-secondary">可能已下架或連結有誤，回到列表看看其他內容。</p>
        <Link
          to="/articles"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          回植物日誌
        </Link>
      </div>
    </section>
  );
}

function RelatedCard({ article }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-brand-light/20 bg-white/90 shadow-[0_10px_30px_rgba(92,107,74,0.08)]">
      <Link to={`/article/${article.id}`} className="block">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <p className="text-xs text-text-secondary">{formatDate(article.create_at)}</p>
          <h3 className="mt-2 line-clamp-2 font-display text-xl font-light text-text-primary transition-colors group-hover:text-brand-dark">
            {article.title}
          </h3>
          <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-dark">
            閱讀
            <ArrowRight size={14} strokeWidth={1.8} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    const fetchDetail = async () => {
      setIsLoading(true);
      setError('');

      try {
        const currentArticle = await getArticleById(id);
        if (!isActive) return;

        setArticle(currentArticle);

        if (currentArticle) {
          const related = await listRelatedArticles(currentArticle, 3);
          if (!isActive) return;
          setRelatedArticles(related);
        } else {
          setRelatedArticles([]);
        }
      } catch {
        if (!isActive) return;
        setError('載入文章失敗，請稍後再試。');
      } finally {
        if (isActive) {
          setIsLoading(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    fetchDetail();

    return () => {
      isActive = false;
    };
  }, [id]);

  const paragraphs = useMemo(() => {
    if (!article?.content) return [];
    return article.content
      .split('\n\n')
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }, [article?.content]);

  if (isLoading) return <DetailSkeleton />;
  if (error) {
    return (
      <section className="bg-cream pb-24 pt-28 md:pb-32 md:pt-32">
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-8">
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
  if (!article) return <NotFound />;

  return (
    <section className="relative overflow-hidden bg-cream pb-24 pt-28 md:pb-32 md:pt-32">
      <div className="pointer-events-none absolute -top-20 left-[5%] h-64 w-64 rounded-full bg-brand-light/15 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] bottom-20 h-72 w-72 rounded-full bg-terracotta/12 blur-3xl" />

      <article className="relative mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease }}
        >
          <Link to="/articles" className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-brand-dark">
            <ArrowLeft size={14} strokeWidth={1.8} />
            回植物日誌
          </Link>

          <h1 className="mt-5 font-display text-4xl font-light leading-tight text-text-primary md:text-5xl">
            {article.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-text-secondary md:text-sm">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} strokeWidth={1.7} />
              {formatDate(article.create_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock3 size={14} strokeWidth={1.7} />
              約 {estimateReadTime(article.content)} 分鐘
            </span>
            {article.tag?.map((tag) => (
              <span key={tag} className="rounded-full bg-brand-light/15 px-2.5 py-1 text-brand-dark">
                #{tag}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.06, ease }}
          className="relative mt-8 overflow-hidden rounded-3xl border border-brand-light/25"
        >
          <img
            src={article.image}
            alt={article.title}
            className="h-[260px] w-full object-cover md:h-[420px]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/38 via-black/8 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mt-10 rounded-3xl border border-brand-light/20 bg-white/88 p-6 shadow-[0_12px_34px_rgba(92,107,74,0.08)] md:p-9"
        >
          <div className="prose prose-p:my-0 max-w-none text-text-primary">
            {paragraphs.map((paragraph, index) => (
              <p key={`${article.id}-${index}`} className="mb-5 text-[15px] leading-8 text-text-primary/90 md:text-[17px]">
                {paragraph}
              </p>
            ))}
          </div>
        </motion.div>

        <div className="mt-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease }}
            className="mb-6 flex items-end justify-between gap-4"
          >
            <div>
              <p className="font-display text-xs uppercase tracking-[0.28em] text-brand">More Journal</p>
              <h2 className="mt-2 font-display text-3xl font-light text-text-primary">你可能也會喜歡</h2>
            </div>
            <Link to="/articles" className="hidden text-sm text-text-secondary transition-colors hover:text-brand-dark md:inline-flex">
              查看全部文章 →
            </Link>
          </motion.div>

          {relatedArticles.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {relatedArticles.map((item) => (
                <RelatedCard key={item.id} article={item} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-light/35 bg-white/70 px-6 py-8 text-center">
              <p className="text-sm text-text-secondary">更多文章整理中，晚點再來逛逛。</p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/articles" className="text-sm text-text-secondary transition-colors hover:text-brand-dark">
              查看全部文章 →
            </Link>
          </div>
        </div>
      </article>
    </section>
  );
}
