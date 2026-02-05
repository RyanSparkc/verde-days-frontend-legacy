import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Pagination from "../../component/Pagination";
import { currency } from "../../utils/format";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function Products() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [loadingProductId, setLoadingProductId] = useState(null);

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/products?page=${page}`
      );
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("取得產品資料失敗", error);
    }
  };

  const handleViewMore = async (id) => {
    setLoadingProductId(id);
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/product/${id}`
      );
      navigate(`/product/${id}`, { state: { productData: res.data } });
    } catch (error) {
      console.error("取得產品詳情失敗", error);
    } finally {
      setLoadingProductId(null);
    }
  };

  useEffect(() => {
    getProducts().finally(() => setIsPageLoading(false));
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
      <h2 className="mb-4">商品列表</h2>
      <div className="row">
        {products.map((product) => (
          <div className="col-sm-6 col-md-3 mb-4" key={product.id}>
            <div className="card h-100">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  className="card-img-top"
                  alt={product.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <div className="mb-2">
                  <span className="badge badge-brand">
                    {product.category}
                  </span>
                </div>
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text text-muted small">
                  {product.description}
                </p>
                <div className="mt-auto">
                  <del className="text-muted me-2">
                    NT$ {currency(product.origin_price)}
                  </del>
                  <span className="fw-bold text-brand-dark">
                    NT$ {currency(product.price)}
                  </span>
                </div>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => handleViewMore(product.id)}
                  disabled={loadingProductId === product.id}
                >
                  {loadingProductId === product.id ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                        aria-hidden="true"
                      />
                      載入中...
                    </>
                  ) : (
                    "查看更多"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination pagination={pagination} changePage={getProducts} />
    </div>
  );
}

export default Products;
