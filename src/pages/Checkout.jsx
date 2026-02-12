import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Truck,
  Headset,
} from 'lucide-react';
import { fetchCart, submitOrder } from '@/slice/cartReducer';
import { ease } from '@/constants/motion';
import { currency } from '@/utils/format';

const fields = [
  { id: 'name', label: '姓名', icon: User, placeholder: '王小明', rules: { required: '請輸入姓名' } },
  {
    id: 'email',
    label: 'Email',
    icon: Mail,
    placeholder: 'example@mail.com',
    type: 'email',
    rules: {
      required: '請輸入 Email',
      pattern: { value: /^\S+@\S+$/i, message: 'Email 格式不正確' },
    },
  },
  { id: 'tel', label: '電話', icon: Phone, placeholder: '0912-345-678', type: 'tel', rules: { required: '請輸入電話' } },
  { id: 'address', label: '地址', icon: MapPin, placeholder: '台北市大安區...', rules: { required: '請輸入地址' } },
  { id: 'message', label: '留言', icon: MessageSquare, placeholder: '有任何特殊需求請告訴我們', rules: {}, textarea: true },
];

const trustSignals = [
  {
    icon: Truck,
    title: '快速配送',
    description: '下單後 1-2 個工作天內出貨',
  },
  {
    icon: ShieldCheck,
    title: '安全付款',
    description: '採用加密傳輸，付款資訊安全保護',
  },
  {
    icon: Headset,
    title: '即時協助',
    description: '有問題可透過客服信箱快速協助',
  },
];

function CheckoutSkeleton() {
  return (
    <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-5 w-28 animate-pulse rounded bg-brand-light/20" />
          <div className="mt-4">
            <div className="h-4 w-16 animate-pulse rounded bg-brand-light/20" />
            <div className="mt-2 h-8 w-24 animate-pulse rounded bg-brand-light/20" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          <div className="md:col-span-3">
            <div className="rounded-xl bg-white p-6">
              <div className="h-5 w-24 animate-pulse rounded bg-brand-light/20" />
              <div className="mt-6 space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="h-16 w-16 flex-shrink-0 animate-pulse rounded-lg bg-brand-light/20" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 animate-pulse rounded bg-brand-light/20" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-brand-light/15" />
                    </div>
                    <div className="h-4 w-20 animate-pulse rounded bg-brand-light/15" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <div className="rounded-xl bg-white p-5">
              <div className="h-4 w-24 animate-pulse rounded bg-brand-light/20" />
              <div className="mt-4 space-y-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-4 animate-pulse rounded bg-brand-light/15" />
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-16 animate-pulse rounded-xl bg-white" />
              ))}
            </div>

            <div className="rounded-xl bg-white p-6">
              <div className="h-5 w-28 animate-pulse rounded bg-brand-light/20" />
              <div className="mt-6 space-y-5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index}>
                    <div className="h-4 w-16 rounded bg-brand-light/15" />
                    <div className={`mt-2 ${index === 4 ? 'h-20' : 'h-10'} w-full rounded-lg bg-brand-light/15`} />
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

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, isPageLoading, isSubmitting } = useSelector((state) => state.cart);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { name: '', email: '', tel: '', address: '', message: '' },
  });

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

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
      // error handled by thunk
    }
  };

  if (isPageLoading) return <CheckoutSkeleton />;

  const itemCount = cart.carts?.reduce((sum, item) => sum + item.qty, 0) || 0;
  const hasDiscount = cart.final_total !== cart.total;
  const discountAmount = Math.max(0, cart.total - cart.final_total);

  return (
    <section className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
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
            <p className="font-display text-xs uppercase tracking-[0.3em] text-brand">Checkout</p>
            <h1 className="mt-2 font-display text-3xl font-light text-text-primary md:text-4xl">結帳</h1>
          </div>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-5 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease }}
            className="md:col-span-3"
          >
            <div className="rounded-xl bg-white p-6">
              <h2 className="font-display text-lg font-light text-text-primary">訂單明細</h2>

              <div className="mt-6 space-y-4">
                {cart.carts?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-primary">{item.product.title}</p>
                      <p className="mt-0.5 text-xs text-text-secondary">x{item.qty}</p>
                    </div>
                    <span className="flex-shrink-0 text-sm font-medium text-text-primary">
                      NT${currency(item.final_total)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl bg-cream/70 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">商品件數</span>
                  <span className="text-text-primary">{itemCount} 件</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-text-secondary">小計</span>
                  <span className="text-text-primary">NT${currency(cart.total)}</span>
                </div>
                {hasDiscount && (
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-text-secondary">折扣</span>
                    <span className="text-error">-NT${currency(discountAmount)}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="space-y-5 md:col-span-2 md:space-y-6"
          >
            <div className="rounded-xl border border-brand-light/20 bg-white p-6">
              <p className="font-display text-xs uppercase tracking-[0.26em] text-brand">Order Summary</p>
              <div className="mt-5 space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">商品件數</span>
                  <span className="text-text-primary">{itemCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">小計</span>
                  <span className="text-text-primary">NT${currency(cart.total)}</span>
                </div>
                {hasDiscount && (
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">折扣</span>
                    <span className="text-error">-NT${currency(discountAmount)}</span>
                  </div>
                )}
                <div className="h-px bg-brand-light/25" />
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-primary">應付總額</span>
                  <span className="text-xl font-medium text-brand-dark">NT${currency(cart.final_total)}</span>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-cream/80 p-3 text-xs leading-relaxed text-text-secondary">
                <p>配送方式：常溫宅配（滿額免運）</p>
                <p className="mt-1">付款方式：信用卡 / ATM 轉帳</p>
              </div>
            </div>

            <div className="rounded-xl border border-brand-light/20 bg-white p-6">
              <h2 className="font-display text-lg font-light text-text-primary">收件人資訊</h2>

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
                    {errors[id] && <p className="mt-1 text-xs text-error">{errors[id].message}</p>}
                  </div>
                ))}

                <div className="border-t border-brand-light/20 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-brand-dark disabled:pointer-events-none disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      訂單處理中...
                    </>
                  ) : (
                    `確認送出（NT$${currency(cart.final_total)}）`
                  )}
                </button>
                </div>
              </form>
            </div>

            <div className="rounded-xl border border-brand-light/20 bg-white/90 p-4">
              <p className="px-1 text-xs tracking-[0.12em] text-text-secondary">安心服務</p>
              <div className="mt-3 grid gap-3">
                {trustSignals.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="flex items-center gap-3 rounded-xl border border-brand-light/18 bg-cream/50 px-4 py-3"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-light/20 text-brand-dark">
                      <Icon size={16} strokeWidth={1.7} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{title}</p>
                      <p className="text-xs text-text-secondary">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
