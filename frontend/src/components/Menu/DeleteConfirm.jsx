// WHY a separate component: The delete confirmation is its own isolated UI concern.
// It receives a callback (onConfirm) and just calls it when user confirms.
const DeleteConfirm = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        {/* Danger icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🗑️</span>
        </div>
        <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
          Delete Item
        </h3>
        <p className="text-center text-gray-500 mb-6">
          Are you sure you want to delete <strong>"{itemName}"</strong>? 
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-600
                       hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white
                       rounded-lg transition-colors font-semibold"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;