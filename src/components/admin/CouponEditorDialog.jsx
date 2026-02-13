function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs text-text-secondary">
      {children}
    </label>
  );
}

export default function CouponEditorDialog({
  open,
  mode,
  draft,
  isSaving,
  onChangeField,
  onClose,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/30 px-3 py-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-brand-light/24 bg-white">
        <header className="flex items-center justify-between border-b border-brand-light/18 px-6 py-4">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-brand">COUPON EDITOR</p>
            <h2 className="mt-1 font-serif-tc text-3xl text-text-primary">
              {mode === 'create' ? '新增優惠券' : '編輯優惠券'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-brand-light/30 px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-brand-light/10"
          >
            關閉
          </button>
        </header>

        <section className="grid gap-4 p-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <FieldLabel htmlFor="coupon-title">優惠券名稱</FieldLabel>
            <input
              id="coupon-title"
              value={draft.title}
              onChange={(event) => onChangeField('title', event.target.value)}
              placeholder="例如：春季滿千折百"
              className="h-10 w-full rounded-xl border border-brand-light/30 px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
            />
          </div>

          <div>
            <FieldLabel htmlFor="coupon-code">優惠碼</FieldLabel>
            <input
              id="coupon-code"
              value={draft.code}
              onChange={(event) => onChangeField('code', event.target.value.toUpperCase())}
              placeholder="SPRING10"
              className="h-10 w-full rounded-xl border border-brand-light/30 px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
            />
          </div>

          <div>
            <FieldLabel htmlFor="coupon-percent">折扣百分比</FieldLabel>
            <input
              id="coupon-percent"
              type="number"
              min="1"
              max="100"
              value={draft.percent}
              onChange={(event) => onChangeField('percent', event.target.value)}
              placeholder="80"
              className="h-10 w-full rounded-xl border border-brand-light/30 px-3 text-sm text-text-primary outline-none transition-colors focus:border-brand"
            />
          </div>

          <div>
            <FieldLabel htmlFor="coupon-due-date">到期日</FieldLabel>
            <input
              id="coupon-due-date"
              type="date"
              value={draft.dueDate}
              onChange={(event) => onChangeField('dueDate', event.target.value)}
              className="h-10 w-full rounded-xl border border-brand-light/30 px-3 text-sm text-text-primary outline-none transition-colors focus:border-brand"
            />
          </div>

          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
              <input
                type="checkbox"
                checked={Boolean(draft.is_enabled)}
                onChange={(event) => onChangeField('is_enabled', event.target.checked ? 1 : 0)}
                className="h-4 w-4 rounded border-brand-light/40 text-brand"
              />
              啟用優惠券
            </label>
          </div>
        </section>

        <footer className="flex justify-end gap-2 border-t border-brand-light/16 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full border border-brand-light/35 px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-brand-light/10"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSaving}
            className="cursor-pointer rounded-full bg-brand px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-65"
          >
            {isSaving ? '儲存中...' : mode === 'create' ? '建立優惠券' : '更新優惠券'}
          </button>
        </footer>
      </div>
    </div>
  );
}
