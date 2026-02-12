import { useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';
import ProductCard from '@/components/common/ProductCard';
import { fetchProductsAllIfNeeded } from '@/slice/catalogReducer';
import { ease } from '@/constants/motion';

export default function FeaturedProducts() {
  const dispatch = useDispatch();
  const { productsAll } = useSelector((state) => state.catalog);

  useEffect(() => {
    dispatch(fetchProductsAllIfNeeded());
  }, [dispatch]);

  const products = useMemo(() => productsAll.slice(0, 4), [productsAll]);

  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
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
