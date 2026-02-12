import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import { ChevronLeft, Loader2, User, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { fetchCart, submitOrder } from '@/slice/cartReducer';
import { ease } from '@/constants/motion';
import { currency } from '@/utils/format';

// ─── 表單欄位設定 ───
const fields = [
  { id: 'name', label: '姓名', icon: User, placeholder: '王小明', rules: { required: '請輸入姓名' } },
  { id: 'email', label: 'Email', icon: Mail, placeholder: 'example@mail.com', type: 'email', rules: { required: '請輸入 Email', pattern: { value: /^\S+@\S+$/i, message: 'Email 格式不正確' } } },
  { id: 'tel', label: '電話', icon: Phone, placeholder: '0912-345-678', type: 'tel', rules: { required: '請輸入電話' } },
  { id: 'address', label: '地址', icon: MapPin, placeholder: '台北市大安區...', rules: { required: '請輸入地址' } },
  { id: 'message', label: '留言', icon: MessageSquare, placeholder: '有任何特殊需求請告訴我們', rules: {}, textarea: true },
];

// ─── 載入骨架屏 ───
function CheckoutSkeleton() {
  return (
    <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* 返回連結骨架 */}
        <div className="mb-8">
          <div className="h-5 w-28 animate-pulse rounded bg-brand-light/20" />
          <div className="mt-4">
            <div className="h-4 w-16 animate-pulse rounded bg-brand-light/20" />
            <div className="mt-2 h-8 w-24 animate-pulse rounded bg-brand-light/20" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          {/* 左欄：訂單明細骨架 */}
          <div className="md:col-span-3">
            <div className="rounded-xl bg-white p-6">
              <div className="h-5 w-24 animate-pulse rounded bg-brand-light/20" />
              <div className="mt-6 space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="h-16 w-16 flex-shrink-0 animate-pulse rounded-lg bg-brand-light/20" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-brand-light/20" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-brand-light/15" />
                    </div>
                    <div className="h-4 w-20 animate-pulse rounded bg-brand-light/15" />
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex justify-between">
                  <div className="h-4 w-12 animate-pulse rounded bg-brand-light/15" />
                  <div className="h-4 w-20 animate-pulse rounded bg-brand-light/15" />
                </div>
                <div className="h-px bg-brand-light/20" />
                <div className="flex justify-between">
                  <div className="h-5 w-12 animate-pulse rounded bg-brand-light/20" />
                  <div className="h-5 w-24 animate-pulse rounded bg-brand-light/20" />
                </div>
              </div>
            </div>
          </div>

          {/* 右欄：表單骨架 */}
          <div className="md:col-span-2">
            <div className="animate-pulse rounded-xl bg-white p-6">
              <div className="h-5 w-28 rounded bg-brand-light/20" />
              <div className="mt-6 space-y-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-16 rounded bg-brand-light/15" />
                    <div className={`mt-2 ${i === 4 ? 'h-20' : 'h-10'} w-full rounded-lg bg-brand-light/15`} />
                  </div>
                ))}
              </div>
              <div className="mt-6 h-12 w-full rounded-full bg-brand-light/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 主頁面 ───
export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, isPageLoading, isSubmitting } = useSelector((state) => state.cart);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', tel: '', address: '', message: '' },
  });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // 載入完成後若購物車為空，導回購物車頁
  useEffect(() => {
    if (!isPageLoading && (!cart.carts || cart.carts.length === 0)) {
      navigate('/cart', { replace: true });
    }
  }, [isPageLoading, cart.carts, navigate]);

  const onSubmit = async (formData) => {
    const orderData = {
      user: {
        name: formData.name,
        email: formData.email,
        tel: formData.tel,
        address: formData.address,
      },
      message: formData.message,
    };
    try {
      const result = await dispatch(submitOrder(orderData)).unwrap();
      navigate(`/checkout/success/${result.orderId}`);
    } catch {
      // error handled by thunk (toast message)
    }
  };

  if (isPageLoading) return <CheckoutSkeleton />;

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
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-brand-dark"
          >
            <ChevronLeft size={16} strokeWidth={1.5} />
            返回購物車
          </Link>

          <div className="mt-4">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-brand">
              Checkout
            </p>
            <h1 className="mt-2 font-display text-3xl font-light text-text-primary md:text-4xl">
              結帳
            </h1>
          </div>
        </motion.div>

        {/* ===== 主要內容：訂單明細 + 結帳表單 ===== */}
        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          {/* 左欄：訂單明細 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="md:col-span-3"
          >
            <div className="rounded-xl bg-white p-6">
              <h2 className="font-display text-lg font-light text-text-primary">
                訂單明細
              </h2>

              {/* 商品列表 */}
              <div className="mt-6 space-y-4">
                {cart.carts?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {item.product.title}
                      </p>
                      <p className="mt-0.5 text-xs text-text-secondary">
                        x{item.qty}
                      </p>
                    </div>
                    <span className="flex-shrink-0 font-display text-sm text-text-primary">
                      NT${currency(item.final_total)}
                    </span>
                  </div>
                ))}
              </div>

              {/* 金額摘要 */}
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
                  <span className="font-display text-xl text-brand-dark">
                    NT${currency(cart.final_total)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 右欄：結帳表單 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="md:col-span-2"
          >
            <div className="sticky top-28 rounded-xl bg-white p-6">
              <h2 className="font-display text-lg font-light text-text-primary">
                收件人資訊
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
                {fields.map(({ id, label, icon: Icon, placeholder, type, rules, textarea }) => (
                  <div key={id}>
                    <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-text-primary">
                      <Icon size={14} strokeWidth={1.5} className="text-text-secondary" />
                      {label}
                    </label>
                    {textarea ? (
                      <textarea
                        id={id}
                        rows={3}
                        placeholder={placeholder}
                        {...register(id, rules)}
                        className="w-full resize-none rounded-lg border border-brand-light/40 px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                      />
                    ) : (
                      <input
                        id={id}
                        type={type || 'text'}
                        placeholder={placeholder}
                        {...register(id, rules)}
                        className="w-full rounded-lg border border-brand-light/40 px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                      />
                    )}
                    {errors[id] && (
                      <p className="mt-1 text-xs text-error">{errors[id].message}</p>
                    )}
                  </div>
                ))}

                {/* 送出按鈕 */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-brand-dark hover:shadow-md disabled:pointer-events-none disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      訂單處理中...
                    </>
                  ) : (
                    '送出訂單'
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
