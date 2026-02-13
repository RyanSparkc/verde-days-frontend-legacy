import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router';
import { ChevronDown } from 'lucide-react';
import SplitType from 'split-type';

const HERO_IMAGE_DESKTOP = `${import.meta.env.BASE_URL}images/banner/hero-landscape.jpeg`;
const HERO_IMAGE_MOBILE = `${import.meta.env.BASE_URL}images/banner/003.jpeg`;

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2, delayChildren: 0.5 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeroSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // 視差：背景圖滾動速度較慢
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  // 文字隨滾動淡出 + 上移
  const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.4], [0, -60]);

  useEffect(() => {
    const headingEl = headingRef.current;
    if (!headingEl) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const split = new SplitType(headingEl, { types: 'words' });
    const words = headingEl.querySelectorAll('.word');

    words.forEach((word, index) => {
      word.style.transitionDelay = `${0.34 + index * 0.045}s`;
    });

    const rafId = window.requestAnimationFrame(() => {
      headingEl.classList.add('is-revealed');
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      headingEl.classList.remove('is-revealed');
      split.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen overflow-hidden">
      {/* ===== 視差背景圖 ===== */}
      <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
        <img
          src={HERO_IMAGE_MOBILE}
          alt=""
          aria-hidden
          className="absolute inset-0 -top-[8%] h-[116%] w-full object-cover object-center md:hidden"
        />
        <img
          src={HERO_IMAGE_DESKTOP}
          alt=""
          aria-hidden
          className="absolute inset-0 -top-[15%] hidden h-[130%] w-full object-cover object-center md:block"
        />
      </motion.div>

      {/* ===== 漸層遮罩：底部深 + 頂部微遮罩（navbar 可讀性）===== */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/5" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />

      {/* ===== 微噪點紋理增加質感 ===== */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* ===== 文字內容 ===== */}
      <motion.div
        className="relative flex h-full flex-col items-center justify-center px-6 text-center"
        style={{ opacity: textOpacity, y: textY }}
      >
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          {/* 英文品牌名 — 細字 */}
          <motion.p
            variants={fadeUp}
            className="mb-6 font-display text-sm font-light uppercase tracking-[0.35em] text-white/70"
          >
            Verde Days
          </motion.p>

          {/* 主標語 */}
          <motion.h1
            variants={fadeUp}
            ref={headingRef}
            className="hero-title-split font-display text-[clamp(2.1rem,8.5vw,3.1rem)] leading-[1.18] font-light tracking-[0.01em] text-white md:text-7xl md:leading-tight md:tracking-wide"
          >
            讓綠意，住進日常
          </motion.h1>

          {/* 副標 */}
          <motion.p
            variants={fadeUp}
            className="mx-auto mt-5 max-w-[22rem] font-body text-sm font-light leading-relaxed text-white/70 md:mt-6 md:max-w-none md:text-lg"
          >
            為你的空間帶來自然的溫度與生命力
          </motion.p>

          {/* CTA 按鈕 */}
          <motion.div variants={fadeUp} className="mt-10">
            <Link
              to="/products"
              className="inline-block rounded-full border border-white/30 px-8 py-3 text-sm tracking-wider text-white/90 backdrop-blur-sm transition-all duration-500 hover:border-white/60 hover:bg-white/10"
            >
              探索植物
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ===== 底部滾動指示 ===== */}
      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} className="text-white/40" strokeWidth={1} />
        </motion.div>
      </motion.div>
    </section>
  );
}
