import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Trash2, Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react';
import { fetchCart, updateCartItem, deleteCartItem, deleteCartAll } from '@/slice/cartReducer';
import { ease } from '@/constants/motion';
import { currency } from '@/utils/format';

// ─── 載入骨架屏 ───
function CartSkeleton() {
  return (
    <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* 標題骨架 */}
        <div className="mb-8">
          <div className="h-4 w-12 animate-pulse rounded bg-brand-light/20" />
          <div className="mt-2 h-8 w-32 animate-pulse rounded bg-brand-light/20" />
        </div>

        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          {/* 左欄：卡片骨架 */}
          <div className="space-y-4 md:col-span-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl bg-white p-4">
                <div className="flex gap-4">
                  <div className="h-24 w-24 flex-shrink-0 rounded-lg bg-brand-light/20" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-3/4 rounded bg-brand-light/20" />
                    <div className="h-3 w-1/2 rounded bg-brand-light/15" />
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-24 rounded-full bg-brand-light/15" />
                      <div className="h-4 w-20 rounded bg-brand-light/20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 右欄：摘要骨架 */}
          <div className="md:col-span-2">
            <div className="animate-pulse rounded-xl bg-white p-6">
              <div className="h-5 w-24 rounded bg-brand-light/20" />
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <div className="h-4 w-12 rounded bg-brand-light/15" />
                  <div className="h-4 w-20 rounded bg-brand-light/15" />
                </div>
                <div className="h-px bg-brand-light/20" />
                <div className="flex justify-between">
                  <div className="h-5 w-12 rounded bg-brand-light/20" />
                  <div className="h-5 w-24 rounded bg-brand-light/20" />
                </div>
              </div>
              <div className="mt-6 h-12 w-full rounded-full bg-brand-light/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const emptyCartQuickLinks = [
  { to: '/products?category=foliage', label: '觀葉植物' },
  { to: '/products?category=succulent', label: '多肉植物' },
  { to: '/products?category=giftset', label: '植栽禮盒' },
];

// ─── 空購物車 ───
function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="mx-auto mt-6 flex w-full max-w-xl flex-col items-center rounded-2xl border border-brand-light/20 bg-white/75 px-8 py-12 text-center shadow-sm md:mt-10"
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-light/20">
        <ShoppingBag size={36} strokeWidth={1.2} className="text-brand" />
      </div>
      <p className="mt-6 font-display text-xl font-light text-text-primary">
        購物車是空的
      </p>
      <p className="mt-2 text-sm text-text-secondary">
        快去挑選喜歡的植物吧
      </p>
      <Link
        to="/products"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-10 py-3 text-sm font-medium tracking-[0.08em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-brand-dark hover:shadow-md"
      >
        去逛逛
      </Link>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {emptyCartQuickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="rounded-full border border-brand-light/40 px-4 py-1.5 text-xs text-text-secondary transition-colors hover:border-brand-light hover:text-brand-dark"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// ─── 單一商品卡片 ───
function CartItemCard({ item, loadingItemId, dispatch }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const isLoading = loadingItemId === item.id || loadingItemId === 'all';
  const loadingText = isDeleting ? '移除中...' : '更新中...';

  const handleQtyChange = (newQty) => {
    if (newQty < 1) return;
    dispatch(updateCartItem({ id: item.id, productId: item.product_id, qty: newQty }));
  };

  const handleDelete = () => {
    setIsDeleting(true);
    dispatch(deleteCartItem(item.id))
      .unwrap()
      .catch(() => {
        setIsDeleting(false);
      });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.3, ease }}
      className={`relative rounded-xl bg-white p-4 ${isLoading ? 'pointer-events-none opacity-70' : ''}`}
      aria-busy={isLoading}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/75 backdrop-blur-[1px]">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-light/30 px-3 py-1.5 text-xs text-brand-dark">
            <Loader2 size={14} className="animate-spin" />
            {loadingText}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        {/* 商品縮圖 */}
        <Link to={`/product/${item.product_id}`} className="flex-shrink-0">
          <img
            src={item.product.imageUrl}
            alt={item.product.title}
            className="h-24 w-24 rounded-lg object-cover transition-opacity hover:opacity-80"
          />
        </Link>

        {/* 商品資訊 */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* 標題 + 刪除 */}
          <div className="flex items-start justify-between gap-2">
            <Link
              to={`/product/${item.product_id}`}
              className="truncate text-sm font-medium text-text-primary transition-colors hover:text-brand-dark"
            >
              {item.product.title}
            </Link>
            <button
                onClick={handleDelete}
                className="flex-shrink-0 cursor-pointer p-1 text-text-secondary/50 transition-colors hover:text-error"
                aria-label="刪除商品"
                disabled={isLoading}
              >
                {isDeleting ? (
                  <Loader2 size={16} strokeWidth={1.5} className="animate-spin" />
                ) : (
                  <Trash2 size={16} strokeWidth={1.5} />
                )}
              </button>
            </div>

          {/* 單價 */}
          <p className="mt-1 text-xs text-text-secondary">
            NT${currency(item.product.price)} / {item.product.unit}
          </p>

          {/* 數量選擇器 + 小計 */}
          <div className="mt-auto flex items-center justify-between pt-3">
            <div className="flex items-center overflow-hidden rounded-full border border-brand-light/40">
              <button
                onClick={() => handleQtyChange(item.qty - 1)}
                disabled={item.qty <= 1}
                className="flex h-8 w-8 cursor-pointer items-center justify-center text-text-secondary transition-colors hover:bg-brand-light/10 hover:text-brand-dark disabled:pointer-events-none disabled:opacity-30"
                aria-label="減少數量"
              >
                <Minus size={12} strokeWidth={1.5} />
              </button>
              <span className="flex h-8 w-10 items-center justify-center text-sm font-medium text-text-primary">
                {item.qty}
              </span>
              <button
                onClick={() => handleQtyChange(item.qty + 1)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center text-text-secondary transition-colors hover:bg-brand-light/10 hover:text-brand-dark"
                aria-label="增加數量"
              >
                <Plus size={12} strokeWidth={1.5} />
              </button>
            </div>

            <span className="text-sm font-medium text-text-primary">
              NT${currency(item.final_total)}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── 主頁面 ───
export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, isPageLoading, loadingItemId } = useSelector((state) => state.cart);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const isClearingAll = loadingItemId === 'all';

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (isPageLoading) return <CartSkeleton />;

  const isEmpty = !cart.carts || cart.carts.length === 0;
  const hasDiscount = cart.final_total !== cart.total;

  return (
    <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* ===== 頂部操作列 ===== */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-8"
        >
          {!isEmpty && (
            <div className="flex items-center justify-between">
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-brand-dark"
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
                繼續購物
              </Link>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="cursor-pointer text-sm text-text-secondary/60 transition-colors hover:text-error"
              >
                清空購物車
              </button>
            </div>
          )}

          <div className={isEmpty ? 'mt-0' : 'mt-4'}>
            <p className="font-display text-xs uppercase tracking-[0.3em] text-brand">
              Cart
            </p>
            <h1 className="mt-2 font-display text-3xl font-light text-text-primary md:text-4xl">
              購物車
            </h1>
          </div>
        </motion.div>

        {/* ===== 空購物車 ===== */}
        {isEmpty ? (
          <EmptyCart />
        ) : (
          /* ===== 主要內容：商品列表 + 訂單摘要 ===== */
          <div className="grid gap-8 md:grid-cols-5 md:gap-12">
            {/* 左欄：商品列表 */}
            <div className="relative md:col-span-3">
              {isClearingAll && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-cream/70 backdrop-blur-[1px]">
                  <div className="inline-flex items-center gap-2 rounded-full bg-brand-light/30 px-3 py-1.5 text-xs text-brand-dark">
                    <Loader2 size={14} className="animate-spin" />
                    清空購物車中...
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {cart.carts.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      loadingItemId={loadingItemId}
                      dispatch={dispatch}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* 右欄：訂單摘要 */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease }}
                className="sticky top-28 rounded-xl bg-white p-6"
              >
                <h2 className="font-display text-lg font-light text-text-primary">
                  訂單摘要
                </h2>

                <div className="mt-6 space-y-3">
                  {/* 小計 */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">小計</span>
                    <span className="text-text-primary">NT${currency(cart.total)}</span>
                  </div>

                  {/* 折扣（僅在有折扣時顯示） */}
                  {hasDiscount && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">折扣</span>
                      <span className="text-error">-NT${currency(cart.total - cart.final_total)}</span>
                    </div>
                  )}

                  {/* 分隔線 */}
                  <div className="h-px bg-brand-light/20" />

                  {/* 合計 */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">合計</span>
                    <span className="text-xl font-medium text-brand-dark">
                      NT${currency(cart.final_total)}
                    </span>
                  </div>
                </div>

                {/* 前往結帳按鈕 */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-full bg-brand py-3.5 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-brand-dark hover:shadow-md"
                >
                  前往結帳
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </div>

      {/* ===== 清空確認對話框 ===== */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease }}
              className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-lg font-light text-text-primary">
                確定要清空購物車嗎？
              </h3>
              <p className="mt-2 text-sm text-text-secondary">
                此操作無法復原
              </p>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 cursor-pointer rounded-full border border-brand-light/40 py-2.5 text-sm text-text-secondary transition-colors hover:bg-brand-light/10"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    if (isClearingAll) return;
                    dispatch(deleteCartAll());
                    setShowClearConfirm(false);
                  }}
                  disabled={isClearingAll}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-error py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isClearingAll ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      清空中...
                    </>
                  ) : (
                    '確定清空'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
