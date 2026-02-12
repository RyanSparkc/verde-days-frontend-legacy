import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { ChevronLeft, Loader2, CircleCheckBig, WalletCards } from 'lucide-react';
import { clearCurrentOrder, fetchOrderById, payOrder } from '@/slice/orderReducer';
import { ease } from '@/constants/motion';
import { currency } from '@/utils/format';

const formatDateTime = (timestamp) => {
  if (!timestamp) return '--';
  return new Date(timestamp * 1000).toLocaleString('zh-TW');
};

function OrderDetailSkeleton() {
  return (
    <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="h-5 w-28 animate-pulse rounded bg-brand-light/20" />
        <div className="mt-5 h-8 w-52 animate-pulse rounded bg-brand-light/20" />

        <div className="mt-8 grid gap-8 md:grid-cols-5 md:gap-10">
          <div className="md:col-span-3">
            <div className="space-y-3 rounded-xl bg-white p-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-14 w-14 animate-pulse rounded-lg bg-brand-light/20" />
                  <div className="flex-1">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-brand-light/20" />
                    <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-brand-light/15" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="space-y-3 rounded-xl bg-white p-6">
              <div className="h-4 w-20 animate-pulse rounded bg-brand-light/20" />
              <div className="h-4 w-full animate-pulse rounded bg-brand-light/15" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-brand-light/15" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, isOrderLoading, orderError, payingOrderId } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchOrderById(id));

    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, id]);

  const orderItems = useMemo(() => Object.values(currentOrder?.products || {}), [currentOrder]);

  if (isOrderLoading) return <OrderDetailSkeleton />;

  return (
    <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-8"
        >
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-brand-dark"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            返回訂單列表
          </Link>

          <p className="mt-4 font-display text-xs uppercase tracking-[0.3em] text-brand">Order</p>
          <h1 className="mt-2 font-display text-3xl font-light text-text-primary md:text-4xl">訂單詳情</h1>
        </motion.div>

        {orderError && (
          <div className="rounded-xl border border-error/20 bg-error/5 px-5 py-4 text-sm text-error">
            <p>{orderError}</p>
            <button
              onClick={() => dispatch(fetchOrderById(id))}
              className="mt-2 cursor-pointer font-medium underline underline-offset-2"
            >
              重新載入
            </button>
          </div>
        )}

        {!orderError && !currentOrder && (
          <div className="rounded-xl border border-brand-light/20 bg-white px-6 py-10 text-center text-text-secondary">
            找不到這筆訂單。
          </div>
        )}

        {!orderError && currentOrder && (
          <div className="grid gap-8 md:grid-cols-5 md:gap-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="md:col-span-3"
            >
              <div className="rounded-xl bg-white p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-lg font-light text-text-primary">商品明細</h2>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
                      currentOrder.is_paid
                        ? 'bg-success/15 text-success'
                        : 'bg-brand-light/25 text-brand-dark'
                    }`}
                  >
                    {currentOrder.is_paid ? <CircleCheckBig size={13} strokeWidth={1.6} /> : <WalletCards size={13} strokeWidth={1.6} />}
                    {currentOrder.is_paid ? '已付款' : '待付款'}
                  </span>
                </div>

                <div className="space-y-4">
                  {orderItems.map((item) => {
                    const lineTotal = item.final_total ?? item.total ?? (item.product?.price || 0) * item.qty;
                    return (
                      <div key={item.id} className="flex items-center gap-4 rounded-lg border border-brand-light/15 px-3 py-3">
                        {item.product?.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.title}
                            className="h-14 w-14 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-brand-light/20 text-xs text-text-secondary">
                            商品
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-text-primary">{item.product?.title || '商品'}</p>
                          <p className="mt-0.5 text-xs text-text-secondary">數量 x{item.qty}</p>
                        </div>

                        <p className="text-sm font-medium text-text-primary">NT${currency(lineTotal)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 space-y-3 border-t border-brand-light/20 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">小計</span>
                    <span className="text-text-primary">NT${currency(currentOrder.total || 0)}</span>
                  </div>

                  {currentOrder.final_total !== undefined && currentOrder.final_total !== currentOrder.total && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">折扣</span>
                      <span className="text-error">-NT${currency((currentOrder.total || 0) - (currentOrder.final_total || 0))}</span>
                    </div>
                  )}

                  <div className="h-px bg-brand-light/20" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">合計</span>
                    <span className="text-xl font-medium text-brand-dark">
                      NT${currency(currentOrder.final_total ?? currentOrder.total ?? 0)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease }}
              className="md:col-span-2"
            >
              <div className="sticky top-28 rounded-xl bg-white p-6">
                <h2 className="font-display text-lg font-light text-text-primary">訂單資訊</h2>

                <dl className="mt-5 space-y-3 text-sm">
                  <div>
                    <dt className="text-text-secondary">訂單編號</dt>
                    <dd className="mt-1 break-all font-mono text-text-primary">{currentOrder.id}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary">建立時間</dt>
                    <dd className="mt-1 text-text-primary">{formatDateTime(currentOrder.create_at)}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary">收件人</dt>
                    <dd className="mt-1 text-text-primary">{currentOrder.user?.name || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary">Email</dt>
                    <dd className="mt-1 break-all text-text-primary">{currentOrder.user?.email || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary">電話</dt>
                    <dd className="mt-1 text-text-primary">{currentOrder.user?.tel || '—'}</dd>
                  </div>
                  <div>
                    <dt className="text-text-secondary">地址</dt>
                    <dd className="mt-1 text-text-primary">{currentOrder.user?.address || '—'}</dd>
                  </div>
                  {currentOrder.message && (
                    <div>
                      <dt className="text-text-secondary">備註</dt>
                      <dd className="mt-1 text-text-primary">{currentOrder.message}</dd>
                    </div>
                  )}
                </dl>

                {!currentOrder.is_paid && (
                  <button
                    onClick={() => dispatch(payOrder(currentOrder.id))}
                    disabled={payingOrderId === currentOrder.id}
                    className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand py-3 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-65"
                  >
                    {payingOrderId === currentOrder.id ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        付款中...
                      </>
                    ) : (
                      <>
                        <WalletCards size={14} strokeWidth={1.7} />
                        立即付款
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
