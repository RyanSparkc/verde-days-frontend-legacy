import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = '確認',
  cancelText = '取消',
  danger = true,
  isProcessing = false,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/30 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-3xl border border-brand-light/25 bg-white p-6">
        <div className="mb-4 flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-error/10 p-2 text-error">
            <AlertTriangle size={16} strokeWidth={1.7} />
          </div>
          <div>
            <h3 className="font-serif-tc text-2xl text-text-primary">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-text-secondary">{description}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="cursor-pointer rounded-full border border-brand-light/35 px-4 py-2 text-sm text-text-secondary transition-colors hover:bg-brand-light/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className={`cursor-pointer rounded-full px-4 py-2 text-sm text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${danger ? 'bg-error hover:bg-[#b45043]' : 'bg-brand hover:bg-brand-dark'}`}
          >
            {isProcessing ? '處理中...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
