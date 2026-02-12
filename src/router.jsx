import { createElement, lazy, Suspense } from 'react';
import { createHashRouter } from 'react-router';
import FrontendLayout from './components/layout/FrontendLayout';

const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CheckoutSuccess = lazy(() => import('./pages/CheckoutSuccess'));
const Orders = lazy(() => import('./pages/Orders'));
const OrderDetail = lazy(() => import('./pages/OrderDetail'));
const About = lazy(() => import('./pages/About'));
const Articles = lazy(() => import('./pages/Articles'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));

const routeFallback = (
  <div className="flex min-h-screen items-center justify-center font-display text-xl text-brand">
    載入中...
  </div>
);

const renderPlaceholder = (name) => (
  <div className="flex min-h-screen items-center justify-center font-display text-2xl text-brand">
    {name}
  </div>
);

const withRouteSuspense = (PageComponent) => {
  return (
    <Suspense fallback={routeFallback}>
      {createElement(PageComponent)}
    </Suspense>
  );
};

export const router = createHashRouter([
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
      { index: true, element: withRouteSuspense(Home) },
      { path: 'products', element: withRouteSuspense(Products) },
      { path: 'product/:id', element: withRouteSuspense(ProductDetail) },
      { path: 'cart', element: withRouteSuspense(Cart) },
      { path: 'checkout', element: withRouteSuspense(Checkout) },
      { path: 'checkout/success/:orderId', element: withRouteSuspense(CheckoutSuccess) },
      { path: 'orders', element: withRouteSuspense(Orders) },
      { path: 'order/:id', element: withRouteSuspense(OrderDetail) },
      { path: 'articles', element: withRouteSuspense(Articles) },
      { path: 'article/:id', element: withRouteSuspense(ArticleDetail) },
      { path: 'about', element: withRouteSuspense(About) },
    ],
  },
  { path: '/login', element: renderPlaceholder('管理員登入') },
  { path: '*', element: renderPlaceholder('404 — 找不到頁面') },
]);
