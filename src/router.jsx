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
      { path: 'articles', element: renderPlaceholder('植物日誌') },
      { path: 'article/:id', element: renderPlaceholder('文章內容') },
      { path: 'about', element: renderPlaceholder('關於我們') },
    ],
  },
  { path: '/login', element: renderPlaceholder('管理員登入') },
  { path: '*', element: renderPlaceholder('404 — 找不到頁面') },
]);
