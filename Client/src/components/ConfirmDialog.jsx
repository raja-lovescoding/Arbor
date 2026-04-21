const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="confirm-dialog-overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div className="confirm-dialog-card">
        <h4 className="confirm-dialog-title">{title}</h4>
        <p className="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button type="button" className="confirm-dialog-button" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="confirm-dialog-button confirm-dialog-button--danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
