import { Link } from 'react-router';
import { Leaf } from 'lucide-react';

const quickLinks = [
  { to: '/products', label: '所有植物' },
  { to: '/orders', label: '我的訂單' },
  { to: '/articles', label: '植物日誌' },
  { to: '/about', label: '關於我們' },
  { to: '/cart', label: '購物車' },
];

const categories = [
  { to: '/products?category=foliage', label: '觀葉植物' },
  { to: '/products?category=succulent', label: '多肉植物' },
  { to: '/products?category=airplant', label: '空氣鳳梨' },
  { to: '/products?category=giftset', label: '植栽禮盒' },
  { to: '/products?category=accessories', label: '盆器配件' },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#43513a] text-white/80">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_0%,rgba(196,164,132,0.12),transparent_42%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/22 to-transparent" />
      <div className="pointer-events-none absolute -top-24 right-6 h-56 w-56 rounded-full bg-brand-light/12 blur-3xl" />

      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.9fr_0.9fr] md:gap-12">
          {/* 品牌區 */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2">
              <Leaf size={20} className="text-brand-light" strokeWidth={1.5} />
              <span className="font-display text-2xl font-semibold tracking-wide text-white">
                Verde Days
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
              讓綠意，住進日常。
              <br />
              我們精選每一盆植物，為你的空間帶來自然的溫度與生命力。
            </p>
          </div>

          {/* 快速連結 */}
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/45">
              快速連結
            </h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/62 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 植物分類 */}
          <div>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/45">
              植物分類
            </h3>
            <ul className="mt-4 space-y-2.5">
              {categories.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-white/62 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 底部分隔 */}
        <div className="mt-12 border-t border-white/12 pt-7">
          <p className="text-center text-xs tracking-[0.06em] text-white/40">
            © {new Date().getFullYear()} Verde Days 綠日子. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
