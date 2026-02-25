import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Leaf } from 'lucide-react';
import { checkAdminSession, normalizeAuthError, signInAdmin } from '@/services/admin/authService';
import { getAdminToken } from '@/services/admin/session';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    const token = getAdminToken();
    if (!token) return;

    let active = true;
    checkAdminSession()
      .then(() => {
        if (active) navigate('/admin/products', { replace: true });
      })
      .catch(() => {
        if (active) setAuthError('Token 已過期，請重新登入。');
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const onSubmit = async (data) => {
    setAuthError('');
    setIsSubmitting(true);

    try {
      await signInAdmin(data);
      navigate('/admin/products', { replace: true });
    } catch (error) {
      setAuthError(normalizeAuthError(error, '登入失敗，請檢查帳號密碼'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-cream px-4 py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-140px] left-[-120px] h-[340px] w-[340px] rounded-full bg-brand-light/18 blur-3xl" />
        <div className="absolute right-[-140px] bottom-[-180px] h-[400px] w-[400px] rounded-full bg-brand/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center justify-center"
      >
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-brand-light/24 bg-white/92 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="relative hidden border-r border-brand-light/14 bg-[linear-gradient(140deg,rgba(168,185,154,0.18),rgba(250,248,245,0.6))] p-10 lg:block">
            <p className="text-[11px] tracking-[0.3em] text-brand">VERDE DAYS</p>
            <h1 className="mt-3 font-display text-5xl leading-[1.02] text-brand-dark">Admin<br />Atelier</h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-text-secondary">
              專注管理商品、訂單與營運內容。以一致的品牌語彙，維持你的商店節奏。
            </p>

            <div className="mt-10 space-y-3 text-sm text-text-secondary">
              <div className="flex items-center gap-3 rounded-xl border border-brand-light/16 bg-white/65 px-4 py-3">
                <Leaf size={14} className="text-brand" />
                商品與訂單同步管理
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-brand-light/16 bg-white/65 px-4 py-3">
                <Leaf size={14} className="text-brand" />
                後續可擴充優惠券與文章
              </div>
            </div>
          </section>

          <section className="px-6 py-8 md:px-10 md:py-10">
            <div className="mb-8">
              <p className="text-[11px] tracking-[0.28em] text-brand">MANAGER SIGN IN</p>
              <h2 className="mt-2 font-serif-tc text-[34px] leading-tight text-text-primary">管理員登入</h2>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="username" className="mb-1.5 block text-xs text-text-secondary">帳號（Email）</label>
                <input
                  id="username"
                  type="email"
                  autoComplete="username"
                  placeholder="name@example.com"
                  className="h-11 w-full rounded-xl border border-brand-light/30 bg-white px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                  {...register('username', {
                    required: '請輸入 Email',
                    pattern: { value: /^\S+@\S+$/i, message: 'Email 格式不正確' },
                  })}
                />
                {errors.username ? (
                  <p className="mt-1 text-xs text-error">{errors.username.message}</p>
                ) : null}
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs text-text-secondary">密碼</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-brand-light/30 bg-white px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                  {...register('password', {
                    required: '請輸入密碼',
                    minLength: { value: 6, message: '密碼至少 6 碼' },
                  })}
                />
                {errors.password ? (
                  <p className="mt-1 text-xs text-error">{errors.password.message}</p>
                ) : null}
              </div>

              {authError ? (
                <div className="rounded-xl border border-error/25 bg-error/6 px-3 py-2 text-xs text-error">
                  {authError}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex h-11 w-full items-center justify-center rounded-full bg-brand text-sm font-medium tracking-wide text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? '登入中...' : '登入管理後台'}
              </button>
            </form>

            <div className="mt-8 pt-5 text-xs text-text-secondary">
              <Link to="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-brand-dark">
                <ArrowLeft size={14} />
                返回前台
              </Link>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
