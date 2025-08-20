import React, { useState } from "react";

const CreateApiKeyModal = ({ isOpen, onClose, onSubmit }) => {
  const [form, setForm] = useState({ label: "", description: "" });
  const [limitUsage, setLimitUsage] = useState(false);
  const [usageLimit, setUsageLimit] = useState(1000);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ 
      label: form.label, 
      description: form.description, 
      usageLimit: limitUsage ? usageLimit : null 
    });
    
    // Reset form
    setForm({ label: "", description: "" });
    setLimitUsage(false);
    setUsageLimit(1000);
  };

  const handleClose = () => {
    setForm({ label: "", description: "" });
    setLimitUsage(false);
    setUsageLimit(1000);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-lg font-bold mb-4 text-gray-900">
          Create New API Key
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-900">
              Name <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={form.label}
              onChange={(e) => setForm(f => ({ ...f, label: e.target.value }))}
              required
              placeholder="Enter a name for your API key"
              aria-label="API key name"
              tabIndex={0}
            />
          </label>
          
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-900">
              Description <span className="text-gray-400">(optional)</span>
            </span>
            <input
              type="text"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              value={form.description}
              onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe this API key's purpose"
              aria-label="API key description"
              tabIndex={0}
            />
          </label>
          
          <div className="flex items-center gap-2">
            <input
              id="limit-usage"
              type="checkbox"
              checked={limitUsage}
              onChange={(e) => setLimitUsage(e.target.checked)}
              className="accent-blue-600 w-4 h-4"
              aria-label="Limit monthly usage"
            />
            <label htmlFor="limit-usage" className="text-sm">
              Limit monthly usage*
            </label>
            <input
              type="number"
              min={1}
              className="ml-2 border border-gray-300 rounded-lg px-2 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100 disabled:text-gray-400"
              value={usageLimit}
              onChange={(e) => setUsageLimit(Number(e.target.value))}
              disabled={!limitUsage}
              aria-label="Monthly usage limit"
            />
          </div>
          
          <div className="text-xs text-gray-400 mb-2">
            * If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
          </div>
          
          <div className="flex gap-3 justify-center mt-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              aria-label="Create API Key"
              tabIndex={0}
            >
              Create
            </button>
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
              onClick={handleClose}
              aria-label="Cancel create"
              tabIndex={0}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateApiKeyModal;
