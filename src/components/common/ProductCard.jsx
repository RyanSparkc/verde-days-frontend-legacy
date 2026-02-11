import { Link } from 'react-router';
import { motion } from 'motion/react';

const categoryLabel = {
  foliage: '觀葉植物',
  succulent: '多肉植物',
  airplant: '空氣鳳梨',
  giftset: '植栽禮盒',
  accessories: '盆器配件',
};

export default function ProductCard({ product, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        {/* 圖片 */}
        <div className="relative overflow-hidden rounded-xl bg-white">
          <div className="aspect-square">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </div>
          {/* 分類 tag */}
          <span className="absolute top-3 left-3 rounded-full bg-brand-light/80 px-3 py-1 text-[11px] tracking-wide text-brand-dark backdrop-blur-sm">
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
