import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, PencilLine, Plus, Trash2 } from 'lucide-react';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ProductEditorDialog from '@/components/admin/ProductEditorDialog';
import AdminPagination from '@/components/admin/AdminPagination';
import {
  createAdminProduct,
  deleteAdminProduct,
  fetchAdminProducts,
  normalizeProductError,
  productDefaultDraft,
  toProductDraft,
  updateAdminProduct,
  uploadAdminImage,
} from '@/services/admin/productsService';
import { currency } from '@/utils/format';

const feedbackTone = {
  success: 'border-brand-light/30 bg-brand-light/12 text-brand-dark',
  error: 'border-error/25 bg-error/8 text-error',
};

function ProductsSkeleton() {
  return (
    <div className="space-y-3 rounded-3xl border border-brand-light/20 bg-white/90 p-4 md:p-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-xl bg-brand-light/12" />
      ))}
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [feedback, setFeedback] = useState(null);

  const [editorMode, setEditorMode] = useState('create');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [draft, setDraft] = useState(productDefaultDraft);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingSub, setIsUploadingSub] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const clearFeedback = () => setFeedback(null);

  const loadProducts = async (page = 1) => {
    setIsLoading(true);
    setPageError('');

    try {
      const { products: list, pagination: pager } = await fetchAdminProducts(page);
      setProducts(list);
      setPagination(pager);
      setCurrentPage(page);
    } catch (error) {
      setPageError(normalizeProductError(error, '載入商品列表失敗'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateEditor = () => {
    clearFeedback();
    setEditorMode('create');
    setDraft({ ...productDefaultDraft });
    setIsEditorOpen(true);
  };

  const openEditEditor = (product) => {
    clearFeedback();
    setEditorMode('edit');
    setDraft(toProductDraft(product));
    setIsEditorOpen(true);
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setIsSaving(false);
  };

  const handleChangeField = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeImage = (index, value) => {
    setDraft((prev) => {
      const next = [...prev.imagesUrl];
      next[index] = value;
      return { ...prev, imagesUrl: next };
    });
  };

  const handleAddSubImage = () => {
    setDraft((prev) => {
      if (prev.imagesUrl.length >= 5) return prev;
      return { ...prev, imagesUrl: [...prev.imagesUrl, ''] };
    });
  };

  const handleRemoveSubImage = (index) => {
    setDraft((prev) => ({
      ...prev,
      imagesUrl: prev.imagesUrl.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleUploadMain = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingMain(true);
    try {
      const imageUrl = await uploadAdminImage(file);
      setDraft((prev) => ({ ...prev, imageUrl }));
      setFeedback({ type: 'success', text: '主圖上傳成功' });
    } catch (error) {
      setFeedback({ type: 'error', text: normalizeProductError(error, '主圖上傳失敗') });
    } finally {
      setIsUploadingMain(false);
      event.target.value = '';
    }
  };

  const handleUploadSub = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploadingSub(true);
    let successCount = 0;

    try {
      for (const file of files) {
        const canAppend = draft.imagesUrl.length + successCount < 5;
        if (!canAppend) break;
        const imageUrl = await uploadAdminImage(file);
        setDraft((prev) => ({ ...prev, imagesUrl: [...prev.imagesUrl, imageUrl].slice(0, 5) }));
        successCount += 1;
      }

      if (successCount > 0) {
        setFeedback({ type: 'success', text: `已上傳 ${successCount} 張副圖` });
      }
    } catch (error) {
      setFeedback({ type: 'error', text: normalizeProductError(error, '副圖上傳失敗') });
    } finally {
      setIsUploadingSub(false);
      event.target.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!draft.title.trim()) {
      setFeedback({ type: 'error', text: '請輸入商品名稱' });
      return;
    }

    setIsSaving(true);
    try {
      if (editorMode === 'create') {
        await createAdminProduct(draft);
        setFeedback({ type: 'success', text: '商品建立成功' });
      } else {
        await updateAdminProduct(draft.id, draft);
        setFeedback({ type: 'success', text: '商品更新成功' });
      }

      closeEditor();
      await loadProducts(currentPage);
    } catch (error) {
      setFeedback({ type: 'error', text: normalizeProductError(error, '儲存商品失敗') });
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteAdminProduct(deleteTarget.id);
      setFeedback({ type: 'success', text: '商品已刪除' });
      setDeleteTarget(null);
      await loadProducts(currentPage);
    } catch (error) {
      setFeedback({ type: 'error', text: normalizeProductError(error, '刪除商品失敗') });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-secondary">維護商品資料、售價與上架狀態。</p>
        <button
          type="button"
          onClick={openCreateEditor}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm text-white transition-colors hover:bg-brand-dark"
        >
          <Plus size={15} strokeWidth={1.8} />
          建立商品
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
        <ProductsSkeleton />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-brand-light/20 bg-white/92">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-light/16 bg-brand-light/6 px-4 py-3">
            <p className="text-sm font-medium text-text-primary">商品列表</p>
            <p className="text-xs text-text-secondary">
              第 {pagination?.current_page || currentPage} 頁 / 共 {pagination?.total_pages || 1} 頁
            </p>
          </div>

          {products.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-text-secondary">目前沒有商品資料。</div>
          ) : (
            <>
              <div className="divide-y divide-brand-light/12 md:hidden">
                {products.map((product) => (
                  <article key={product.id} className="space-y-3 px-4 py-4">
                    <div className="flex items-start gap-3">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="h-14 w-14 rounded-lg border border-brand-light/18 object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-brand-light/18 bg-brand-light/10 text-[10px] text-text-secondary">
                          無圖
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-medium text-text-primary">{product.title}</p>
                        <p className="mt-1 text-xs text-text-secondary/80">{product.unit}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-brand-light/8 px-3 py-2 text-xs">
                      <p className="text-text-secondary">分類：{product.category}</p>
                      <p className="text-right text-text-secondary">原價：NT${currency(product.origin_price)}</p>
                      <p className="font-medium text-text-primary">售價：NT${currency(product.price)}</p>
                      <p className="text-right">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] ${
                            product.is_enabled ? 'bg-brand-light/15 text-brand-dark' : 'bg-brand-light/8 text-text-secondary'
                          }`}
                        >
                          {product.is_enabled ? '已上架' : '未上架'}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditEditor(product)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-brand-light/35 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-brand-light/10 hover:text-text-primary"
                      >
                        <PencilLine size={12} strokeWidth={1.8} />
                        編輯
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(product)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-error/35 px-3 py-1.5 text-xs text-error transition-colors hover:bg-error/8"
                      >
                        <Trash2 size={12} strokeWidth={1.8} />
                        刪除
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-brand-light/18 bg-brand-light/8 text-text-secondary">
                      <th className="px-4 py-3 font-medium">商品</th>
                      <th className="px-4 py-3 font-medium">分類</th>
                      <th className="px-4 py-3 text-right font-medium">售價</th>
                      <th className="px-4 py-3 text-right font-medium">原價</th>
                      <th className="px-4 py-3 text-center font-medium">狀態</th>
                      <th className="px-4 py-3 text-right font-medium">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-brand-light/12 last:border-b-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {product.imageUrl ? (
                              <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="h-12 w-12 rounded-lg border border-brand-light/18 object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-brand-light/18 bg-brand-light/10 text-[10px] text-text-secondary">
                                無圖
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-text-primary">{product.title}</p>
                              <p className="text-xs text-text-secondary/80">{product.unit}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">{product.category}</td>
                        <td className="px-4 py-3 text-right font-medium text-text-primary">NT${currency(product.price)}</td>
                        <td className="px-4 py-3 text-right text-text-secondary">NT${currency(product.origin_price)}</td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs ${
                              product.is_enabled ? 'bg-brand-light/15 text-brand-dark' : 'bg-brand-light/8 text-text-secondary'
                            }`}
                          >
                            {product.is_enabled ? '已上架' : '未上架'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditEditor(product)}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-brand-light/35 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-brand-light/10 hover:text-text-primary"
                            >
                              <PencilLine size={12} strokeWidth={1.8} />
                              編輯
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(product)}
                              className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-error/35 px-3 py-1.5 text-xs text-error transition-colors hover:bg-error/8"
                            >
                              <Trash2 size={12} strokeWidth={1.8} />
                              刪除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      <AdminPagination pagination={pagination} onChangePage={loadProducts} />

      <ProductEditorDialog
        open={isEditorOpen}
        mode={editorMode}
        draft={draft}
        isSaving={isSaving}
        isUploadingMain={isUploadingMain}
        isUploadingSub={isUploadingSub}
        onChangeField={handleChangeField}
        onChangeImage={handleChangeImage}
        onAddSubImage={handleAddSubImage}
        onRemoveSubImage={handleRemoveSubImage}
        onUploadMain={handleUploadMain}
        onUploadSub={handleUploadSub}
        onClose={closeEditor}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="刪除商品"
        description={`確定要刪除「${deleteTarget?.title || ''}」嗎？此操作無法復原。`}
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
