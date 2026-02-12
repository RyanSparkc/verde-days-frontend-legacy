import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal } from 'lucide-react';
import ProductCard from '@/components/common/ProductCard';
import { fetchProductsAllIfNeeded } from '@/slice/catalogReducer';
import { ease } from '@/constants/motion';

const categories = [
  { key: '', label: '全部', en: 'All' },
  { key: 'foliage', label: '觀葉植物', en: 'Foliage' },
  { key: 'succulent', label: '多肉植物', en: 'Succulent' },
  { key: 'airplant', label: '空氣鳳梨', en: 'Air Plant' },
  { key: 'giftset', label: '植栽禮盒', en: 'Gift Set' },
  { key: 'accessories', label: '盆器配件', en: 'Accessories' },
];

const sortOptions = [
  { key: 'newest', label: '最新上架' },
  { key: 'price-asc', label: '價格：低到高' },
  { key: 'price-desc', label: '價格：高到低' },
];

const getProductTimestamp = (product) => {
  const timestamp = Number(product?.create_at || product?.created_at || 0);
  return Number.isFinite(timestamp) ? timestamp : 0;
};

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
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { productsAll, isProductsLoading } = useSelector((state) => state.catalog);

  const currentCategory = searchParams.get('category') || '';
  const currentKeyword = searchParams.get('q') || '';
  const sortFromQuery = searchParams.get('sort') || 'newest';
  const currentSort = sortOptions.some((option) => option.key === sortFromQuery)
    ? sortFromQuery
    : 'newest';

  const activeCat = categories.find((category) => category.key === currentCategory) || categories[0];
  const activeSort = sortOptions.find((option) => option.key === currentSort) || sortOptions[0];
  const [searchInput, setSearchInput] = useState(currentKeyword);

  useEffect(() => {
    dispatch(fetchProductsAllIfNeeded());
  }, [dispatch]);

  useEffect(() => {
    setSearchInput(currentKeyword);
  }, [currentKeyword]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const normalizedInput = searchInput.replace(/\s+/g, ' ').trim();
      const normalizedQuery = currentKeyword.replace(/\s+/g, ' ').trim();
      if (normalizedInput === normalizedQuery) return;

      const next = new URLSearchParams(searchParams);
      if (normalizedInput) next.set('q', normalizedInput);
      else next.delete('q');
      setSearchParams(next);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, currentKeyword, searchParams, setSearchParams]);

  const isLoading = isProductsLoading && productsAll.length === 0;

  const categorizedProducts = useMemo(() => {
    if (!currentCategory) return productsAll;
    return productsAll.filter((product) => product.category === currentCategory);
  }, [productsAll, currentCategory]);

  const searchedProducts = useMemo(() => {
    const normalizedKeyword = currentKeyword.trim().toLowerCase();
    if (!normalizedKeyword) return categorizedProducts;

    return categorizedProducts.filter((product) => {
      return product.title?.toLowerCase().includes(normalizedKeyword);
    });
  }, [categorizedProducts, currentKeyword]);

  const filteredProducts = useMemo(() => {
    const list = [...searchedProducts];

    switch (currentSort) {
      case 'price-asc':
        return list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
      case 'price-desc':
        return list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
      case 'newest':
      default: {
        const hasTimestamp = list.some((product) => getProductTimestamp(product) > 0);
        if (!hasTimestamp) return list;

        return list.sort((a, b) => getProductTimestamp(b) - getProductTimestamp(a));
      }
    }
  }, [searchedProducts, currentSort]);

  const updateFilters = (patch) => {
    const next = new URLSearchParams(searchParams);

    if ('category' in patch) {
      if (patch.category) next.set('category', patch.category);
      else next.delete('category');
    }

    if ('q' in patch) {
      const keyword = String(patch.q || '').replace(/\s+/g, ' ').trim();
      if (keyword) next.set('q', keyword);
      else next.delete('q');
      setSearchInput(keyword);
    }

    if ('sort' in patch) {
      const sort = patch.sort || 'newest';
      if (sort === 'newest') next.delete('sort');
      else next.set('sort', sort);
    }

    setSearchParams(next);
  };

  const handleCategoryChange = (categoryKey) => {
    updateFilters({ category: categoryKey });
  };

  const hasActiveKeyword = currentKeyword.trim().length > 0;

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
              : hasActiveKeyword
                ? `「${currentKeyword.trim()}」找到 ${filteredProducts.length} 款商品`
                : `共 ${filteredProducts.length} 款植物與好物 · ${activeSort.label}`}
          </p>
        </motion.div>

        {/* ===== 分類 Tabs ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease }}
          className="mb-6 flex flex-wrap gap-2"
        >
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => handleCategoryChange(category.key)}
              className={`cursor-pointer rounded-full px-5 py-2 text-sm tracking-wide transition-all duration-300 ${
                currentCategory === category.key
                  ? 'bg-brand font-medium text-white'
                  : 'bg-white text-text-secondary hover:text-brand-dark'
              }`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>

        {/* ===== 搜尋與排序 ===== */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18, ease }}
          className="mb-10 grid gap-3 rounded-2xl border border-brand-light/20 bg-white/80 p-3 md:grid-cols-[1fr_240px]"
        >
          <label
            htmlFor="product-search"
            className="flex h-11 items-center gap-2.5 rounded-xl border border-brand-light/25 bg-white px-3"
          >
            <Search size={16} strokeWidth={1.7} className="text-text-secondary" />
            <input
              id="product-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="搜尋商品名稱"
              className="w-full border-none bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/45"
            />
          </label>

          <label className="flex h-11 items-center gap-2.5 rounded-xl border border-brand-light/25 bg-white px-3">
            <SlidersHorizontal size={16} strokeWidth={1.7} className="text-text-secondary" />
            <select
              value={currentSort}
              onChange={(event) => updateFilters({ sort: event.target.value })}
              className="w-full cursor-pointer bg-transparent text-sm text-text-primary outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
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
                {Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </motion.div>
            ) : filteredProducts.length > 0 ? (
              <motion.div
                key={`${currentCategory}-${currentSort}-${currentKeyword}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease }}
                className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
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
                <p className="font-display text-lg text-text-secondary">找不到符合條件的商品</p>
                <button
                  onClick={() => updateFilters({ q: '', category: '', sort: 'newest' })}
                  className="mt-4 cursor-pointer text-sm text-brand transition-colors hover:text-brand-dark"
                >
                  清除條件並查看全部商品 →
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
