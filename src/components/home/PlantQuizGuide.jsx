import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Sprout, Gift, Moon } from 'lucide-react';

const scenarios = [
  {
    icon: Sprout,
    question: '第一次養植物？',
    desc: '從最容易照顧的品種開始，建立你的綠手指信心。',
    cta: '看新手推薦',
    to: '/products?category=foliage',
  },
  {
    icon: Gift,
    question: '想送一份綠意？',
    desc: '精心搭配的植栽禮盒，適合喬遷、生日、感謝的心意。',
    cta: '探索禮盒',
    to: '/products?category=giftset',
  },
  {
    icon: Moon,
    question: '家裡光線不足？',
    desc: '這些耐陰植物在低光環境也能生氣勃勃。',
    cta: '看耐陰植物',
    to: '/products?category=foliage',
  },
];

export default function PlantQuizGuide() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 text-center"
        >
          <p className="font-display text-xs uppercase tracking-[0.3em] text-brand">
            Find Your Plant
          </p>
          <h2 className="mt-2 font-display text-3xl font-light text-text-primary md:text-4xl">
            不知道從哪開始？
          </h2>
          <p className="mt-3 text-sm text-text-secondary">
            告訴我們你的需求，讓我們幫你找到最適合的植物夥伴
          </p>
        </motion.div>

        {/* 情境卡片 */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-8">
          {scenarios.map((item, i) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                to={item.to}
                className="group flex h-full flex-col items-center rounded-2xl border border-brand-light/20 bg-cream/50 px-8 py-10 text-center transition-all duration-500 hover:border-brand-light/40 hover:bg-cream"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light/15 transition-colors duration-500 group-hover:bg-brand-light/25">
                  <item.icon
                    size={24}
                    className="text-brand transition-transform duration-500 group-hover:scale-110"
                    strokeWidth={1.5}
                  />
                </div>

                <h3 className="mt-6 font-display text-xl font-light text-text-primary">
                  {item.question}
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                  {item.desc}
                </p>

                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium tracking-wide text-brand transition-all duration-300 group-hover:gap-2">
                  {item.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                    →
                  </span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
