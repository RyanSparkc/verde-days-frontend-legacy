import { createHashRouter } from 'react-router';
import FrontendLayout from './components/layout/FrontendLayout';
import Home from './pages/Home';

function Placeholder({ name }) {
  return (
    <div className="flex min-h-screen items-center justify-center font-display text-2xl text-brand">
      {name}
    </div>
  );
}

export const router = createHashRouter([
  {
    path: '/',
    element: <FrontendLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'products', element: <Placeholder name="所有植物" /> },
      { path: 'product/:id', element: <Placeholder name="商品詳情" /> },
      { path: 'cart', element: <Placeholder name="購物車" /> },
      { path: 'checkout/success/:orderId', element: <Placeholder name="結帳成功" /> },
      { path: 'orders', element: <Placeholder name="我的訂單" /> },
      { path: 'order/:id', element: <Placeholder name="訂單詳情" /> },
      { path: 'articles', element: <Placeholder name="植物日誌" /> },
      { path: 'article/:id', element: <Placeholder name="文章內容" /> },
      { path: 'about', element: <Placeholder name="關於我們" /> },
    ],
  },
  { path: '/login', element: <Placeholder name="管理員登入" /> },
  { path: '*', element: <Placeholder name="404 — 找不到頁面" /> },
]);
