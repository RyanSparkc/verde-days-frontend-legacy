import axios from "axios";
import { useState } from "react";
import { useLocation, Link } from "react-router";
import { currency } from "../../utils/format";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function SingleProduct() {
  const location = useLocation();
  const product = location.state?.productData?.product;
  const [qty, setQty] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const addToCart = async () => {
    setIsAddingToCart(true);
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/cart`, {
        data: {
          product_id: product.id,
          qty,
        },
      });
      alert("已加入購物車");
    } catch (error) {
      console.error("加入購物車失敗", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!product) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-muted">沒有可用的產品資料。</p>
        <Link to="/products" className="btn btn-outline-secondary">
          返回商品列表
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Link to="/products" className="text-decoration-none mb-3 d-inline-block text-primary">
        &larr; 返回商品列表
      </Link>

      <div className="row mt-3">
        {/* 左側：商品圖片 */}
        <div className="col-md-6">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              className="img-fluid rounded"
              alt={product.title}
            />
          )}
        </div>

        {/* 右側：商品資訊 */}
        <div className="col-md-6">
          <span className="badge badge-brand mb-2">
            {product.category}
          </span>
          <h2>{product.title}</h2>
          <p className="text-muted">{product.description}</p>

          <div className="mb-3">
            <del className="text-muted me-2">
              NT$ {currency(product.origin_price)}
            </del>
            <span className="fs-4 fw-bold text-brand-dark">
              NT$ {currency(product.price)}
            </span>
          </div>

          <p className="text-muted small">
            單位：{product.unit}
          </p>

          {/* 數量選擇器 */}
          <div className="d-flex align-items-center mb-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setQty((prev) => Math.max(1, prev - 1))}
              disabled={isAddingToCart}
            >
              -
            </button>
            <span className="mx-3 fs-5">{qty}</span>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setQty((prev) => prev + 1)}
              disabled={isAddingToCart}
            >
              +
            </button>
          </div>

          <button
            className="btn btn-primary btn-lg w-100"
            onClick={addToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                />
                加入中...
              </>
            ) : (
              "加入購物車"
            )}
          </button>
        </div>
      </div>

      {/* 產品說明 */}
      {product.content && (
        <div className="mt-5">
          <h4>產品說明</h4>
          <p className="text-muted">{product.content}</p>
        </div>
      )}
    </div>
  );
}

export default SingleProduct;
