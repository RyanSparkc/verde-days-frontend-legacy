import { motion } from 'motion/react';

const base = import.meta.env.BASE_URL;

const tips = [
  {
    image: `${base}images/tips/watering.jpeg`,
    label: '澆水技巧',
    en: 'Watering',
    title: '寧乾勿濕，觀察土壤再澆水',
    desc: '大多數室內植物怕的不是缺水，而是過度澆水。用手指插入土面 2 公分，乾了再澆，澆透為止。',
  },
  {
    image: `${base}images/tips/lighting.jpeg`,
    label: '光照指南',
    en: 'Lighting',
    title: '明亮散射光是多數植物的最愛',
    desc: '窗邊有紗簾過濾的光線最理想。觀葉植物避免直射烈日，多肉和仙人掌則需要充足日照。',
  },
  {
    image: `${base}images/tips/repotting.jpeg`,
    label: '換盆時機',
    en: 'Repotting',
    title: '根系冒出底孔，就是換盆的信號',
    desc: '春季是換盆最佳時機。新盆比舊盆大一號即可，別一次換太大，根系在適度緊密的空間反而長更好。',
  },
];

export default function PlantCareTips() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 text-center"
        >
          <p className="font-display text-xs uppercase tracking-[0.3em] text-brand">
            Plant Care
          </p>
          <h2 className="mt-2 font-display text-3xl font-light text-text-primary md:text-4xl">
            照顧小知識
          </h2>
        </motion.div>

        {/* 交錯排列的圖文卡片 */}
        <div className="space-y-12 md:space-y-16">
          {tips.map((tip, i) => {
            const isReversed = i % 2 !== 0;
            return (
              <motion.div
                key={tip.en}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`flex flex-col items-center gap-10 md:flex-row md:gap-20 ${
                  isReversed ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* 圖片 */}
                <div className="w-full overflow-hidden rounded-2xl md:w-1/2">
                  <img
                    src={tip.image}
                    alt={tip.label}
                    className="aspect-[4/3] w-full object-cover"
                    loading="lazy"
                  />
                </div>

                {/* 文字 */}
                <div className="w-full md:w-1/2">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-brand">
                    {tip.en}
                  </p>
                  <h3 className="mt-4 font-display text-2xl font-light leading-snug text-text-primary md:text-3xl">
                    {tip.title}
                  </h3>
                  <p className="mt-5 text-sm leading-loose text-text-secondary md:text-base">
                    {tip.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
