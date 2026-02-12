import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { addToCart } from '@/slice/cartReducer';
import ProductCard from '@/components/common/ProductCard';
import { categoryLabel } from '@/constants/categories';
import { ease } from '@/constants/motion';
import { toProductList } from '@/utils/api';
import {
  ChevronLeft,
  Sun,
  Droplets,
  Leaf,
  PawPrint,
  Ruler,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Loader2,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const careLevelMap = {
  easy: { label: '容易', color: 'text-green-600' },
  medium: { label: '普通', color: 'text-yellow-600' },
  hard: { label: '進階', color: 'text-orange-600' },
};

const lightMap = {
  low: '低光照',
  medium: '半日照',
  bright: '明亮光',
};

// ─── 圖片畫廊 ───
function ImageGallery({ mainImage, images }) {
  const allImages = useMemo(() => {
    const imgs = [mainImage, ...(images || [])].filter(Boolean);
    // 去重
    return [...new Set(imgs)];
  }, [mainImage, images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedSet, setLoadedSet] = useState(new Set());

  const currentSrc = allImages[activeIndex];
  const isCurrentLoaded = loadedSet.has(currentSrc);

  const handleLoad = (src) => {
    setLoadedSet((prev) => new Set(prev).add(src));
  };

  return (
    <div>
      {/* 主圖 */}
      <div className="relative overflow-hidden rounded-2xl bg-white">
        {/* 骨架屏 — 圖片尚未載入時顯示 */}
        <div
          className={`absolute inset-0 z-10 animate-pulse bg-brand-light/15 transition-opacity duration-300 ${
            isCurrentLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="aspect-square"
          >
            <img
              src={currentSrc}
              alt="商品圖片"
              className="h-full w-full object-cover"
              onLoad={() => handleLoad(currentSrc)}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 縮圖列 */}
      {allImages.length > 1 && (
        <div className="mt-3 flex gap-2">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-16 w-16 cursor-pointer flex-shrink-0 overflow-hidden rounded-lg transition-all duration-300 ${
                i === activeIndex
                  ? 'ring-2 ring-brand ring-offset-2'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`縮圖 ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 數量選擇器 ───
function QuantitySelector({ qty, setQty }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-text-secondary">數量</span>
      <div className="flex items-center overflow-hidden rounded-full border border-brand-light/40">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          disabled={qty <= 1}
          className="flex h-10 w-10 cursor-pointer items-center justify-center text-text-secondary transition-colors hover:bg-brand-light/10 hover:text-brand-dark disabled:pointer-events-none disabled:opacity-30"
          aria-label="減少數量"
        >
          <Minus size={14} strokeWidth={1.5} />
        </button>
        <span className="flex h-10 w-12 items-center justify-center text-sm font-medium text-text-primary">
          {qty}
        </span>
        <button
          onClick={() => setQty((q) => q + 1)}
          className="flex h-10 w-10 cursor-pointer items-center justify-center text-text-secondary transition-colors hover:bg-brand-light/10 hover:text-brand-dark"
          aria-label="增加數量"
        >
          <Plus size={14} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}

// ─── 照護資訊 ───
function CareInfoGrid({ product }) {
  const items = [
    product.light && {
      icon: Sun,
      label: '光照需求',
      value: lightMap[product.light] || product.light,
    },
    product.water && {
      icon: Droplets,
      label: '澆水頻率',
      value: product.water,
    },
    product.careLevel && {
      icon: Leaf,
      label: '照顧難度',
      value: careLevelMap[product.careLevel]?.label || product.careLevel,
      valueClass: careLevelMap[product.careLevel]?.color,
    },
    product.petFriendly !== undefined && {
      icon: PawPrint,
      label: '寵物安全',
      value: product.petFriendly ? '安全' : '不安全',
      valueClass: product.petFriendly ? 'text-green-600' : 'text-orange-600',
    },
    product.height && {
      icon: Ruler,
      label: '植株高度',
      value: product.height,
    },
    product.origin && {
      icon: MapPin,
      label: '原產地',
      value: product.origin,
    },
  ].filter(Boolean);

  if (items.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease }}
    >
      <h3 className="mb-3 text-xs uppercase tracking-[0.2em] text-text-secondary">
        植物照護
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value, valueClass }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl bg-white px-4 py-3"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-light/20">
              <Icon size={14} strokeWidth={1.5} className="text-brand-dark" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-text-secondary">{label}</p>
              <p
                className={`truncate text-xs font-medium ${valueClass || 'text-text-primary'}`}
              >
                {value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Skeleton ───
function ProductDetailSkeleton() {
  return (
    <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 h-5 w-32 animate-pulse rounded bg-brand-light/20" />
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <div className="aspect-square animate-pulse rounded-2xl bg-brand-light/20" />
          <div className="space-y-4">
            <div className="h-5 w-20 animate-pulse rounded-full bg-brand-light/20" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-brand-light/20" />
            <div className="h-4 w-full animate-pulse rounded bg-brand-light/15" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-brand-light/15" />
            <div className="mt-6 h-7 w-1/3 animate-pulse rounded bg-brand-light/20" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 主頁面 ───
export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // 取得單一商品
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      setQty(1);
      try {
        const { data } = await axios.get(
          `${API_BASE}/api/${API_PATH}/product/${id}`,
        );
        if (data.success) {
          setProduct(data.product);
        }
      } catch (err) {
        console.error('Failed to fetch product', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // 取得相關商品（同分類）
  useEffect(() => {
    if (!product?.category) return;

    (async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE}/api/${API_PATH}/products/all`,
        );
        if (data.success) {
          const list = toProductList(data.products);
          const related = list
            .filter((p) => p.is_enabled && p.category === product.category && p.id !== id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Failed to fetch related products', err);
      }
    })();
  }, [product?.category, id]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await dispatch(addToCart({ productId: id, qty })).unwrap();
    } catch {
      // error handled by thunk
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) return <ProductDetailSkeleton />;

  if (!product) {
    return (
      <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <p className="font-display text-2xl text-text-secondary">
            找不到這個商品
          </p>
          <Link
            to="/products"
            className="mt-4 inline-block text-sm text-brand transition-colors hover:text-brand-dark"
          >
            ← 返回所有植物
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* ===== 返回連結 ===== */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease }}
        >
          <Link
            to="/products"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-brand-dark"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            所有植物
          </Link>
        </motion.div>

        {/* ===== 主要內容：圖片 + 資訊 ===== */}
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          {/* 左側：圖片畫廊 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <ImageGallery
              mainImage={product.imageUrl}
              images={product.imagesUrl}
            />
          </motion.div>

          {/* 右側：商品資訊 */}
          <div>
            {/* 分類 tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
            >
              <span className="inline-block rounded-full bg-brand-light/30 px-3 py-1 text-[11px] tracking-wide text-brand-dark">
                {categoryLabel[product.category] || product.category}
              </span>
            </motion.div>

            {/* 商品名稱 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease }}
              className="mt-4 font-display text-2xl font-light text-text-primary md:text-3xl"
            >
              {product.title}
            </motion.h1>

            {/* 簡述 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="mt-3 text-sm leading-relaxed text-text-secondary"
            >
              {product.description}
            </motion.p>

            {/* 價格 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease }}
              className="mt-6 flex items-baseline gap-3"
            >
              <span className="font-display text-2xl text-brand-dark">
                NT${product.price.toLocaleString()}
              </span>
              {product.origin_price > product.price && (
                <span className="text-sm text-text-secondary line-through">
                  NT${product.origin_price.toLocaleString()}
                </span>
              )}
              <span className="text-xs text-text-secondary">
                / {product.unit}
              </span>
            </motion.div>

            {/* 分隔線 */}
            <div className="my-6 h-px bg-brand-light/20" />

            {/* 數量 + 加入購物車 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease }}
              className="space-y-4"
            >
              <QuantitySelector qty={qty} setQty={setQty} />

              <button
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-brand-dark hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
              >
                {isAdding ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <ShoppingBag size={16} strokeWidth={1.5} />
                )}
                {isAdding ? '加入中...' : '加入購物車'}
              </button>
            </motion.div>

            {/* 分隔線 */}
            <div className="my-6 h-px bg-brand-light/20" />

            {/* 照護資訊 */}
            <CareInfoGrid product={product} />
          </div>
        </div>

        {/* ===== 詳細描述 ===== */}
        {product.content && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease }}
            className="mt-16 md:mt-24"
          >
            <h2 className="mb-1 font-display text-xs uppercase tracking-[0.3em] text-brand">
              About
            </h2>
            <h3 className="font-display text-xl font-light text-text-primary md:text-2xl">
              商品介紹
            </h3>
            <div className="mt-6 max-w-3xl text-sm leading-loose text-text-secondary">
              {product.content}
            </div>
          </motion.div>
        )}

        {/* ===== 相關推薦 ===== */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease }}
            className="mt-16 md:mt-24"
          >
            <h2 className="mb-1 font-display text-xs uppercase tracking-[0.3em] text-brand">
              Related
            </h2>
            <h3 className="font-display text-xl font-light text-text-primary md:text-2xl">
              你可能也喜歡
            </h3>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
