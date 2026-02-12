import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import { LayoutGrid, LogOut, NotebookPen, Package, ReceiptText, TicketPercent } from 'lucide-react';
import { checkAdminSession, logoutAdmin, normalizeAuthError } from '@/services/admin/authService';

const navItems = [
  { to: '/admin/products', label: '商品管理', icon: Package },
  { to: '/admin/orders', label: '訂單管理', icon: ReceiptText },
  { to: '/admin/coupons', label: '優惠券管理', icon: TicketPercent },
  { to: '/admin/articles', label: '文章管理', icon: NotebookPen },
];

function AdminShellLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-lg rounded-3xl border border-brand-light/20 bg-white/90 p-8 text-center">
        <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-brand-light/30 border-t-brand" />
        <p className="text-sm tracking-wide text-text-secondary">正在驗證管理員權限...</p>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      try {
        await checkAdminSession();
        if (active) setIsAuthReady(true);
      } catch {
        if (active) navigate('/login', { replace: true });
      }
    };

    verifySession();

    return () => {
      active = false;
    };
  }, [navigate]);

  const pageTitle = useMemo(() => {
    if (pathname.startsWith('/admin/products')) return '商品管理';
    if (pathname.startsWith('/admin/orders')) return '訂單管理';
    if (pathname.startsWith('/admin/coupons')) return '優惠券管理';
    if (pathname.startsWith('/admin/articles')) return '文章管理';
    return '後台管理';
  }, [pathname]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAdmin();
      navigate('/login', { replace: true });
    } catch (error) {
      window.alert(normalizeAuthError(error, '登出失敗，請稍後再試'));
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!isAuthReady) return <AdminShellLoader />;

  return (
    <div className="min-h-screen bg-cream pb-10">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 pt-5 pb-8 md:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-8">
        <aside className="rounded-3xl border border-brand-light/20 bg-white/90 p-5 lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:p-6">
          <div className="border-b border-brand-light/15 pb-5">
            <p className="text-[11px] tracking-[0.28em] text-brand">VERDE DAYS</p>
            <p className="mt-1 font-display text-[26px] text-brand-dark">Admin Atelier</p>
          </div>

          <nav className="mt-6 space-y-1.5">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition-all ${
                    isActive
                      ? 'border-brand-light/40 bg-brand-light/12 text-brand-dark'
                      : 'border-transparent text-text-secondary hover:border-brand-light/25 hover:bg-brand-light/8 hover:text-text-primary'
                  }`
                }
              >
                <Icon size={16} strokeWidth={1.7} className="text-brand" />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 space-y-2 border-t border-brand-light/15 pt-5 text-sm">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2 text-text-secondary transition-colors hover:bg-brand-light/10 hover:text-brand-dark"
            >
              <LayoutGrid size={15} strokeWidth={1.7} />
              返回前台
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-text-secondary transition-colors hover:bg-brand-light/10 hover:text-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogOut size={15} strokeWidth={1.7} />
              {isLoggingOut ? '登出中...' : '登出'}
            </button>
          </div>
        </aside>

        <section>
          <header className="rounded-3xl border border-brand-light/20 bg-white/92 px-6 py-5">
            <p className="text-[11px] tracking-[0.26em] text-brand">MANAGEMENT</p>
            <h1 className="mt-1 font-serif-tc text-3xl text-text-primary">{pageTitle}</h1>
          </header>

          <div className="mt-5">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}
