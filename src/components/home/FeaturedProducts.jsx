import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import axios from 'axios';
import ProductCard from '@/components/common/ProductCard';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

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
