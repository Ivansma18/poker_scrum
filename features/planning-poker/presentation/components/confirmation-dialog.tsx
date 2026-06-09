type ConfirmationDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-3 py-4 backdrop-blur-sm sm:px-6 sm:py-6"
      role="presentation"
      onMouseDown={onCancel}
    >
      <section
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
        className="max-h-[calc(100dvh-2rem)] w-full max-w-sm overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#141c2e] p-5 shadow-2xl sm:max-w-md sm:p-6"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="confirmation-dialog-title" className="text-xl font-bold text-white sm:text-2xl">
          {title}
        </h2>
        <p id="confirmation-dialog-description" className="mt-2 text-sm text-slate-400 sm:mt-3">
          {description}
        </p>
        <div className="mt-5 flex flex-col-reverse gap-2 sm:mt-6 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-3 text-sm font-semibold text-slate-300 transition-all hover:bg-white/[0.08] hover:text-white touch-target sm:w-auto"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:from-rose-400 hover:to-rose-500 touch-target sm:w-auto"
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
