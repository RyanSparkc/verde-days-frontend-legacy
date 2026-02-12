import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, ShieldCheck, ShieldX, Trash2 } from 'lucide-react';
import AdminPagination from '@/components/admin/AdminPagination';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { deleteAdminOrder, fetchAdminOrders, normalizeOrderError, updateAdminOrder } from '@/services/admin/ordersService';
import { currency } from '@/utils/format';

const feedbackTone = {
  success: 'border-brand-light/30 bg-brand-light/12 text-brand-dark',
  error: 'border-error/25 bg-error/8 text-error',
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return '--';
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

function OrdersSkeleton() {
  return (
    <div className="space-y-3 rounded-3xl border border-brand-light/20 bg-white/90 p-4 md:p-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-xl bg-brand-light/12" />
      ))}
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [feedback, setFeedback] = useState(null);

  const [processingOrderId, setProcessingOrderId] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadOrders = async (page = 1) => {
    setIsLoading(true);
    setPageError('');

    try {
      const { orders: list, pagination: pager } = await fetchAdminOrders(page);
      setOrders(list);
      setPagination(pager);
      setCurrentPage(page);
    } catch (error) {
      setPageError(normalizeOrderError(error, '載入訂單列表失敗'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleTogglePaid = async (order) => {
    setProcessingOrderId(order.id);

    try {
      await updateAdminOrder({ ...order, is_paid: !order.is_paid });
      setFeedback({ type: 'success', text: order.is_paid ? '已取消付款標記' : '已標記為付款完成' });
      await loadOrders(currentPage);
    } catch (error) {
      setFeedback({ type: 'error', text: normalizeOrderError(error, '更新付款狀態失敗') });
    } finally {
      setProcessingOrderId('');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteAdminOrder(deleteTarget.id);
      setFeedback({ type: 'success', text: '訂單已刪除' });
      setDeleteTarget(null);
      await loadOrders(currentPage);
    } catch (error) {
      setFeedback({ type: 'error', text: normalizeOrderError(error, '刪除訂單失敗') });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="mb-4">
        <p className="text-sm text-text-secondary">查看付款狀態、客戶資訊與訂單金額。</p>
      </div>

      {feedback && (
        <div className={`mb-4 rounded-2xl border px-4 py-3 text-sm ${feedbackTone[feedback.type]}`}>
          {feedback.text}
        </div>
      )}

      {pageError && (
        <div className="mb-4 rounded-2xl border border-error/25 bg-error/8 px-4 py-3 text-sm text-error">
          {pageError}
        </div>
      )}

      {isLoading ? (
        <OrdersSkeleton />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-brand-light/20 bg-white/92">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-light/18 bg-brand-light/8 text-text-secondary">
                  <th className="px-4 py-3 font-medium">訂單編號</th>
                  <th className="px-4 py-3 font-medium">客戶</th>
                  <th className="px-4 py-3 text-right font-medium">金額</th>
                  <th className="px-4 py-3 text-center font-medium">付款狀態</th>
                  <th className="px-4 py-3 font-medium">建立時間</th>
                  <th className="px-4 py-3 text-right font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-text-secondary">目前沒有訂單資料。</td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const isProcessing = processingOrderId === order.id;
                    return (
                      <tr key={order.id} className="border-b border-brand-light/12 last:border-b-0">
                        <td className="px-4 py-3 font-mono text-xs text-text-secondary">{order.id}</td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-text-primary">{order.user?.name || '未提供姓名'}</p>
                          <p className="text-xs text-text-secondary/80">{order.user?.email || '未提供 Email'}</p>
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-text-primary">
                          NT${currency(order.final_total ?? order.total ?? 0)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
                              order.is_paid ? 'bg-brand-light/15 text-brand-dark' : 'bg-brand-light/7 text-text-secondary'
                            }`}
                          >
                            {order.is_paid ? <ShieldCheck size={12} strokeWidth={1.8} /> : <ShieldX size={12} strokeWidth={1.8} />}
                            {order.is_paid ? '已付款' : '未付款'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-text-secondary">{formatDateTime(order.create_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleTogglePaid(order)}
                              disabled={isProcessing}
                              className="inline-flex items-center gap-1 rounded-full border border-brand-light/35 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-brand-light/10 hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-55"
                            >
                              {isProcessing ? <Loader2 size={12} className="animate-spin" /> : <ShieldCheck size={12} strokeWidth={1.8} />}
                              {order.is_paid ? '取消付款' : '標記付款'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(order)}
                              className="inline-flex items-center gap-1 rounded-full border border-error/35 px-3 py-1.5 text-xs text-error transition-colors hover:bg-error/8"
                            >
                              <Trash2 size={12} strokeWidth={1.8} />
                              刪除
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdminPagination pagination={pagination} onChangePage={loadOrders} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="刪除訂單"
        description={`確定要刪除訂單「${deleteTarget?.id || ''}」嗎？此操作無法復原。`}
        confirmText="確認刪除"
        isProcessing={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      {(processingOrderId || isDeleting) && (
        <div className="pointer-events-none fixed right-5 bottom-5 z-[95] inline-flex items-center gap-2 rounded-full border border-brand-light/30 bg-white/95 px-3 py-2 text-xs text-text-secondary">
          <Loader2 size={13} className="animate-spin" />
          正在同步資料...
        </div>
      )}
    </motion.div>
  );
}
