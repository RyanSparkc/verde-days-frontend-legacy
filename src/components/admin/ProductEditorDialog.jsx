import { ImagePlus, Plus, Trash2, Upload } from 'lucide-react';
import { categoryLabel } from '@/constants/categories';

const careOptions = [
  { value: 'easy', label: '容易' },
  { value: 'medium', label: '中等' },
  { value: 'hard', label: '進階' },
];

const lightOptions = [
  { value: 'low', label: '低光' },
  { value: 'medium', label: '散射光' },
  { value: 'bright', label: '明亮光' },
];

const sizeOptions = ['S', 'M', 'L'];

function FieldLabel({ htmlFor, children }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs text-text-secondary">
      {children}
    </label>
  );
}

export default function ProductEditorDialog({
  open,
  mode,
  draft,
  isSaving,
  isUploadingMain,
  isUploadingSub,
  onChangeField,
  onChangeImage,
  onAddSubImage,
  onRemoveSubImage,
  onUploadMain,
  onUploadSub,
  onClose,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/30 px-3 py-4 backdrop-blur-[2px]">
      <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-brand-light/24 bg-white">
        <header className="flex items-center justify-between border-b border-brand-light/18 px-6 py-4">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-brand">PRODUCT EDITOR</p>
            <h2 className="mt-1 font-serif-tc text-3xl text-text-primary">
              {mode === 'create' ? '新增商品' : '編輯商品'}
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

        <div className="grid min-h-0 flex-1 gap-0 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="overflow-y-auto border-r border-brand-light/16 bg-cream/45 p-5">
            <h3 className="text-sm font-medium text-text-primary">圖片管理</h3>

            <div className="mt-4 space-y-3">
              <FieldLabel htmlFor="imageUrl">主圖網址</FieldLabel>
              <input
                id="imageUrl"
                value={draft.imageUrl}
                onChange={(event) => onChangeField('imageUrl', event.target.value)}
                placeholder="https://..."
                className="h-10 w-full rounded-xl border border-brand-light/30 bg-white px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
              />

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-brand-light/35 px-3 py-1.5 text-xs text-text-secondary transition-colors hover:bg-brand-light/10">
                <Upload size={13} strokeWidth={1.7} />
                {isUploadingMain ? '上傳中...' : '上傳主圖'}
                <input type="file" accept="image/*" className="hidden" onChange={onUploadMain} disabled={isUploadingMain} />
              </label>

              <div className="overflow-hidden rounded-2xl border border-brand-light/20 bg-white">
                {draft.imageUrl ? (
                  <img src={draft.imageUrl} alt="商品主圖" className="h-52 w-full object-cover" />
                ) : (
                  <div className="flex h-52 items-center justify-center text-text-secondary/70">
                    <ImagePlus size={26} strokeWidth={1.4} />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-brand-light/16 pt-5">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-medium text-text-primary">副圖（最多 5 張）</h4>
                <label className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-brand-light/35 px-2.5 py-1 text-xs text-text-secondary transition-colors hover:bg-brand-light/10">
                  <Upload size={12} />
                  {isUploadingSub ? '上傳中' : '上傳'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    multiple
                    onChange={onUploadSub}
                    disabled={isUploadingSub || draft.imagesUrl.length >= 5}
                  />
                </label>
              </div>

              <div className="space-y-2">
                {draft.imagesUrl.map((image, index) => (
                  <div key={`${index}-${image}`} className="rounded-xl border border-brand-light/20 bg-white p-2">
                    <input
                      value={image}
                      onChange={(event) => onChangeImage(index, event.target.value)}
                      placeholder={`副圖 ${index + 1} 連結`}
                      className="h-9 w-full rounded-lg border border-brand-light/25 px-2.5 text-xs text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                    />
                    {image && <img src={image} alt={`副圖 ${index + 1}`} className="mt-2 h-24 w-full rounded-lg object-cover" />}
                    <button
                      type="button"
                      onClick={() => onRemoveSubImage(index)}
                      className="mt-2 inline-flex cursor-pointer items-center gap-1 text-xs text-error transition-opacity hover:opacity-80"
                    >
                      <Trash2 size={12} />
                      移除
                    </button>
                  </div>
                ))}

                {draft.imagesUrl.length < 5 && (
                  <button
                    type="button"
                    onClick={onAddSubImage}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-brand-light/35 px-2.5 py-1 text-xs text-text-secondary transition-colors hover:bg-brand-light/10"
                  >
                    <Plus size={12} />
                    新增欄位
                  </button>
                )}
              </div>
            </div>
          </aside>

          <section className="overflow-y-auto p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <FieldLabel htmlFor="title">商品名稱</FieldLabel>
                <input
                  id="title"
                  value={draft.title}
                  onChange={(event) => onChangeField('title', event.target.value)}
                  placeholder="請輸入商品名稱"
                  className="h-10 w-full rounded-xl border border-brand-light/30 px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                />
              </div>

              <div>
                <FieldLabel htmlFor="category">分類</FieldLabel>
                <select
                  id="category"
                  value={draft.category}
                  onChange={(event) => onChangeField('category', event.target.value)}
                  className="h-10 w-full rounded-xl border border-brand-light/30 bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-brand"
                >
                  {Object.entries(categoryLabel).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="unit">單位</FieldLabel>
                <input
                  id="unit"
                  value={draft.unit}
                  onChange={(event) => onChangeField('unit', event.target.value)}
                  placeholder="盆"
                  className="h-10 w-full rounded-xl border border-brand-light/30 px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                />
              </div>

              <div>
                <FieldLabel htmlFor="origin_price">原價</FieldLabel>
                <input
                  id="origin_price"
                  type="number"
                  min="0"
                  value={draft.origin_price}
                  onChange={(event) => onChangeField('origin_price', event.target.value)}
                  className="h-10 w-full rounded-xl border border-brand-light/30 px-3 text-sm text-text-primary outline-none transition-colors focus:border-brand"
                />
              </div>

              <div>
                <FieldLabel htmlFor="price">售價</FieldLabel>
                <input
                  id="price"
                  type="number"
                  min="0"
                  value={draft.price}
                  onChange={(event) => onChangeField('price', event.target.value)}
                  className="h-10 w-full rounded-xl border border-brand-light/30 px-3 text-sm text-text-primary outline-none transition-colors focus:border-brand"
                />
              </div>

              <div>
                <FieldLabel htmlFor="careLevel">難度</FieldLabel>
                <select
                  id="careLevel"
                  value={draft.careLevel}
                  onChange={(event) => onChangeField('careLevel', event.target.value)}
                  className="h-10 w-full rounded-xl border border-brand-light/30 bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-brand"
                >
                  {careOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="light">光照</FieldLabel>
                <select
                  id="light"
                  value={draft.light}
                  onChange={(event) => onChangeField('light', event.target.value)}
                  className="h-10 w-full rounded-xl border border-brand-light/30 bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-brand"
                >
                  {lightOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="water">澆水頻率</FieldLabel>
                <input
                  id="water"
                  value={draft.water}
                  onChange={(event) => onChangeField('water', event.target.value)}
                  placeholder="每週 1 次"
                  className="h-10 w-full rounded-xl border border-brand-light/30 px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                />
              </div>

              <div>
                <FieldLabel htmlFor="size">尺寸</FieldLabel>
                <select
                  id="size"
                  value={draft.size}
                  onChange={(event) => onChangeField('size', event.target.value)}
                  className="h-10 w-full rounded-xl border border-brand-light/30 bg-white px-3 text-sm text-text-primary outline-none transition-colors focus:border-brand"
                >
                  {sizeOptions.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <FieldLabel htmlFor="height">高度</FieldLabel>
                <input
                  id="height"
                  value={draft.height}
                  onChange={(event) => onChangeField('height', event.target.value)}
                  placeholder="40-50cm"
                  className="h-10 w-full rounded-xl border border-brand-light/30 px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                />
              </div>

              <div>
                <FieldLabel htmlFor="origin">產地</FieldLabel>
                <input
                  id="origin"
                  value={draft.origin}
                  onChange={(event) => onChangeField('origin', event.target.value)}
                  placeholder="墨西哥"
                  className="h-10 w-full rounded-xl border border-brand-light/30 px-3 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                />
              </div>

              <div className="md:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    checked={Boolean(draft.petFriendly)}
                    onChange={(event) => onChangeField('petFriendly', event.target.checked)}
                    className="h-4 w-4 rounded border-brand-light/40 text-brand"
                  />
                  寵物友善
                </label>

                <label className="ml-6 inline-flex items-center gap-2 text-sm text-text-secondary">
                  <input
                    type="checkbox"
                    checked={Boolean(draft.is_enabled)}
                    onChange={(event) => onChangeField('is_enabled', event.target.checked ? 1 : 0)}
                    className="h-4 w-4 rounded border-brand-light/40 text-brand"
                  />
                  上架啟用
                </label>
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor="description">商品摘要</FieldLabel>
                <textarea
                  id="description"
                  rows="3"
                  value={draft.description}
                  onChange={(event) => onChangeField('description', event.target.value)}
                  placeholder="簡短描述"
                  className="w-full rounded-xl border border-brand-light/30 px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel htmlFor="content">詳細內容</FieldLabel>
                <textarea
                  id="content"
                  rows="4"
                  value={draft.content}
                  onChange={(event) => onChangeField('content', event.target.value)}
                  placeholder="請輸入商品詳情"
                  className="w-full rounded-xl border border-brand-light/30 px-3 py-2.5 text-sm text-text-primary outline-none transition-colors placeholder:text-text-secondary/40 focus:border-brand"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-brand-light/16 pt-4">
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
                {isSaving ? '儲存中...' : mode === 'create' ? '建立商品' : '更新商品'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
