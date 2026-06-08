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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-6 py-8 backdrop-blur-sm"
      role="presentation"
      onMouseDown={onCancel}
    >
      <section
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
        className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-2xl shadow-black/40"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="confirmation-dialog-title" className="text-2xl font-bold">
          {title}
        </h2>
        <p id="confirmation-dialog-description" className="mt-3 text-sm text-slate-600">
          {description}
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </section>
    </div>
  );
}
