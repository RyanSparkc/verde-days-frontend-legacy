import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useInView } from 'motion/react';
import { Leaf, HandHeart, Sprout, PackageCheck } from 'lucide-react';
import { ease } from '@/constants/motion';

const base = import.meta.env.BASE_URL;

const aboutImages = {
  hero: `${base}images/about/about-hero.jpeg`,
  story: `${base}images/about/brand-story.jpeg`,
  curated: `${base}images/about/curated-selection.jpeg`,
  care: `${base}images/about/packing-and-care.jpeg`,
  cta: `${base}images/about/closing-cta-mood.jpeg`,
};

const values = [
  {
    icon: Leaf,
    title: '精選而非堆量',
    description: '我們維持少量、固定的商品規模，每一款都是經過挑選才上架。',
  },
  {
    icon: Sprout,
    title: '新手也能開始',
    description: '從照護資訊到選購建議，目標是讓第一次養植物的人也能安心入門。',
  },
  {
    icon: HandHeart,
    title: '風格與實用並重',
    description: '不只看起來好看，也要能真正融入日常空間與生活節奏。',
  },
];

const highlights = [
  { value: 26, label: '固定精選品項', suffix: '' },
  { value: 5, label: '主要植物分類', suffix: '' },
  { value: 100, label: '生活導向選品', suffix: '%' },
];

function ValueCard({ icon: Icon, title, description, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease }}
      className="rounded-2xl border border-brand-light/20 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light/25 text-brand-dark">
        <Icon size={18} strokeWidth={1.7} />
      </div>
      <h3 className="mt-4 font-display text-xl font-light text-text-primary">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
    </motion.article>
  );
}

function CountUpNumber({ value, suffix }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-20% 0px' });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1200;
    const startTime = performance.now();
    let frameId;

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

export default function About() {
  return (
    <section className="relative overflow-hidden bg-cream pb-24 pt-24 md:pb-32 md:pt-28">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-light/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-[36%] h-56 w-56 rounded-full bg-terracotta/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease }}
          className="relative overflow-hidden rounded-3xl border border-brand-light/20 bg-white shadow-[0_14px_44px_rgba(92,107,74,0.12)]"
        >
          <motion.img
            src={aboutImages.hero}
            alt="Verde Days 品牌主視覺"
            className="h-[430px] w-full object-cover md:h-[520px]"
            initial={{ scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.8, ease }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-cream/95 via-cream/85 to-transparent" />

          <div className="absolute inset-y-0 left-0 flex w-full max-w-xl items-center p-8 md:p-12">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.3em] text-brand">About Us</p>
              <h1 className="mt-3 font-display text-3xl font-light leading-tight text-text-primary md:text-5xl">
                讓綠意，住進日常
              </h1>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary md:text-base">
                Verde Days 相信，植物不該是少數人的興趣，而是每個人都能開始的生活方式。
              </p>
              <Link
                to="/products"
                className="mt-7 inline-flex rounded-full bg-brand px-7 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
              >
                探索所有植物
              </Link>
            </div>
          </div>

          <div className="absolute right-5 bottom-5 hidden rounded-2xl border border-white/55 bg-white/70 px-4 py-3 text-right backdrop-blur-sm md:block">
            <p className="font-display text-xs uppercase tracking-[0.18em] text-brand-dark/70">Green Living Note</p>
            <p className="mt-1 text-sm text-text-secondary">少而精，剛剛好的日常綠意。</p>
          </div>
        </motion.div>

        <div className="mt-16 grid items-center gap-10 md:mt-20 md:grid-cols-2 md:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease }}
          >
            <p className="font-display text-xs uppercase tracking-[0.3em] text-brand">Our Story</p>
            <h2 className="mt-3 font-display text-3xl font-light text-text-primary md:text-4xl">從日常陽台開始</h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-text-secondary md:text-base">
              <p>
                Verde Days 是一個從日常陽台開始的 side project。 我們不追求大量上架，而是把重心放在少而精的選品：
                每一盆植物都要好看、好照顧，也能自然融入真實生活空間。
              </p>
              <p>
                對我們來說，賣的不只是植物，而是一種慢下來、重新感受生活節奏的方式。
                你看到的每一款商品，都是我們願意放進自己家裡的選擇。
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.08, ease }}
            className="overflow-hidden rounded-2xl border border-brand-light/20 bg-white"
          >
            <img
              src={aboutImages.story}
              alt="Verde Days 品牌故事"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, ease }}
          className="mt-10 grid gap-3 rounded-2xl border border-brand-light/20 bg-white/80 p-4 shadow-sm md:mt-12 md:grid-cols-3 md:p-5"
        >
          {highlights.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.9 }}
              transition={{ duration: 0.45, ease }}
              className="rounded-xl border border-brand-light/15 bg-cream/55 px-4 py-4 text-center"
            >
              <p className="font-display text-3xl leading-none text-brand-dark">
                <CountUpNumber value={item.value} suffix={item.suffix} />
              </p>
              <p className="mt-2 text-xs tracking-[0.08em] text-text-secondary">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-16 md:mt-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease }}
            className="mb-7 md:mb-9"
          >
            <p className="font-display text-xs uppercase tracking-[0.3em] text-brand">What We Care</p>
            <h2 className="mt-3 font-display text-3xl font-light text-text-primary md:text-4xl">我們在意的三件事</h2>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {values.map((value, index) => (
              <ValueCard key={value.title} {...value} index={index} />
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:mt-20 md:grid-cols-2 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease }}
            className="overflow-hidden rounded-2xl border border-brand-light/20 bg-white"
          >
            <img
              src={aboutImages.curated}
              alt="Verde Days 精選選品"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.06, ease }}
            className="overflow-hidden rounded-2xl border border-brand-light/20 bg-white"
          >
            <img
              src={aboutImages.care}
              alt="Verde Days 包裝與照護"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="relative mt-16 overflow-hidden rounded-3xl md:mt-20"
        >
          <img
            src={aboutImages.cta}
            alt="Verde Days 綠色生活"
            className="h-[280px] w-full object-cover md:h-[320px]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/60 via-brand-dark/45 to-brand-dark/55" />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <div>
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                <PackageCheck size={20} strokeWidth={1.6} />
              </div>
              <h3 className="mt-4 font-display text-2xl font-light text-white md:text-3xl">準備好開始你的綠色日常了嗎？</h3>
              <p className="mt-2 text-sm text-white/85">從一盆開始，慢慢把你喜歡的生活種回來。</p>
              <Link
                to="/products"
                className="mt-6 inline-flex rounded-full bg-white px-7 py-3 text-sm font-medium text-brand-dark transition-colors hover:bg-cream"
              >
                探索所有植物
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
