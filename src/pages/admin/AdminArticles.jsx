import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { BookOpenText, Eye, EyeOff, Loader2, PencilLine, Plus, Trash2, UploadCloud } from 'lucide-react';
import AdminPagination from '@/components/admin/AdminPagination';
import ArticleEditorDialog from '@/components/admin/ArticleEditorDialog';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import {
  articleDefaultDraft,
  createAdminArticle,
  deleteAdminArticle,
  fetchAdminArticleById,
  fetchAdminArticles,
  normalizeArticleError,
  toArticleDraft,
  updateAdminArticle,
} from '@/services/admin/articlesService';
import { uploadAdminImage } from '@/services/admin/productsService';

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

function ArticlesSkeleton() {
  return (
    <div className="space-y-3 rounded-3xl border border-brand-light/20 bg-white/90 p-4 md:p-5">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-xl bg-brand-light/12" />
      ))}
    </div>
  );
}

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [feedback, setFeedback] = useState(null);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState('create');
  const [draft, setDraft] = useState(articleDefaultDraft);
  const [editingId, setEditingId] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [processingArticleId, setProcessingArticleId] = useState('');

  const stats = useMemo(() => {
    const total = articles.length;
    const published = articles.filter((article) => article.isPublic).length;
    return {
      total,
      published,
      draft: total - published,
    };
  }, [articles]);

  const loadArticles = async (page = 1) => {
    setIsLoading(true);
    setPageError('');

    try {
      const { articles: list, pagination: pager } = await fetchAdminArticles(page);
      setArticles(list);
      setPagination(pager);
      setCurrentPage(page);
    } catch (error) {
      setPageError(normalizeArticleError(error, '載入文章列表失敗'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleChangeField = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const openCreateEditor = () => {
    setEditorMode('create');
    setEditingId('');
    setDraft({
      ...articleDefaultDraft,
      createAtDate: new Date().toISOString().slice(0, 10),
    });
    setIsEditorOpen(true);
  };

  const openEditEditor = async (articleId) => {
    setEditorMode('edit');
    setEditingId(articleId);
    setIsSaving(true);

    try {
      const article = await fetchAdminArticleById(articleId);
      setDraft(toArticleDraft(article));
      setIsEditorOpen(true);
    } catch (error) {
      setFeedback({ type: 'error', text: normalizeArticleError(error, '載入文章詳情失敗') });
    } finally {
      setIsSaving(false);
    }
  };

  const closeEditor = () => {
    setIsEditorOpen(false);
    setIsSaving(false);
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const imageUrl = await uploadAdminImage(file);
      setDraft((prev) => ({ ...prev, image: imageUrl }));
      setFeedback({ type: 'success', text: '封面上傳成功' });
    } catch (error) {
      setFeedback({ type: 'error', text: normalizeArticleError(error, '封面上傳失敗') });
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  const validateDraft = () => {
    if (!draft.title.trim()) return '請輸入文章標題';
    if (!draft.content.trim()) return '請輸入文章內容';
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
        await createAdminArticle(draft);
        setFeedback({ type: 'success', text: '文章建立成功' });
      } else {
        await updateAdminArticle(editingId, draft);
        setFeedback({ type: 'success', text: '文章更新成功' });
      }

      closeEditor();
      await loadArticles(currentPage);
    } catch (error) {
      setFeedback({ type: 'error', text: normalizeArticleError(error, '儲存文章失敗') });
      setIsSaving(false);
    }
  };

  const handleTogglePublic = async (article) => {
    setProcessingArticleId(article.id);

    try {
      await updateAdminArticle(article.id, toArticleDraft({ ...article, isPublic: !article.isPublic }));
      setFeedback({
        type: 'success',
        text: article.isPublic ? '已改為未公開' : '已改為公開',
      });
      await loadArticles(currentPage);
    } catch (error) {
      setFeedback({ type: 'error', text: normalizeArticleError(error, '更新公開狀態失敗') });
    } finally {
      setProcessingArticleId('');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await deleteAdminArticle(deleteTarget.id);
      setFeedback({ type: 'success', text: '文章已刪除' });
      setDeleteTarget(null);
      await loadArticles(currentPage);
    } catch (error) {
      setFeedback({ type: 'error', text: normalizeArticleError(error, '刪除文章失敗') });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <div className="relative mb-5 overflow-hidden rounded-3xl border border-brand-light/20 bg-[linear-gradient(135deg,rgba(168,185,154,0.18),rgba(255,255,255,0.85)_40%,rgba(244,239,232,0.9))] px-5 py-5 md:px-6 md:py-6">
        <div className="absolute -top-16 -right-12 h-40 w-40 rounded-full bg-brand-light/25 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-terracotta/14 blur-3xl" />

        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.28em] text-brand">EDITORIAL STUDIO</p>
            <h2 className="mt-2 font-serif-tc text-3xl text-text-primary">文章管理</h2>
            <p className="mt-2 text-sm text-text-secondary">維護品牌內容、公開狀態與封面視覺。</p>
          </div>
          <button
            type="button"
            onClick={openCreateEditor}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm text-white transition-colors hover:bg-brand-dark"
          >
            <Plus size={15} strokeWidth={1.8} />
            新增文章
          </button>
        </div>

        <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-brand-light/20 bg-white/78 px-4 py-3">
            <p className="text-xs text-text-secondary">本頁文章</p>
            <p className="mt-1 text-2xl font-medium text-text-primary">{stats.total}</p>
          </div>
          <div className="rounded-2xl border border-brand-light/20 bg-white/78 px-4 py-3">
            <p className="text-xs text-text-secondary">公開中</p>
            <p className="mt-1 text-2xl font-medium text-brand-dark">{stats.published}</p>
          </div>
          <div className="rounded-2xl border border-brand-light/20 bg-white/78 px-4 py-3">
            <p className="text-xs text-text-secondary">草稿/未公開</p>
            <p className="mt-1 text-2xl font-medium text-text-primary">{stats.draft}</p>
          </div>
        </div>
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
        <ArticlesSkeleton />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-brand-light/20 bg-white/92">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-light/18 bg-brand-light/8 text-text-secondary">
                  <th className="px-4 py-3 font-medium">文章</th>
                  <th className="px-4 py-3 font-medium">作者</th>
                  <th className="px-4 py-3 font-medium">建立日期</th>
                  <th className="px-4 py-3 text-center font-medium">狀態</th>
                  <th className="px-4 py-3 text-right font-medium">操作</th>
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-text-secondary">目前沒有文章資料。</td>
                  </tr>
                ) : (
                  articles.map((article) => {
                    const isProcessing = processingArticleId === article.id;
                    return (
                      <tr key={article.id} className="border-b border-brand-light/12 last:border-b-0">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {article.image ? (
                              <img
                                src={article.image}
                                alt={article.title}
                                className="h-12 w-12 rounded-lg border border-brand-light/18 object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-brand-light/18 bg-brand-light/10">
                                <BookOpenText size={14} className="text-text-secondary" />
                              </div>
                            )}
                            <div>
                              <p className="line-clamp-1 font-medium text-text-primary">{article.title}</p>
                              <p className="mt-0.5 line-clamp-1 text-xs text-text-secondary/80">
                                {article.description || '無摘要'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-text-secondary">{article.author || 'Verde Days'}</td>
                        <td className="px-4 py-3 text-text-secondary">{formatDate(article.create_at)}</td>
                        <td className="px-4 py-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleTogglePublic(article)}
                            disabled={isProcessing}
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
                              article.isPublic
                                ? 'border-brand-light/40 bg-brand-light/15 text-brand-dark hover:bg-brand-light/22'
                                : 'border-brand-light/30 bg-brand-light/8 text-text-secondary hover:bg-brand-light/13'
                            }`}
                          >
                            {isProcessing ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : article.isPublic ? (
                              <Eye size={12} strokeWidth={1.8} />
                            ) : (
                              <EyeOff size={12} strokeWidth={1.8} />
                            )}
                            {article.isPublic ? '已公開' : '未公開'}
                          </button>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditEditor(article.id)}
                              className="inline-flex items-center gap-1 rounded-full border border-brand-light/35 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-brand-light/10 hover:text-text-primary"
                            >
                              <PencilLine size={12} strokeWidth={1.8} />
                              編輯
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(article)}
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

      <AdminPagination pagination={pagination} onChangePage={loadArticles} />

      <ArticleEditorDialog
        open={isEditorOpen}
        mode={editorMode}
        draft={draft}
        isSaving={isSaving}
        isUploadingImage={isUploadingImage}
        onChangeField={handleChangeField}
        onUploadImage={handleUploadImage}
        onClose={closeEditor}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="刪除文章"
        description={`確定要刪除文章「${deleteTarget?.title || ''}」嗎？此操作無法復原。`}
        confirmText="確認刪除"
        isProcessing={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      {(isSaving || isDeleting || isUploadingImage) && (
        <div className="pointer-events-none fixed right-5 bottom-5 z-[95] inline-flex items-center gap-2 rounded-full border border-brand-light/30 bg-white/95 px-3 py-2 text-xs text-text-secondary">
          <UploadCloud size={13} />
          <Loader2 size={13} className="animate-spin" />
          正在同步資料...
        </div>
      )}
    </motion.div>
  );
}
