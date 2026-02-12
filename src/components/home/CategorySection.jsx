import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ease } from '@/constants/motion';

const base = import.meta.env.BASE_URL;

const categories = [
  {
    key: 'foliage',
    label: '觀葉植物',
    en: 'Foliage',
    image: `${base}images/categories/foliage.jpeg`,
  },
  {
    key: 'succulent',
    label: '多肉植物',
    en: 'Succulent',
    image: `${base}images/categories/succulent.jpeg`,
  },
  {
    key: 'airplant',
    label: '空氣鳳梨',
    en: 'Air Plant',
    image: `${base}images/categories/airplant.jpeg`,
  },
  {
    key: 'giftset',
    label: '植栽禮盒',
    en: 'Gift Set',
    image: `${base}images/categories/giftset.jpeg`,
  },
  {
    key: 'accessories',
    label: '盆器配件',
    en: 'Accessories',
    image: `${base}images/categories/accessories.jpeg`,
  },
];

function CategoryCard({ category, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.08,
        ease,
      }}
    >
      <Link
        to={`/products?category=${category.key}`}
        className="group relative block overflow-hidden rounded-2xl"
      >
        {/* 圖片 */}
        <div className="aspect-[3/4] md:aspect-[3/5]">
          <img
            src={category.image}
            alt={category.label}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* 漸層遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent transition-colors duration-500 group-hover:from-black/60" />

        {/* 文字 */}
        <div className="absolute bottom-0 left-0 p-5 md:p-6">
          <p className="text-[10px] font-light uppercase tracking-[0.25em] text-white/50">
            {category.en}
          </p>
          <h3 className="mt-1 font-display text-xl font-light text-white md:text-2xl">
            {category.label}
          </h3>
        </div>
      </Link>
    </motion.div>
  );
}

export default function CategorySection() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease }}
          className="mb-12 text-center"
        >
          <p className="font-display text-xs uppercase tracking-[0.3em] text-brand">
            Categories
          </p>
          <h2 className="mt-2 font-display text-3xl font-light text-text-primary md:text-4xl">
            探索分類
          </h2>
        </motion.div>

        {/* 分類網格：桌面 5 欄等寬，手機 2 欄 + 末項全寬 */}
        <div className="grid grid-cols-2 gap-3 [&>*:last-child]:col-span-2 md:grid-cols-5 md:gap-4 md:[&>*:last-child]:col-span-1">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.key} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
