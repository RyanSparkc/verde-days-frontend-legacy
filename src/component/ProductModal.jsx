import { useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function ProductModal({
  isOpen,
  onClose,
  modalMode,
  tempProduct,
  onInputChange,
  onImageUrlChange,
  onAddImage,
  onRemoveImage,
  onSubmit,
  onProductChange,
}) {
  const modalRef = useRef(null);
  const modalElRef = useRef(null);
  const fileInputRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    modalRef.current = new Modal(modalElRef.current, {
      backdrop: "static",
    });

    const el = modalElRef.current;
    const handleHidden = () => onCloseRef.current();
    el.addEventListener("hidden.bs.modal", handleHidden);

    return () => {
      el.removeEventListener("hidden.bs.modal", handleHidden);
      modalRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      modalRef.current?.show();
    } else {
      modalRef.current?.hide();
    }
  }, [isOpen]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file-to-upload", file);

    try {
      const res = await axios.post(
        `${API_BASE}/api/${API_PATH}/admin/upload`,
        formData
      );
      const uploadedImageUrl = res.data.imageUrl;
      onProductChange((prev) => ({ ...prev, imageUrl: uploadedImageUrl }));
    } catch (err) {
      alert("圖片上傳失敗：" + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div
      className="modal fade"
      ref={modalElRef}
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title" id="productModalLabel">
              {modalMode === "create" ? "新增產品" : "編輯產品"}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={() => onCloseRef.current()}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              {/* 左欄：圖片管理 */}
              <div className="col-sm-4">
                {/* 圖片上傳 */}
                <div className="mb-3">
                  <label htmlFor="fileUpload" className="form-label">
                    圖片上傳
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="fileUpload"
                    accept=".jpg,.jpeg,.png"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
                <p className="text-muted text-center">or</p>
                {/* 主圖網址 */}
                <div className="mb-3">
                  <label htmlFor="imageUrl" className="form-label">
                    主圖網址
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="imageUrl"
                    name="imageUrl"
                    placeholder="請輸入圖片連結"
                    value={tempProduct.imageUrl}
                    onChange={onInputChange}
                  />
                </div>
                {tempProduct.imageUrl && (
                  <img
                    src={tempProduct.imageUrl}
                    className="img-fluid mb-3"
                    alt="主圖預覽"
                  />
                )}

                <h6>多圖管理</h6>
                {tempProduct.imagesUrl?.map((url, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="text"
                      className="form-control mb-1"
                      value={url}
                      onChange={(e) => onImageUrlChange(index, e.target.value)}
                      placeholder={`副圖 ${index + 1} 網址`}
                    />
                    {url && (
                      <img
                        src={url}
                        className="img-fluid mb-1"
                        alt={`副圖 ${index + 1}`}
                      />
                    )}
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm d-block w-100"
                      onClick={() => onRemoveImage(index)}
                    >
                      移除此圖
                    </button>
                  </div>
                ))}
                {tempProduct.imagesUrl.length < 5 &&
                  (tempProduct.imagesUrl.length === 0 ||
                    tempProduct.imagesUrl[
                      tempProduct.imagesUrl.length - 1
                    ] !== "") && (
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm d-block w-100 mt-1"
                      onClick={onAddImage}
                    >
                      新增圖片
                    </button>
                  )}
              </div>

              {/* 右欄：產品資訊 */}
              <div className="col-sm-8">
                {/* 標題 */}
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    placeholder="請輸入標題"
                    value={tempProduct.title}
                    onChange={onInputChange}
                  />
                </div>

                {/* 分類 + 單位 */}
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="category"
                      name="category"
                      placeholder="請輸入分類"
                      value={tempProduct.category}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="unit"
                      name="unit"
                      placeholder="請輸入單位"
                      value={tempProduct.unit}
                      onChange={onInputChange}
                    />
                  </div>
                </div>

                {/* 原價 + 售價 */}
                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      id="origin_price"
                      name="origin_price"
                      placeholder="請輸入原價"
                      value={tempProduct.origin_price}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      id="price"
                      name="price"
                      placeholder="請輸入售價"
                      value={tempProduct.price}
                      onChange={onInputChange}
                    />
                  </div>
                </div>

                <hr />

                {/* 描述 + 內容 */}
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="2"
                    placeholder="請輸入產品描述"
                    value={tempProduct.description}
                    onChange={onInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    className="form-control"
                    id="content"
                    name="content"
                    rows="3"
                    placeholder="請輸入說明內容"
                    value={tempProduct.content}
                    onChange={onInputChange}
                  ></textarea>
                </div>

                {/* 是否啟用 */}
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="is_enabled"
                    checked={!!tempProduct.is_enabled}
                    onChange={(e) => {
                      onProductChange((prev) => ({
                        ...prev,
                        is_enabled: e.target.checked ? 1 : 0,
                      }));
                    }}
                  />
                  <label className="form-check-label" htmlFor="is_enabled">
                    是否啟用
                  </label>
                </div>

                {/* ===== 自訂欄位 ===== */}
                <hr />
                <h6 className="text-muted mb-3">植物 / 商品自訂欄位</h6>

                {/* 照顧難度 + 光照 + 尺村 */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="careLevel" className="form-label">
                      照顧難度
                    </label>
                    <select
                      className="form-select"
                      id="careLevel"
                      name="careLevel"
                      value={tempProduct.careLevel}
                      onChange={onInputChange}
                    >
                      <option value="">請選擇</option>
                      <option value="easy">簡單 (Easy)</option>
                      <option value="medium">中等 (Medium)</option>
                      <option value="hard">困難 (Hard)</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="light" className="form-label">
                      光照需求
                    </label>
                    <select
                      className="form-select"
                      id="light"
                      name="light"
                      value={tempProduct.light}
                      onChange={onInputChange}
                    >
                      <option value="">請選擇</option>
                      <option value="low">低光 (Low)</option>
                      <option value="medium">中光 (Medium)</option>
                      <option value="bright">明亮 (Bright)</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="size" className="form-label">
                      尺寸
                    </label>
                    <select
                      className="form-select"
                      id="size"
                      name="size"
                      value={tempProduct.size}
                      onChange={onInputChange}
                    >
                      <option value="">請選擇</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                    </select>
                  </div>
                </div>

                {/* 澆水 + 高度 + 原產地 */}
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="water" className="form-label">
                      澆水頻率
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="water"
                      name="water"
                      placeholder="例: 每週 1 次"
                      value={tempProduct.water}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="height" className="form-label">
                      含盆高度
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="height"
                      name="height"
                      placeholder="例: 40-50cm"
                      value={tempProduct.height}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="origin" className="form-label">
                      原產地
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="origin"
                      name="origin"
                      placeholder="例: 墨西哥"
                      value={tempProduct.origin}
                      onChange={onInputChange}
                    />
                  </div>
                </div>

                {/* 材質 + 內含物 */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="material" className="form-label">
                      材質 <small className="text-muted">(配件用)</small>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="material"
                      name="material"
                      placeholder="例: 陶、水泥"
                      value={tempProduct.material}
                      onChange={onInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="includes" className="form-label">
                      內含物 <small className="text-muted">(禮盒用)</small>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="includes"
                      name="includes"
                      placeholder="例: 龜背芋、陶盆、照顧卡"
                      value={tempProduct.includes}
                      onChange={onInputChange}
                    />
                  </div>
                </div>

                {/* 寵物安全 */}
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="petFriendly"
                    name="petFriendly"
                    checked={tempProduct.petFriendly}
                    onChange={onInputChange}
                  />
                  <label className="form-check-label" htmlFor="petFriendly">
                    寵物安全
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => onCloseRef.current()}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onSubmit}
            >
              {modalMode === "create" ? "新增產品" : "儲存變更"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
