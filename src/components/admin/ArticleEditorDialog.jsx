import { Calendar, ImagePlus, Upload } from 'lucide-react';

function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs text-text-secondary">
      {children}
    </label>
  );
}

export default function ArticleEditorDialog({
  open,
  mode,
  draft,
  isSaving,
  isUploadingImage,
  onChangeField,
  onUploadImage,
  onClose,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/30 px-3 py-4 backdrop-blur-[2px]">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-brand-light/24 bg-white">
        <header className="flex items-center justify-between border-b border-brand-light/18 px-6 py-4">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-brand">ARTICLE EDITOR</p>
            <h2 className="mt-1 font-serif-tc text-3xl text-text-primary">
              {mode === 'create' ? '新增文章' : '編輯文章'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-brand-light/30 px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-brand-light/10"
          >
            關閉
          </button>
        </header>

        <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="overflow-y-auto border-r border-brand-light/16 bg-cream/45 p-5">
            <h3 className="text-sm font-medium text-text-primary">封面與資訊</h3>

            <div className="mt-4">
              <FieldLabel htmlFor="article-image">封面圖片網址</FieldLabel>
              <input
                id="article-image"
                value={draft.image}
                onChange={(event) => onChangeField('image', event.target.value)}
                placeholder="https://..."
                className="h-10 w-full rounded-xl border border-brand-light/30 bg-white px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
              />

              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-brand-light/35 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-brand-light/10">
                <Upload size={13} strokeWidth={1.7} />
                {isUploadingImage ? '上傳中...' : '上傳封面'}
                <input type="file" accept="image/*" className="hidden" disabled={isUploadingImage} onChange={onUploadImage} />
              </label>

              <div className="mt-3 overflow-hidden rounded-2xl border border-brand-light/20 bg-white">
                {draft.image ? (
                  <img src={draft.image} alt="文章封面" className="h-52 w-full object-cover" />
                ) : (
                  <div className="flex h-52 items-center justify-center text-text-secondary/70">
                    <ImagePlus size={26} strokeWidth={1.4} />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-brand-light/16 pt-5">
              <FieldLabel htmlFor="article-create-date">建立日期</FieldLabel>
              <div className="relative">
                <Calendar
                  size={14}
                  strokeWidth={1.7}
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-text-secondary"
                />
                <input
                  id="article-create-date"
                  type="date"
                  value={draft.createAtDate}
                  onChange={(event) => onChangeField('createAtDate', event.target.value)}
                  className="h-10 w-full rounded-xl border border-brand-light/30 bg-white pr-3 pl-9 text-sm text-text-primary outline-none transition-colors focus:border-brand"
                />
              </div>
            </div>

            <div className="mt-5">
              <FieldLabel htmlFor="article-tags">標籤（逗號分隔）</FieldLabel>
              <input
                id="article-tags"
                value={draft.tagInput}
                onChange={(event) => onChangeField('tagInput', event.target.value)}
                placeholder="照護技巧, 新手入門"
                className="h-10 w-full rounded-xl border border-brand-light/30 bg-white px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
              />
            </div>

            <label className="mt-5 inline-flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={Boolean(draft.isPublic)}
                onChange={(event) => onChangeField('isPublic', event.target.checked)}
                className="h-4 w-4 rounded border-brand-light/40 text-brand"
              />
              文章公開（前台可見）
            </label>
          </aside>

          <section className="overflow-y-auto p-5">
            <div className="grid gap-4">
              <div>
                <FieldLabel htmlFor="article-title">文章標題</FieldLabel>
                <input
                  id="article-title"
                  value={draft.title}
                  onChange={(event) => onChangeField('title', event.target.value)}
                  placeholder="請輸入文章標題"
                  className="h-10 w-full rounded-xl border border-brand-light/30 px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                />
              </div>

              <div>
                <FieldLabel htmlFor="article-author">作者</FieldLabel>
                <input
                  id="article-author"
                  value={draft.author}
                  onChange={(event) => onChangeField('author', event.target.value)}
                  placeholder="Verde Days"
                  className="h-10 w-full rounded-xl border border-brand-light/30 px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                />
              </div>

              <div>
                <FieldLabel htmlFor="article-description">文章摘要</FieldLabel>
                <textarea
                  id="article-description"
                  rows="3"
                  value={draft.description}
                  onChange={(event) => onChangeField('description', event.target.value)}
                  placeholder="簡短說明本文重點"
                  className="w-full rounded-xl border border-brand-light/30 px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                />
              </div>

              <div>
                <FieldLabel htmlFor="article-content">內文內容</FieldLabel>
                <textarea
                  id="article-content"
                  rows="12"
                  value={draft.content}
                  onChange={(event) => onChangeField('content', event.target.value)}
                  placeholder="請輸入完整文章內容"
                  className="w-full rounded-xl border border-brand-light/30 px-3 py-2.5 text-sm leading-7 text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-brand-light/16 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-brand-light/35 px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-brand-light/10"
              >
                取消
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={isSaving}
                className="rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-65"
              >
                {isSaving ? '儲存中...' : mode === 'create' ? '建立文章' : '更新文章'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
