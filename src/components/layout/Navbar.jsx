import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Menu, X, UserRound } from 'lucide-react';

const navLinks = [
  { to: '/', label: '首頁' },
  { to: '/products', label: '所有植物' },
  { to: '/orders', label: '我的訂單' },
  { to: '/articles', label: '植物日誌' },
  { to: '/about', label: '關於我們' },
];

function NavItem({ to, label, onClick, light }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative py-1 text-sm tracking-wide transition-colors duration-300 ${
          light
            ? isActive ? 'text-white' : 'text-white/70 hover:text-white'
            : isActive ? 'text-brand-dark' : 'text-text-secondary hover:text-text-primary'
        }`
      }
    >
      {label}
      <span className={`absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-500 ease-out group-hover:w-full ${light ? 'bg-white/50' : 'bg-brand-light'}`} />
    </NavLink>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const isHome = pathname === '/';
  const light = isHome && !scrolled;

  const cartItems = useSelector((state) => state.cart?.cart?.carts ?? []);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 手機選單開啟時鎖定 body 捲動
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-brand-light/20 bg-cream/80 backdrop-blur-md'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:h-20 lg:px-8">
          {/* Logo */}
          <Link to="/" className="relative z-10">
            <span className={`font-display text-2xl font-semibold tracking-wide transition-colors duration-300 lg:text-3xl ${light ? 'text-white' : 'text-brand-dark'}`}>
              Verde Days
            </span>
          </Link>

          {/* Desktop nav — 中間導航 */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <NavItem key={link.to} {...link} light={light} />
            ))}
          </div>

          {/* 右側 icon 群組 */}
          <div className="flex items-center gap-3">
            {/* 購物車 */}
            <Link
              to="/cart"
              className={`relative p-2 transition-colors duration-300 ${light ? 'text-white/70 hover:text-white' : 'text-text-secondary hover:text-brand-dark'}`}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key="badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand text-[10px] font-medium text-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* 登入 */}
            <Link
              to="/login"
              className={`hidden p-2 transition-colors duration-300 md:block ${light ? 'text-white/70 hover:text-white' : 'text-text-secondary hover:text-brand-dark'}`}
            >
              <UserRound size={20} strokeWidth={1.5} />
            </Link>

            {/* Mobile 漢堡按鈕 */}
            <button
              onClick={() => setMobileOpen(true)}
              className={`p-2 transition-colors duration-300 md:hidden ${light ? 'text-white/70 hover:text-white' : 'text-text-secondary hover:text-brand-dark'}`}
              aria-label="開啟選單"
            >
              <Menu size={22} strokeWidth={1.5} />
            </button>
          </div>
        </nav>

        {/* 底部極細分隔線 — 滾動後才顯示 */}
        <div
          className={`h-px transition-opacity duration-500 ${
            scrolled ? 'bg-brand-light/30 opacity-100' : 'opacity-0'
          }`}
        />
      </header>

      {/* ========== Mobile 側邊選單 ========== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 z-50 flex h-full w-72 flex-col border-l border-brand-light/20 bg-cream"
            >
              {/* 關閉按鈕 */}
              <div className="flex h-16 items-center justify-end px-6">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-text-secondary transition-colors hover:text-brand-dark"
                  aria-label="關閉選單"
                >
                  <X size={22} strokeWidth={1.5} />
                </button>
              </div>

              {/* 導航連結 */}
              <nav className="flex flex-col gap-1 px-6 pt-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <NavLink
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block rounded-lg px-4 py-3 text-base transition-colors ${
                          isActive
                            ? 'bg-brand-light/20 font-medium text-brand-dark'
                            : 'text-text-secondary hover:bg-brand-light/10 hover:text-text-primary'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              {/* 底部登入連結 */}
              <div className="mt-auto border-t border-brand-light/20 px-6 py-6">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 text-sm text-text-secondary transition-colors hover:text-brand-dark"
                >
                  <UserRound size={18} strokeWidth={1.5} />
                  管理員登入
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
