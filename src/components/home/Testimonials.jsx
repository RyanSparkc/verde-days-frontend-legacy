import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

const reviews = [
  {
    quote:
      '收到的琴葉榕比想像中更健康茂密，包裝用心不怕碰撞。現在它是我客廳最搶眼的角落。',
    name: 'Amber L.',
    plant: '琴葉榕',
  },
  {
    quote:
      '送朋友的新居禮盒，打開的瞬間她直接尖叫！配盆和植物的搭配很有質感，完全不用自己煩惱。',
    name: '曉雯',
    plant: '新居落成禮盒',
  },
  {
    quote:
      '第一次養多肉就選了熊童子，三個月了還是胖嘟嘟的。客服教我的澆水頻率真的很實用。',
    name: 'KK Chen',
    plant: '熊童子',
  },
  {
    quote:
      '辦公桌上放了一盆虎尾蘭，同事都說空氣變清新了。而且完全不用常澆水，很適合忙碌的上班族。',
    name: 'Michelle W.',
    plant: '虎尾蘭',
  },
  {
    quote:
      '買了三盆苔球掛在陽台，每天回家看到就覺得療癒。出貨速度很快，隔天就收到了！',
    name: '阿翰',
    plant: '苔球組合',
  },
  {
    quote:
      '幫媽媽挑了一盆蝴蝶蘭當母親節禮物，花了兩個多月還在開，品質真的沒話說。',
    name: 'Sophia T.',
    plant: '蝴蝶蘭',
  },
];

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 3 },
      },
    },
    [Autoplay({ delay: 10000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [selectedSnap, setSelectedSnap] = useState(0);

  const goTo = useCallback(
    (index) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setSelectedSnap(emblaApi.selectedScrollSnap());
    };
    const onSelect = () => setSelectedSnap(emblaApi.selectedScrollSnap());

    onInit();
    emblaApi.on('reInit', onInit);
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('reInit', onInit);
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="bg-cream py-24 md:py-32">
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
            Reviews
          </p>
          <h2 className="mt-2 font-display text-3xl font-light text-text-primary md:text-4xl">
            他們這樣說
          </h2>
        </motion.div>

        {/* Embla Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="-ml-4 flex md:-ml-6">
              {reviews.map((review) => (
                <div
                  key={review.name}
                  className="min-w-0 flex-[0_0_100%] pl-4 md:flex-[0_0_33.333%] md:pl-6"
                >
                  <blockquote className="relative flex h-full flex-col rounded-2xl bg-white px-8 pb-8 pt-12 shadow-sm">
                    {/* 裝飾引號 */}
                    <span
                      className="absolute top-4 left-6 font-display text-6xl leading-none text-brand-light/20 select-none"
                      aria-hidden="true"
                    >
                      &ldquo;
                    </span>

                    <p className="relative text-sm leading-loose text-text-secondary">
                      {review.quote}
                    </p>

                    <footer className="mt-auto border-t border-brand-light/15 pt-4">
                      <p className="text-sm font-medium text-text-primary">
                        {review.name}
                      </p>
                      <p className="mt-0.5 text-xs text-brand">
                        購買：{review.plant}
                      </p>
                    </footer>
                  </blockquote>
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div className="mt-8 flex items-center justify-center gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                aria-label={`前往第 ${index + 1} 組評價`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedSnap
                    ? 'w-6 bg-brand'
                    : 'w-2 bg-brand-light/30 hover:bg-brand-light/50'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
