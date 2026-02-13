import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="relative isolate overflow-hidden bg-cream py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(168,185,154,0.18),transparent_42%),radial-gradient(circle_at_84%_82%,rgba(196,164,132,0.12),transparent_52%)]" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] border border-brand-light/25 bg-gradient-to-br from-[#5f7551] via-[#6b8458] to-[#7a6a56] px-6 py-10 shadow-[0_20px_45px_rgba(26,34,22,0.26)] md:px-12 md:py-12"
        >
          <div className="pointer-events-none absolute -left-16 -top-14 h-44 w-44 rounded-full bg-white/9 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-[-5rem] h-56 w-56 rounded-full bg-black/12 blur-3xl" />

          <p className="relative font-display text-[11px] uppercase tracking-[0.3em] text-white/60">
            Verde Days
          </p>
          <h2 className="mt-3 font-display text-3xl font-light leading-relaxed text-white md:text-4xl md:leading-relaxed">
            開始你的綠色旅程
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-white/80 md:text-base">
            從一盆植物開始，讓自然走進你的生活
          </p>

          <motion.div className="mt-9 inline-block" whileHover={{ y: -2 }} transition={{ duration: 0.22 }}>
            <Link
              to="/products"
              className="group inline-flex items-center gap-2 rounded-full border border-white/55 bg-cream px-8 py-3 text-sm font-medium tracking-[0.08em] text-brand-dark shadow-[0_10px_24px_rgba(10,16,10,0.24)] transition-all duration-300 hover:bg-white hover:shadow-[0_12px_28px_rgba(10,16,10,0.3)]"
            >
              探索所有植物
              <ArrowRight size={15} strokeWidth={1.8} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
