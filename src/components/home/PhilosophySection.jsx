import { motion } from 'motion/react';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function PhilosophySection() {
  return (
    <section className="bg-cream py-28 md:py-36">
      <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
        {/* 裝飾線 */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-12 h-px w-16 origin-center bg-brand-light"
        />

        <motion.p
          custom={0}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="font-display text-xs uppercase tracking-[0.3em] text-brand"
        >
          Our Philosophy
        </motion.p>

        <motion.h2
          custom={1}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-6 font-display text-3xl leading-relaxed font-light text-text-primary md:text-4xl md:leading-relaxed"
        >
          每一盆植物，<br className="hidden md:block" />
          都是一段與自然的對話
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-8 font-body text-base leading-loose text-text-secondary md:text-lg"
        >
          我們相信，植物不只是裝飾品，而是生活的夥伴。
          <br />
          Verde Days 嚴選來自世界各地的綠色植栽，
          <br className="hidden md:block" />
          從觀葉到多肉、從空鳳到禮盒，每一株都經過悉心照料。
        </motion.p>

        <motion.p
          custom={3}
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-6 font-body text-base leading-loose text-text-secondary md:text-lg"
        >
          願這些小小的綠意，能為你的日常帶來一份寧靜。
        </motion.p>
      </div>
    </section>
  );
}
