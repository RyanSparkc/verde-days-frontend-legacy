import { motion } from 'motion/react';
import { Truck, ShieldCheck, Sprout, MessageCircle } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: '全台免運',
    desc: '滿 $1,500 享免運配送',
  },
  {
    icon: ShieldCheck,
    title: '7 天鑑賞期',
    desc: '植物到府不滿意可退換',
  },
  {
    icon: Sprout,
    title: '植物保活',
    desc: '到貨 7 日內非人為枯損免費補寄',
  },
  {
    icon: MessageCircle,
    title: '照顧諮詢',
    desc: '專人回覆你的植物疑難雜症',
  },
];

export default function ServiceFeatures() {
  return (
    <section className="border-b border-brand-light/15 bg-white py-12 md:py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-light/15">
                <f.icon size={20} className="text-brand" strokeWidth={1.5} />
              </div>
              <h3 className="mt-3 text-sm font-medium text-text-primary">
                {f.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
