import { Link } from 'react-router';
import { motion } from 'motion/react';

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-brand-dark py-28 md:py-36">
      {/* 背景裝飾 — 大尺寸半透明文字 */}
      <div
        className="pointer-events-none absolute inset-0 flex select-none items-center justify-center overflow-hidden font-display text-[18vw] font-light leading-none tracking-wide text-white/[0.03]"
        aria-hidden="true"
      >
        Verde Days
      </div>

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-3xl font-light leading-relaxed text-white md:text-4xl md:leading-relaxed">
            開始你的綠色旅程
          </h2>
          <p className="mt-4 font-body text-base leading-relaxed text-white/60">
            從一盆植物開始，讓自然走進你的生活
          </p>

          {/* 呼吸脈動按鈕 */}
          <motion.div
            className="mt-10 inline-block"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(168, 185, 154, 0)',
                '0 0 0 12px rgba(168, 185, 154, 0.15)',
                '0 0 0 0 rgba(168, 185, 154, 0)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            style={{ borderRadius: '9999px' }}
          >
            <Link
              to="/products"
              className="inline-block rounded-full bg-brand-light px-10 py-3.5 text-sm font-medium tracking-wider text-brand-dark transition-all duration-300 hover:bg-white hover:text-brand-dark"
            >
              探索所有植物
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
