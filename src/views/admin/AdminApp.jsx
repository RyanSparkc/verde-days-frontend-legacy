import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Pagination from "../../component/Pagination";
import DeleteConfirmModal from "../../component/DeleteConfirmModal";
import ProductModal from "../../component/ProductModal";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

const defaultProduct = {
  title: "",
  category: "",
  unit: "",
  origin_price: 0,
  price: 0,
  description: "",
  content: "",
  is_enabled: 0,
  imageUrl: "",
  imagesUrl: [],
  // 自訂欄位
  careLevel: "",
  light: "",
  water: "",
  petFriendly: false,
  size: "",
  height: "",
  origin: "",
  material: "",
  includes: "",
};

function AdminApp() {
  const navigate = useNavigate();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});

  // Modal 相關
  const [tempProduct, setTempProduct] = useState({ ...defaultProduct });
  const [modalMode, setModalMode] = useState("create");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // ========== 產品 API ==========

  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    }
  };

  // 初始化檢查 Token，失敗導向登入頁
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (!token) {
      navigate("/login");
      return;
    }
    axios.defaults.headers.common["Authorization"] = token;
    async function checkAuth() {
      try {
        await axios.post(`${API_BASE}/api/user/check`);
        await getProducts();
        setIsAuthChecked(true);
      } catch (err) {
        console.error(err);
        navigate("/login");
      }
    }
    checkAuth();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE}/logout`);
    } catch (err) {
      console.error(err);
    }
    document.cookie =
      "hexToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    delete axios.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  const createProduct = async () => {
    try {
      await axios.post(`${API_BASE}/api/${API_PATH}/admin/product`, {
        data: {
          ...tempProduct,
          origin_price: Number(tempProduct.origin_price),
          price: Number(tempProduct.price),
          is_enabled: tempProduct.is_enabled ? 1 : 0,
        },
      });
      setIsProductModalOpen(false);
      await getProducts(1);
    } catch (err) {
      alert("新增產品失敗：" + (err.response?.data?.message || err.message));
    }
  };

  const updateProduct = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/${API_PATH}/admin/product/${tempProduct.id}`,
        {
          data: {
            ...tempProduct,
            origin_price: Number(tempProduct.origin_price),
            price: Number(tempProduct.price),
            is_enabled: tempProduct.is_enabled ? 1 : 0,
          },
        }
      );
      setIsProductModalOpen(false);
      await getProducts(pagination.current_page);
    } catch (err) {
      alert("更新產品失敗：" + (err.response?.data?.message || err.message));
    }
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/product/${deleteTarget.id}`
      );
      setIsDeleteModalOpen(false);
      await getProducts(pagination.current_page);
    } catch (err) {
      alert("刪除產品失敗：" + (err.response?.data?.message || err.message));
    }
  };

  const handleProductSubmit = () => {
    if (modalMode === "create") {
      createProduct();
    } else {
      updateProduct();
    }
  };

  // ====== Modal 開啟 ======

  const openProductModal = (mode, product = null) => {
    setModalMode(mode);
    if (mode === "edit" && product) {
      setTempProduct({
        ...defaultProduct,
        ...product,
        origin_price: Number(product.origin_price),
        price: Number(product.price),
        imagesUrl: product.imagesUrl || [],
        petFriendly: product.petFriendly || false,
      });
    } else {
      setTempProduct({ ...defaultProduct });
    }
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
  };

  const openDeleteModal = (product) => {
    setDeleteTarget(product);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  // ==== 表單 Handler ==========

  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempProduct((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  // 圖片管理
  const handleImageUrlChange = (index, value) => {
    setTempProduct((prev) => {
      const newImagesUrl = [...prev.imagesUrl];
      newImagesUrl[index] = value;
      return { ...prev, imagesUrl: newImagesUrl };
    });
  };

  const addImageUrl = () => {
    setTempProduct((prev) => ({
      ...prev,
      imagesUrl: [...prev.imagesUrl, ""],
    }));
  };

  const removeImageUrl = (index) => {
    setTempProduct((prev) => ({
      ...prev,
      imagesUrl: prev.imagesUrl.filter((_, i) => i !== index),
    }));
  };

  // ===== Render ==========

  if (!isAuthChecked) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* 標題列 */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <h2>產品列表</h2>
        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => openProductModal("create")}
          >
            建立新的產品
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={handleLogout}
          >
            登出
          </button>
        </div>
      </div>

      {/* 產品表格 */}
      <table className="table mt-4">
        <thead>
          <tr>
            <th width="120">分類</th>
            <th>產品名稱</th>
            <th width="120">原價</th>
            <th width="120">售價</th>
            <th width="100">是否啟用</th>
            <th width="120">編輯</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((item) => (
              <tr key={item.id}>
                <td>{item.category}</td>
                <td>{item.title}</td>
                <td className="text-end">{item.origin_price}</td>
                <td className="text-end">{item.price}</td>
                <td>
                  {item.is_enabled ? (
                    <span className="text-success">啟用</span>
                  ) : (
                    <span>未啟用</span>
                  )}
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => openProductModal("edit", item)}
                    >
                      編輯
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => openDeleteModal(item)}
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">尚無產品資料</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination pagination={pagination} changePage={getProducts} />

      {/* ===== 產品 Modal ===== */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={closeProductModal}
        modalMode={modalMode}
        tempProduct={tempProduct}
        onInputChange={handleModalInputChange}
        onImageUrlChange={handleImageUrlChange}
        onAddImage={addImageUrl}
        onRemoveImage={removeImageUrl}
        onSubmit={handleProductSubmit}
        onProductChange={setTempProduct}
      />

      {/* ===== 刪除確認 Modal ===== */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteProduct}
        productTitle={deleteTarget?.title || ""}
      />
    </div>
  );
}

export default AdminApp;
