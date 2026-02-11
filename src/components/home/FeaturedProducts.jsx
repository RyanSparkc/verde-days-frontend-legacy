import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductCard({ product, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
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
            {product.category}
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

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE}/api/${API_PATH}/products/all`,
        );
        if (data.success) {
          // 取前 4 筆作為精選
          const list = Array.isArray(data.products)
            ? data.products
            : Object.values(data.products);
          setProducts(list.filter((p) => p.is_enabled).slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to fetch featured products', err);
      }
    })();
  }, []);

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
              Featured
            </p>
            <h2 className="mt-2 font-display text-3xl font-light text-text-primary md:text-4xl">
              精選植物
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden text-sm text-text-secondary transition-colors hover:text-brand-dark md:block"
          >
            查看全部 →
          </Link>
        </motion.div>

        {/* 商品網格 */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Mobile 查看全部 */}
        <div className="mt-8 text-center md:hidden">
          <Link
            to="/products"
            className="text-sm text-text-secondary transition-colors hover:text-brand-dark"
          >
            查看全部 →
          </Link>
        </div>
      </div>
    </section>
  );
}
