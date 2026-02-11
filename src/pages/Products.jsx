import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import ProductCard from '@/components/common/ProductCard';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const categories = [
  { key: '', label: '全部', en: 'All' },
  { key: 'foliage', label: '觀葉植物', en: 'Foliage' },
  { key: 'succulent', label: '多肉植物', en: 'Succulent' },
  { key: 'airplant', label: '空氣鳳梨', en: 'Air Plant' },
  { key: 'giftset', label: '植栽禮盒', en: 'Gift Set' },
  { key: 'accessories', label: '盆器配件', en: 'Accessories' },
];

// 分類排序權重：觀葉 → 多肉 → 空鳳 → 禮盒 → 配件
const categoryOrder = {
  foliage: 0,
  succulent: 1,
  airplant: 2,
  giftset: 3,
  accessories: 4,
};

const ease = [0.22, 1, 0.36, 1];

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-xl bg-brand-light/20" />
      <div className="mt-4 px-1">
        <div className="h-4 w-3/4 rounded bg-brand-light/20" />
        <div className="mt-2 h-3.5 w-1/2 rounded bg-brand-light/15" />
      </div>
    </div>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentCategory = searchParams.get('category') || '';
  const activeCat = categories.find((c) => c.key === currentCategory) || categories[0];

  // 一次拉全部商品
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${API_BASE}/api/${API_PATH}/products/all`,
        );
        if (data.success) {
          const list = Array.isArray(data.products)
            ? data.products
            : Object.values(data.products);

          // 按分類權重排序
          const sorted = list
            .filter((p) => p.is_enabled)
            .sort((a, b) => (categoryOrder[a.category] ?? 99) - (categoryOrder[b.category] ?? 99));

          setAllProducts(sorted);
        }
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // 前端篩選分類
  const filteredProducts = useMemo(
    () =>
      currentCategory
        ? allProducts.filter((p) => p.category === currentCategory)
        : allProducts,
    [allProducts, currentCategory],
  );

  const handleCategoryChange = (key) => {
    const next = new URLSearchParams();
    if (key) next.set('category', key);
    setSearchParams(next);
  };

  return (
    <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* ===== Page Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-10"
        >
          <p className="font-display text-xs uppercase tracking-[0.3em] text-brand">
            {activeCat.en}
          </p>
          <h1 className="mt-2 font-display text-3xl font-light text-text-primary md:text-4xl">
            {activeCat.key ? activeCat.label : '所有植物'}
          </h1>
          <p className="mt-3 text-sm text-text-secondary">
            {isLoading
              ? '載入中...'
              : `共 ${filteredProducts.length} 款植物與好物`}
          </p>
        </motion.div>

        {/* ===== 分類 Tabs ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mb-10 flex flex-wrap gap-2"
        >
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleCategoryChange(cat.key)}
              className={`cursor-pointer rounded-full px-5 py-2 text-sm tracking-wide transition-all duration-300 ${
                currentCategory === cat.key
                  ? 'bg-brand font-medium text-white shadow-sm'
                  : 'bg-white text-text-secondary hover:text-brand-dark hover:shadow-sm'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* ===== 商品 Grid ===== */}
        <div className="min-h-[480px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </motion.div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                key={currentCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease }}
                className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
              >
                {filteredProducts.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <p className="font-display text-lg text-text-secondary">
                  此分類目前沒有商品
                </p>
                <button
                  onClick={() => handleCategoryChange('')}
                  className="mt-4 text-sm text-brand transition-colors hover:text-brand-dark"
                >
                  查看所有植物 →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
