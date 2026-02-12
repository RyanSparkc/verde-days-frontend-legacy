import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { ChevronLeft, ReceiptText, CircleCheckBig, Clock3 } from 'lucide-react';
import { fetchOrders } from '@/slice/orderReducer';
import { ease } from '@/constants/motion';
import { currency } from '@/utils/format';

const formatDate = (timestamp) => {
  if (!timestamp) return '--';
  return new Date(timestamp * 1000).toLocaleDateString('zh-TW');
};

const countOrderItems = (products) =>
  Object.values(products || {}).reduce((sum, item) => sum + (Number(item?.qty) || 0), 0);

function OrdersSkeleton() {
  return (
    <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-4 w-24 animate-pulse rounded bg-brand-light/20" />
          <div className="mt-2 h-8 w-36 animate-pulse rounded bg-brand-light/20" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl bg-white p-5">
              <div className="h-4 w-32 rounded bg-brand-light/20" />
              <div className="mt-3 flex justify-between">
                <div className="h-3 w-20 rounded bg-brand-light/15" />
                <div className="h-3 w-24 rounded bg-brand-light/15" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OrdersEmpty() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
      className="mx-auto mt-6 max-w-xl rounded-2xl border border-brand-light/20 bg-white/80 px-8 py-12 text-center"
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-light/20">
        <ReceiptText size={34} strokeWidth={1.3} className="text-brand" />
      </div>
      <h2 className="mt-6 font-display text-2xl font-light text-text-primary">還沒有訂單紀錄</h2>
      <p className="mt-2 text-sm text-text-secondary">完成第一筆下單後，就會在這裡看到你的訂單。</p>
      <Link
        to="/products"
        className="mt-6 inline-flex rounded-full bg-brand px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
      >
        去逛逛
      </Link>
    </motion.div>
  );
}

export default function Orders() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const { orders, pagination, isOrdersLoading, ordersError } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrders({ page }));
  }, [dispatch, page]);

  if (isOrdersLoading && orders.length === 0) return <OrdersSkeleton />;

  return (
    <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-brand-dark"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            回到首頁
          </Link>

          <p className="mt-4 font-display text-xs uppercase tracking-[0.3em] text-brand">Orders</p>
          <h1 className="mt-2 font-display text-3xl font-light text-text-primary md:text-4xl">我的訂單</h1>
        </motion.div>

        {ordersError && (
          <div className="rounded-xl border border-error/20 bg-error/5 px-5 py-4 text-sm text-error">
            <p>{ordersError}</p>
            <button
              onClick={() => dispatch(fetchOrders({ page }))}
              className="mt-2 cursor-pointer font-medium underline underline-offset-2"
            >
              重新載入
            </button>
          </div>
        )}

        {!ordersError && orders.length === 0 ? (
          <OrdersEmpty />
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const isPaid = Boolean(order.is_paid);
              const total = order.final_total ?? order.total;
              const itemCount = countOrderItems(order.products);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.04, ease }}
                >
                  <Link
                    to={`/order/${order.id}`}
                    className="block rounded-xl border border-brand-light/20 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-light/35"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="font-mono text-xs text-text-secondary">訂單編號：{order.id}</p>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
                          isPaid
                            ? 'bg-success/15 text-success'
                            : 'bg-brand-light/25 text-brand-dark'
                        }`}
                      >
                        {isPaid ? (
                          <CircleCheckBig size={13} strokeWidth={1.6} />
                        ) : (
                          <Clock3 size={13} strokeWidth={1.6} />
                        )}
                        {isPaid ? '已付款' : '待付款'}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-2 text-sm text-text-secondary md:grid-cols-3">
                      <p>日期：{formatDate(order.create_at)}</p>
                      <p>商品數：{itemCount} 件</p>
                      <p className="md:text-right">
                        合計：<span className="font-medium text-text-primary">NT${currency(total)}</span>
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {pagination && pagination.total_pages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3 text-sm">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={!pagination.has_pre}
              className="cursor-pointer rounded-full border border-brand-light/30 px-4 py-2 text-text-secondary transition-colors hover:bg-brand-light/10 disabled:cursor-not-allowed disabled:opacity-35"
            >
              上一頁
            </button>
            <span className="text-text-secondary">
              第 {pagination.current_page} / {pagination.total_pages} 頁
            </span>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!pagination.has_next}
              className="cursor-pointer rounded-full border border-brand-light/30 px-4 py-2 text-text-secondary transition-colors hover:bg-brand-light/10 disabled:cursor-not-allowed disabled:opacity-35"
            >
              下一頁
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
