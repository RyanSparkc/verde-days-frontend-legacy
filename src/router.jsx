import { createHashRouter } from "react-router";

import FrontendLayout from "./layout/FrontendLayout";
import Home from "./views/front/Home";
import Products from "./views/front/Products";
import SingleProduct from "./views/front/SingleProduct";
import Cart from "./views/front/Cart";
import NotFound from "./views/front/NotFound";
import Login from "./views/Login";

import AdminLayout from "./layout/AdminLayout";
import AdminProducts from "./views/admin/AdminProducts";
import AdminOrders from "./views/admin/AdminOrders";

export const router = createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminProducts />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
