import { useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { fetchArticlesIfNeeded } from '@/slice/catalogReducer';

function ArticleCard({ article, index }) {
  const date = article.create_at
    ? new Date(article.create_at * 1000).toLocaleDateString('zh-TW')
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link to={`/article/${article.id}`} className="group block">
        {/* 封面圖 */}
        <div className="overflow-hidden rounded-xl bg-white">
          <div className="aspect-[4/3]">
            {article.image ? (
              <img
                src={article.image}
                alt={article.title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-light/20">
                <span className="font-display text-2xl text-brand-light">
                  🌿
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 文字 */}
        <div className="mt-4 px-1">
          <div className="flex items-center gap-2">
            {article.tag?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[11px] tracking-wide text-brand"
              >
                #{tag}
              </span>
            ))}
            {date && (
              <span className="text-[11px] text-text-secondary">{date}</span>
            )}
          </div>
          <h3 className="mt-2 font-body text-base font-medium leading-snug text-text-primary transition-colors group-hover:text-brand-dark">
            {article.title}
          </h3>
          {article.description && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-secondary">
              {article.description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

export default function ArticlesPreview() {
  const dispatch = useDispatch();
  const { articlesList, isArticlesLoading } = useSelector((state) => state.catalog);

  useEffect(() => {
    dispatch(fetchArticlesIfNeeded());
  }, [dispatch]);

  const articles = useMemo(() => articlesList.slice(0, 3), [articlesList]);

  // 沒有文章時不顯示此區塊
  if (isArticlesLoading && articles.length === 0) return null;
  if (articles.length === 0) return null;

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-brand">
              Journal
            </p>
            <h2 className="mt-2 font-display text-3xl font-light text-text-primary md:text-4xl">
              植物日誌
            </h2>
          </div>
          <Link
            to="/articles"
            className="hidden text-sm text-text-secondary transition-colors hover:text-brand-dark md:block"
          >
            全部文章 →
          </Link>
        </motion.div>

        {/* 文章網格 */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {articles.map((article, i) => (
            <ArticleCard key={article.id} article={article} index={i} />
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/articles"
            className="text-sm text-text-secondary transition-colors hover:text-brand-dark"
          >
            全部文章 →
          </Link>
        </div>
      </div>
    </section>
  );
}
