import React, { useState, useEffect } from "react";

const EditApiKeyModal = ({ isOpen, onClose, onSubmit, apiKey }) => {
  const [form, setForm] = useState({ label: "", description: "" });

  useEffect(() => {
    if (apiKey) {
      setForm({ 
        label: apiKey.label || "", 
        description: apiKey.description || "" 
      });
    } else {
      // Reset form when no apiKey is provided
      setForm({ label: "", description: "" });
    }
  }, [apiKey]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleClose = () => {
    setForm({ label: "", description: "" });
    onClose();
  };

  if (!isOpen || !apiKey || !apiKey.id) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg flex flex-col gap-4"
        onSubmit={handleSubmit}
        aria-label="Edit API Key Modal"
      >
        <h2 className="text-lg font-bold mb-2 text-gray-900">
          Edit API Key
        </h2>
        
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-900">Name</span>
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            required
            value={form.label || ""}
            onChange={(e) => setForm(f => ({ ...f, label: e.target.value }))}
            aria-label="Edit API Key Name"
            tabIndex={0}
          />
        </label>
        
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-900">Description</span>
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            value={form.description || ""}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            aria-label="Edit API Key Description"
            tabIndex={0}
          />
        </label>
        
        <div className="flex gap-2 justify-end mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            onClick={handleClose}
            aria-label="Cancel edit"
            tabIndex={0}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            aria-label="Save changes"
            tabIndex={0}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditApiKeyModal;
