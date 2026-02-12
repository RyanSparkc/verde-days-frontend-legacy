import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, PencilLine, Plus, TicketPercent, Trash2 } from 'lucide-react';
import AdminPagination from '@/components/admin/AdminPagination';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import CouponEditorDialog from '@/components/admin/CouponEditorDialog';
import {
  couponDefaultDraft,
  createAdminCoupon,
  deleteAdminCoupon,
  fetchAdminCoupons,
  normalizeCouponError,
  toCouponDraft,
  toCouponPayload,
  updateAdminCoupon,
} from '@/services/admin/couponsService';

const feedbackTone = {
  success: 'border-brand-light/30 bg-brand-light/12 text-brand-dark',
  error: 'border-error/25 bg-error/8 text-error',
};

const formatDate = (seconds) => {
  if (!seconds) return '--';
  const date = new Date(Number(seconds) * 1000);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

function CouponsSkeleton() {
  return (
    <div className="space-y-3 rounded-3xl border border-brand-light/20 bg-white/90 p-4 md:p-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-xl bg-brand-light/12" />
      ))}
    </div>
  );
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [feedback, setFeedback] = useState(null);

  const [editorMode, setEditorMode] = useState('create');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [draft, setDraft] = useState(couponDefaultDraft);
  const [editingId, setEditingId] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCoupons = async (page = 1) => {
    setIsLoading(true);
    setPageError('');

    try {
      const { coupons: list, pagination: pager } = await fetchAdminCoupons(page);
      setCoupons(list);
      setPagination(pager);
      setCurrentPage(page);
    } catch (error) {
      setPageError(normalizeCouponError(error, '載入優惠券失敗'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleChangeField = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const openCreateEditor = () => {
    setEditorMode('create');
    setDraft({ ...couponDefaultDraft });
    setEditingId('');
    setIsEditorOpen(true);
  };

  const openEditEditor = (coupon) => {
    setEditorMode('edit');
    setEditingId(coupon.id);
    setDraft(toCouponDraft(coupon));
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setIsSaving(false);
  };

  const validateDraft = () => {
    const payload = toCouponPayload(draft);

    if (!payload.title) return '請輸入優惠券名稱';
    if (!payload.code) return '請輸入優惠碼';
    if (payload.percent < 1 || payload.percent > 100) return '折扣請輸入 1-100';
    if (!draft.dueDate) return '請選擇到期日';

    return '';
  };

  const handleSubmit = async () => {
    const invalidMessage = validateDraft();
    if (invalidMessage) {
      setFeedback({ type: 'error', text: invalidMessage });
      return;
    }

    setIsSaving(true);

    try {
      if (editorMode === 'create') {
        await createAdminCoupon(draft);
        setFeedback({ type: 'success', text: '優惠券建立成功' });
      } else {
        await updateAdminCoupon(editingId, draft);
        setFeedback({ type: 'success', text: '優惠券更新成功' });
      }

      closeEditor();
      await loadCoupons(currentPage);
    } catch (error) {
      setFeedback({ type: 'error', text: normalizeCouponError(error, '儲存優惠券失敗') });
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteAdminCoupon(deleteTarget.id);
      setFeedback({ type: 'success', text: '優惠券已刪除' });
      setDeleteTarget(null);
      await loadCoupons(currentPage);
    } catch (error) {
      setFeedback({ type: 'error', text: normalizeCouponError(error, '刪除優惠券失敗') });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-text-secondary">優惠券管理</p>
          <p className="text-xs text-text-secondary/75">管理活動折扣碼、到期日與啟用狀態。</p>
        </div>
        <button
          type="button"
          onClick={openCreateEditor}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm text-white transition-colors hover:bg-brand-dark"
        >
          <Plus size={15} strokeWidth={1.8} />
          建立優惠券
        </button>
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
        <CouponsSkeleton />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-brand-light/20 bg-white/92">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-light/18 bg-brand-light/8 text-text-secondary">
                  <th className="px-4 py-3 font-medium">名稱 / 代碼</th>
                  <th className="px-4 py-3 text-right font-medium">折扣</th>
                  <th className="px-4 py-3 font-medium">到期日</th>
                  <th className="px-4 py-3 text-center font-medium">狀態</th>
                  <th className="px-4 py-3 text-right font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-text-secondary">目前沒有優惠券資料。</td>
                  </tr>
                ) : (
                  coupons.map((coupon) => (
                    <tr key={coupon.id} className="border-b border-brand-light/12 last:border-b-0">
                      <td className="px-4 py-3">
                        <p className="font-medium text-text-primary">{coupon.title}</p>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-brand-dark">
                          <TicketPercent size={12} strokeWidth={1.8} />
                          {coupon.code}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-text-primary">{coupon.percent}%</td>
                      <td className="px-4 py-3 text-text-secondary">{formatDate(coupon.due_date)}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs ${
                            coupon.is_enabled ? 'bg-brand-light/15 text-brand-dark' : 'bg-brand-light/8 text-text-secondary'
                          }`}
                        >
                          {coupon.is_enabled ? '啟用中' : '停用'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditEditor(coupon)}
                            className="inline-flex items-center gap-1 rounded-full border border-brand-light/35 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-brand-light/10 hover:text-text-primary"
                          >
                            <PencilLine size={12} strokeWidth={1.8} />
                            編輯
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(coupon)}
                            className="inline-flex items-center gap-1 rounded-full border border-error/35 px-3 py-1.5 text-xs text-error transition-colors hover:bg-error/8"
                          >
                            <Trash2 size={12} strokeWidth={1.8} />
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AdminPagination pagination={pagination} onChangePage={loadCoupons} />

      <CouponEditorDialog
        open={isEditorOpen}
        mode={editorMode}
        draft={draft}
        isSaving={isSaving}
        onChangeField={handleChangeField}
        onClose={closeEditor}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="刪除優惠券"
        description={`確定要刪除優惠券「${deleteTarget?.title || ''}」嗎？此操作無法復原。`}
        confirmText="確認刪除"
        isProcessing={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      {(isSaving || isDeleting) && (
        <div className="pointer-events-none fixed right-5 bottom-5 z-[95] inline-flex items-center gap-2 rounded-full border border-brand-light/30 bg-white/95 px-3 py-2 text-xs text-text-secondary">
          <Loader2 size={13} className="animate-spin" />
          正在同步資料...
        </div>
      )}
    </motion.div>
  );
}
