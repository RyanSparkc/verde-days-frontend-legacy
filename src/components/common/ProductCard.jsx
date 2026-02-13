import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { categoryLabel } from '@/constants/categories';

export default function ProductCard({ product, index = 0 }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: (index % 4) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        {/* 圖片 */}
        <div className="relative overflow-hidden rounded-xl bg-white">
          <div className="relative aspect-square">
            {/* 骨架屏：始終存在於 DOM，靠 opacity 淡出 */}
            <div
              className={`absolute inset-0 z-10 animate-pulse bg-brand-light/30 transition-opacity duration-500 ${
                loaded ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
            />
            <img
              src={product.imageUrl}
              alt={product.title}
              className={`h-full w-full object-cover transition-opacity duration-500 ease-out group-hover:scale-105 group-hover:transition-transform group-hover:duration-700 ${
                loaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setLoaded(true)}
            />
          </div>
          {/* 分類 tag */}
          <span className="absolute top-3 left-3 rounded-full bg-brand-light/80 px-3 py-1 text-xs tracking-wide text-text-primary backdrop-blur-sm">
            {categoryLabel[product.category] || product.category}
          </span>
        </div>

        {/* 資訊 */}
        <div className="mt-4 px-1">
          <h3 className="font-body text-sm font-medium text-text-primary transition-colors group-hover:text-brand-dark">
            {product.title}
          </h3>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-sm font-medium text-brand-dark">
              NT${product.price.toLocaleString()}
            </span>
            {product.origin_price > product.price && (
              <span className="text-xs text-text-secondary line-through">
                NT${product.origin_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
