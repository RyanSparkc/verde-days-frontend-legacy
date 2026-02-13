import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Leaf, ShoppingBag } from 'lucide-react';
import { fetchProductsAllIfNeeded } from '@/slice/catalogReducer';
import { getArticleById, listRelatedArticles } from '@/services/articleService';
import { ease } from '@/constants/motion';
import { categoryLabel } from '@/constants/categories';
import { currency } from '@/utils/format';

const tagCategoryRules = [
  { keyword: '送禮', categories: ['giftset'] },
  { keyword: '禮盒', categories: ['giftset'] },
  { keyword: '空間', categories: ['foliage', 'accessories'] },
  { keyword: '佈置', categories: ['foliage', 'accessories'] },
  { keyword: '新手', categories: ['foliage', 'succulent'] },
  { keyword: '照護', categories: ['foliage', 'succulent', 'airplant'] },
  { keyword: '澆水', categories: ['succulent', 'foliage'] },
  { keyword: '光照', categories: ['foliage', 'airplant'] },
  { keyword: '換盆', categories: ['accessories', 'foliage'] },
];

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

const getRecommendedProducts = (article, products, limit = 3) => {
  if (!article || !Array.isArray(products) || products.length === 0) return [];

  const tags = Array.isArray(article.tag) ? article.tag : [];
  const preferredCategories = [];

  tagCategoryRules.forEach((rule) => {
    const matched = tags.some((tag) => tag.includes(rule.keyword));
    if (!matched) return;

    rule.categories.forEach((category) => {
      if (!preferredCategories.includes(category)) {
        preferredCategories.push(category);
      }
    });
  });

  if (preferredCategories.length === 0) {
    return products.slice(0, limit);
  }

  return products
    .map((product, index) => {
      const categoryRank = preferredCategories.indexOf(product.category);
      const hasTagInTitle = tags.some((tag) => product.title?.includes(tag));

      return {
        product,
        rank: categoryRank === -1 ? 99 : categoryRank,
        hasTagInTitle,
        index,
      };
    })
    .sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      if (a.hasTagInTitle !== b.hasTagInTitle) return a.hasTagInTitle ? -1 : 1;
      return a.index - b.index;
    })
    .slice(0, limit)
    .map((item) => item.product);
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
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-3xl border border-brand-light/25 bg-white/88 px-8 py-12 text-center shadow-[0_8px_26px_rgba(92,107,74,0.06)]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-light/20 text-brand-dark">
            <Leaf size={26} strokeWidth={1.7} />
          </div>
          <h1 className="mt-6 font-display text-3xl font-light text-text-primary">找不到這篇文章</h1>
          <p className="mt-3 text-sm text-text-secondary">可能已下架或連結有誤，回到列表看看其他內容。</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
            >
              <ArrowLeft size={16} strokeWidth={1.8} />
              回植物日誌
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-full border border-brand-light/45 px-6 py-3 text-sm text-brand-dark transition-colors hover:bg-brand-light/10"
            >
              去逛所有植物
              <ArrowRight size={16} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function RelatedCard({ article }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-brand-light/20 bg-white/90 shadow-[0_6px_20px_rgba(92,107,74,0.05)]">
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

function ProductSuggestionCard({ product, index }) {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease }}
      className="group overflow-hidden rounded-2xl border border-brand-light/20 bg-white/90 shadow-[0_6px_20px_rgba(92,107,74,0.05)]"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          <span className="absolute top-3 left-3 rounded-full bg-white/85 px-2.5 py-1 text-xs text-brand-dark backdrop-blur-sm">
            {categoryLabel[product.category] || '植栽'}
          </span>
        </div>

        <div className="p-4">
          <h3 className="line-clamp-2 text-sm font-medium leading-relaxed text-text-primary">{product.title}</h3>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="font-medium text-brand-dark">NT${currency(product.price)}</span>
            {product.origin_price > product.price && (
              <span className="text-xs text-text-secondary line-through">NT${currency(product.origin_price)}</span>
            )}
          </div>
          <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-dark">
            查看商品
            <ArrowRight size={14} strokeWidth={1.8} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export default function ArticleDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { productsAll, isProductsLoading } = useSelector((state) => state.catalog);

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchProductsAllIfNeeded());
  }, [dispatch]);

  useEffect(() => {
    let isActive = true;

    const fetchDetail = async () => {
      setIsLoading(true);
      setError('');
      setArticle(null);
      setRelatedArticles([]);

      try {
        const currentArticle = await getArticleById(id);
        if (!isActive) return;

        setArticle(currentArticle);

        if (currentArticle) {
          try {
            const related = await listRelatedArticles(currentArticle, 3);
            if (!isActive) return;
            setRelatedArticles(Array.isArray(related) ? related : []);
          } catch {
            if (!isActive) return;
            setRelatedArticles([]);
          }
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

  const recommendedProducts = useMemo(() => {
    return getRecommendedProducts(article, productsAll, 3);
  }, [article, productsAll]);

  const isProductListLoading = isProductsLoading && productsAll.length === 0;

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
          <Link
            to="/articles"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-brand-dark"
          >
            <ArrowLeft size={14} strokeWidth={1.8} />
            回植物日誌
          </Link>

          <h1 className="mt-5 font-display text-4xl font-light leading-tight text-text-primary md:text-5xl">{article.title}</h1>

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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.68, delay: 0.06, ease }}
          className="mt-6 overflow-hidden rounded-3xl border border-brand-light/25 bg-white/90 shadow-[0_10px_30px_rgba(92,107,74,0.1)] md:mt-7"
        >
          <div className="relative">
            <img src={article.image} alt={article.title} className="h-[260px] w-full object-cover md:h-[420px]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/38 via-black/8 to-transparent" />
          </div>

          <div className="p-5 md:p-8">
            <div className="prose prose-p:my-0 max-w-none text-text-primary">
              {paragraphs.map((paragraph, index) => (
                <p
                  key={`${article.id}-${index}`}
                  className="mb-4 text-[15px] leading-8 text-text-primary/90 last:mb-0 md:text-[17px]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
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
              <p className="font-display text-xs uppercase tracking-[0.28em] text-brand">Shop Picks</p>
              <h2 className="mt-2 flex items-center gap-2 font-display text-3xl font-light text-text-primary">
                <ShoppingBag size={24} strokeWidth={1.5} className="text-brand-dark" />
                看完文章，帶一盆回家
              </h2>
            </div>
            <Link to="/products" className="hidden text-sm text-text-secondary transition-colors hover:text-brand-dark md:inline-flex">
              查看全部植物 →
            </Link>
          </motion.div>

          {isProductListLoading ? (
            <div className="grid gap-5 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="overflow-hidden rounded-2xl border border-brand-light/20 bg-white p-4">
                  <div className="aspect-[4/3] animate-pulse rounded-xl bg-brand-light/20" />
                  <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-brand-light/15" />
                  <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-brand-light/15" />
                </div>
              ))}
            </div>
          ) : recommendedProducts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {recommendedProducts.map((product, index) => (
                <ProductSuggestionCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-light/35 bg-white/70 px-6 py-8 text-center">
              <p className="text-sm text-text-secondary">推薦商品整理中，先到全部商品挑選看看。</p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link to="/products" className="text-sm text-text-secondary transition-colors hover:text-brand-dark">
              查看全部植物 →
            </Link>
          </div>
        </div>

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
