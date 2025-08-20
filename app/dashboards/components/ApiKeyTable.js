import React from "react";
import { Eye, EyeOff, Copy, Pencil, Trash2 } from "lucide-react";

const ApiKeyTable = ({ 
  apiKeys, 
  loading, 
  error, 
  showKey, 
  copySuccess,
  onToggleShowKey, 
  onCopy, 
  onEdit, 
  onDelete 
}) => {
  const maskKey = (key) => key.replace(/.(?=.{4})/g, "*");

  if (loading) {
    return (
      <div className="text-center p-6 text-gray-400">
        Loading API keys...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        {error}
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="text-center p-6 text-gray-400">
        No API keys found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-900">
            <th className="py-3 px-4 text-left font-semibold">NAME</th>
            <th className="py-3 px-4 text-left font-semibold">USAGE</th>
            <th className="py-3 px-4 text-left font-semibold">KEY</th>
            <th className="py-3 px-4 text-center font-semibold">OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((key) => (
            <tr key={key.id} className="border-b last:border-b-0 hover:bg-gray-50">
              <td className="py-3 px-4 font-medium text-gray-900">
                {key.label}
              </td>
              <td className="py-3 px-4 text-gray-600">
                {key.usage}
              </td>
              <td className="py-3 px-4 font-mono text-gray-700">
                <span className="select-all" aria-label="API key masked">
                  {showKey[key.id] ? key.key : maskKey(key.key)}
                </span>
              </td>
              <td className="py-3 px-4 flex gap-4 justify-center items-center">
                <button
                  className="p-1 focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-500 hover:text-gray-700 rounded transition-colors"
                  onClick={() => onToggleShowKey(key.id)}
                  aria-label={showKey[key.id] ? `Hide API key for ${key.label}` : `Show API key for ${key.label}`}
                  tabIndex={0}
                  type="button"
                >
                  {showKey[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                
                <button
                  className="p-1 focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-500 hover:text-gray-700 rounded transition-colors"
                  onClick={() => onCopy(key.key, key.id)}
                  aria-label={`Copy API key for ${key.label}`}
                  tabIndex={0}
                  type="button"
                >
                  <Copy className="w-4 h-4" />
                </button>
                
                <button
                  className="p-1 focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-500 hover:text-gray-700 rounded transition-colors"
                  onClick={() => onEdit(key)}
                  aria-label={`Edit API key for ${key.label}`}
                  tabIndex={0}
                  type="button"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                
                <button
                  className="p-1 focus:outline-none focus:ring-2 focus:ring-gray-400 text-gray-500 hover:text-gray-700 rounded transition-colors"
                  onClick={() => onDelete(key)}
                  aria-label={`Delete API key for ${key.label}`}
                  tabIndex={0}
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                
                {copySuccess[key.id] && (
                  <span className="ml-1 text-green-600 text-xs">
                    {copySuccess[key.id]}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApiKeyTable;
