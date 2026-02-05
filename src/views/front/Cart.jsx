import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { currency } from "../../utils/format";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Cart() {
  const [cart, setCart] = useState({});
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const getCart = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (error) {
      console.error("取得購物車失敗", error);
    }
  };

  const deleteCartItem = async (id) => {
    setLoadingItemId(id);
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/cart/${id}`);
      await getCart();
    } catch (error) {
      console.error("刪除購物車項目失敗", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  const deleteCartAll = async () => {
    setLoadingItemId("all");
    try {
      await axios.delete(`${API_BASE}/api/${API_PATH}/carts`);
      await getCart();
    } catch (error) {
      console.error("清空購物車失敗", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  const updateCartItem = async (id, productId, qty) => {
    if (qty < 1) return;
    setLoadingItemId(id);
    try {
      await axios.put(`${API_BASE}/api/${API_PATH}/cart/${id}`, {
        data: {
          product_id: productId,
          qty,
        },
      });
      await getCart();
    } catch (error) {
      console.error("更新購物車失敗", error);
    } finally {
      setLoadingItemId(null);
    }
  };

  const onSubmit = async (data) => {
    if (!cart?.carts?.length) {
      alert("購物車沒有商品！");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/order`, {
        data: {
          user: {
            name: data.name,
            email: data.email,
            tel: data.tel,
            address: data.address,
          },
          message: data.message,
        },
      });
      alert("訂單已送出！");
      reset();
      await getCart();
    } catch (error) {
      console.error("送出訂單失敗", error);
      alert("送出訂單失敗：" + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getCart().finally(() => setIsPageLoading(false));
  }, []);

  if (isPageLoading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>購物車</h2>
        {cart?.carts?.length > 0 && (
          <button
            className="btn btn-outline-danger"
            type="button"
            onClick={deleteCartAll}
            disabled={loadingItemId === "all"}
          >
            {loadingItemId === "all" ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                />
                清除中...
              </>
            ) : (
              "清空購物車"
            )}
          </button>
        )}
      </div>

      {!cart?.carts || cart.carts.length === 0 ? (
        <p className="text-muted text-center py-5">購物車是空的</p>
      ) : (
        <table className="table align-middle">
          <thead>
            <tr>
              <th style={{ width: "80px" }}></th>
              <th>品名</th>
              <th style={{ width: "200px" }}>數量/單位</th>
              <th className="text-end" style={{ width: "150px" }}>單價</th>
            </tr>
          </thead>
          <tbody>
            {cart.carts.map((item) => (
              <tr key={item.id}>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => deleteCartItem(item.id)}
                    disabled={loadingItemId === item.id}
                  >
                    {loadingItemId === item.id ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      "刪除"
                    )}
                  </button>
                </td>
                <td>{item.product.title}</td>
                <td>
                  <div className="input-group input-group-sm">
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      value={item.qty}
                      disabled={loadingItemId === item.id}
                      onChange={(e) =>
                        updateCartItem(
                          item.id,
                          item.product_id,
                          Number(e.target.value)
                        )
                      }
                    />
                    <div className="input-group-text">
                      / {item.product.unit}
                    </div>
                  </div>
                </td>
                <td className="text-end">
                  {item.final_total !== item.total && (
                    <small className="text-success d-block">折扣價：</small>
                  )}
                  NT$ {currency(item.final_total)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end">
                總計
              </td>
              <td className="text-end">NT$ {currency(cart.total)}</td>
            </tr>
            {cart.final_total !== cart.total && (
              <tr>
                <td colSpan="3" className="text-end text-success">
                  折扣價
                </td>
                <td className="text-end text-success">
                  NT$ {currency(cart.final_total)}
                </td>
              </tr>
            )}
          </tfoot>
        </table>
      )}

      {/* 結帳表單 */}
      <div className="my-5 row justify-content-center">
        <form onSubmit={handleSubmit(onSubmit)} className="col-md-6">
          <h4 className="mb-3">結帳資訊</h4>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              type="text"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="請輸入姓名"
              {...register("name", { required: "請輸入收件人姓名。" })}
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="請輸入 Email"
              {...register("email", {
                required: "請輸入 Email。",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Email 格式不正確。",
                },
              })}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              type="tel"
              className={`form-control ${errors.tel ? "is-invalid" : ""}`}
              placeholder="請輸入電話"
              {...register("tel", {
                required: "請輸入收件人電話。",
                minLength: {
                  value: 8,
                  message: "電話號碼至少需要 8 碼。",
                },
                pattern: {
                  value: /^\d+$/,
                  message: "電話號碼格式不正確，僅限數字。",
                },
              })}
            />
            {errors.tel && (
              <div className="invalid-feedback">{errors.tel.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              type="text"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              placeholder="請輸入地址"
              {...register("address", { required: "請輸入收件人地址。" })}
            />
            {errors.address && (
              <div className="invalid-feedback">{errors.address.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              placeholder="留言（選填）"
              rows="3"
              {...register("message")}
            />
          </div>

          <div className="text-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  送出中...
                </>
              ) : (
                "送出訂單"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Cart;
