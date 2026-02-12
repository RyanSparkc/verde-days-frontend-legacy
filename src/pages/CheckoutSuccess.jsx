import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { CircleCheckBig } from 'lucide-react';
import { ease } from '@/constants/motion';

export default function CheckoutSuccess() {
  const { orderId } = useParams();

  return (
    <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-light/20">
            <CircleCheckBig size={40} strokeWidth={1.2} className="text-brand" />
          </div>

          <h1 className="mt-6 font-display text-3xl font-light text-text-primary">
            訂單已送出
          </h1>
          <p className="mt-3 text-sm text-text-secondary">
            感謝您的訂購，我們會盡快為您出貨
          </p>

          {orderId && (
            <p className="mt-4 rounded-lg bg-white px-4 py-2 text-xs text-text-secondary">
              訂單編號：<span className="font-mono text-text-primary">{orderId}</span>
            </p>
          )}

          <div className="mt-8 flex gap-3">
            <Link
              to="/"
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-brand-dark"
            >
              回到首頁
            </Link>
            {orderId && (
              <Link
                to={`/order/${orderId}`}
                className="rounded-full border border-brand-light/40 px-6 py-2.5 text-sm text-text-secondary transition-colors hover:bg-brand-light/10 hover:text-brand-dark"
              >
                查看訂單
              </Link>
            )}
            <Link
              to="/products"
              className="rounded-full border border-brand-light/40 px-6 py-2.5 text-sm text-text-secondary transition-colors hover:bg-brand-light/10 hover:text-brand-dark"
            >
              繼續逛逛
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
