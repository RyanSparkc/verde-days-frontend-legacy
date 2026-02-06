import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createAsyncMessage } from "../../slice/messageReducer";
import Pagination from "../../component/Pagination";
import DeleteConfirmModal from "../../component/DeleteConfirmModal";
import { currency } from "../../utils/format";

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;

function AdminOrders() {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const getOrders = useCallback(async (page = 1) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/orders?page=${page}`
      );
      setOrders(res.data.orders);
      setPagination(res.data.pagination);
    } catch (err) {
      dispatch(
        createAsyncMessage(
          err.response?.data || { success: false, message: "取得訂單失敗" }
        )
      );
    }
  }, [dispatch]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  const togglePaidStatus = async (order) => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/${API_PATH}/admin/order/${order.id}`,
        {
          data: {
            ...order,
            is_paid: !order.is_paid,
          },
        }
      );
      dispatch(createAsyncMessage(res.data));
      await getOrders(pagination.current_page);
    } catch (err) {
      dispatch(
        createAsyncMessage(
          err.response?.data || { success: false, message: "更新訂單失敗" }
        )
      );
    }
  };

  const openDeleteModal = (order) => {
    setDeleteTarget(order);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const deleteOrder = async () => {
    if (!deleteTarget) return;
    try {
      const res = await axios.delete(
        `${API_BASE}/api/${API_PATH}/admin/order/${deleteTarget.id}`
      );
      dispatch(createAsyncMessage(res.data));
      setIsDeleteModalOpen(false);
      await getOrders(pagination.current_page);
    } catch (err) {
      dispatch(
        createAsyncMessage(
          err.response?.data || { success: false, message: "刪除訂單失敗" }
        )
      );
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <h2>訂單管理</h2>

      <table className="table mt-4">
        <thead>
          <tr>
            <th width="120">訂單編號</th>
            <th>客戶資訊</th>
            <th width="120">訂單金額</th>
            <th width="100">付款狀態</th>
            <th width="160">建立時間</th>
            <th width="150">操作</th>
          </tr>
        </thead>
        <tbody>
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <small className="text-muted">
                    {order.id.substring(0, 8)}...
                  </small>
                </td>
                <td>
                  <div>{order.user?.name || "未提供"}</div>
                  <small className="text-muted">{order.user?.email}</small>
                </td>
                <td className="text-end">
                  {currency(order.total)}
                </td>
                <td>
                  {order.is_paid ? (
                    <span className="badge bg-success">已付款</span>
                  ) : (
                    <span className="badge bg-secondary">未付款</span>
                  )}
                </td>
                <td>
                  <small>{formatDate(order.create_at)}</small>
                </td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      className={`btn btn-sm ${
                        order.is_paid
                          ? "btn-outline-secondary"
                          : "btn-outline-success"
                      }`}
                      onClick={() => togglePaidStatus(order)}
                    >
                      {order.is_paid ? "取消付款" : "標記已付款"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => openDeleteModal(order)}
                    >
                      刪除
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                尚無訂單資料
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination pagination={pagination} changePage={getOrders} />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={deleteOrder}
        modalTitle="刪除訂單"
        itemName={deleteTarget ? `訂單 ${deleteTarget.id.substring(0, 8)}...` : ""}
      />
    </>
  );
}

export default AdminOrders;
