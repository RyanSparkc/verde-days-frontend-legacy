import { motion } from 'motion/react';
import { ease } from '@/constants/motion';

export default function Cart() {
  return (
    <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
        >
          <p className="font-display text-xs uppercase tracking-[0.3em] text-brand">
            Cart
          </p>
          <h1 className="mt-2 font-display text-3xl font-light text-text-primary md:text-4xl">
            購物車
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
