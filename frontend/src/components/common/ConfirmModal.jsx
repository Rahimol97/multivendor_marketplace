function ConfirmModal({ open, title, description, onCancel, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg w-96 p-6">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-sm text-(--text) mb-6">{description}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-(--accent) text-(--text)"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
