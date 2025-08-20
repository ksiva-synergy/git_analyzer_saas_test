import React from "react";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, apiKey }) => {
  if (!isOpen || !apiKey) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg flex flex-col gap-4" 
        role="alertdialog" 
        aria-modal="true"
      >
        <h2 className="text-lg font-bold mb-2 text-gray-900">
          Delete API Key
        </h2>
        
        <p className="text-gray-700">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{apiKey.label}</span>?
        </p>
        
        <div className="flex gap-2 justify-end mt-4">
          <button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            onClick={onClose}
            aria-label="Cancel delete"
            tabIndex={0}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 transition-colors"
            onClick={onConfirm}
            aria-label="Confirm delete"
            tabIndex={0}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
