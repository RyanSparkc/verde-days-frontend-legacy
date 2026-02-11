import { motion } from 'motion/react';

const base = import.meta.env.BASE_URL;

const images = [
  {
    src: `${base}images/lifestyle/lifestyle-1.jpeg`,
    alt: '窗邊植物角落',
    span: 'col-span-2 md:row-span-2',
    aspect: 'aspect-[2/1] md:aspect-square',
  },
  {
    src: `${base}images/lifestyle/lifestyle-2.jpeg`,
    alt: '書架上的小盆栽',
    span: '',
    aspect: 'aspect-square',
  },
  {
    src: `${base}images/lifestyle/lifestyle-3.jpeg`,
    alt: '多肉植物組合',
    span: '',
    aspect: 'aspect-square',
  },
  {
    src: `${base}images/lifestyle/lifestyle-4.jpeg`,
    alt: '龜背芋特寫',
    span: '',
    aspect: 'aspect-square',
  },
  {
    src: `${base}images/lifestyle/lifestyle-5.jpeg`,
    alt: '植物與咖啡',
    span: 'row-span-2',
    aspect: 'aspect-[1/2] md:aspect-auto',
  },
  {
    src: `${base}images/lifestyle/lifestyle-6.jpeg`,
    alt: '綠意空間',
    span: '',
    aspect: 'aspect-square',
  },
  {
    src: `${base}images/lifestyle/lifestyle-7.jpeg`,
    alt: '植物與日常',
    span: 'col-span-2',
    aspect: 'aspect-[2/1] md:aspect-auto',
  },
];

export default function LifestyleGallery() {
  return (
    <section className="bg-white py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <p className="font-display text-xs uppercase tracking-[0.3em] text-brand">
            #VerdeDays
          </p>
          <h2 className="mt-2 font-display text-3xl font-light text-text-primary md:text-4xl">
            綠意日常
          </h2>
          <p className="mt-3 text-sm text-text-secondary">
            植物融入生活的每個角落
          </p>
        </motion.div>

        {/* 照片牆 — 不規則 grid */}
        <div className="grid grid-cols-2 items-start gap-2 md:grid-cols-4 md:items-stretch md:gap-3">
          {images.map((img, i) => (
            <motion.div
              key={img.alt}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`overflow-hidden rounded-lg ${img.span} ${img.aspect}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
