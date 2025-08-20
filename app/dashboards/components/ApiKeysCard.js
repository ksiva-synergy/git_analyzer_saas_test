import React from "react";
import { KeyRound } from "lucide-react";
import ApiKeyTable from "./ApiKeyTable";

const ApiKeysCard = ({ 
  apiKeys, 
  loading, 
  error, 
  showKey, 
  copySuccess,
  onCreateClick,
  onToggleShowKey, 
  onCopy, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="max-w-4xl mx-auto mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-lg font-bold text-gray-900">API Keys</div>
          <div className="text-sm text-gray-500">
            The key is used to authenticate your requests to the Research API. To learn more, see the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              documentation page
            </a>
            .
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="rounded-full bg-gray-900 text-white p-2 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
            onClick={onCreateClick}
            aria-label="Create New API Key"
            tabIndex={0}
            type="button"
          >
            <KeyRound className="w-5 h-5" />
          </button>
          <span className="text-gray-900 font-medium text-sm select-none" aria-hidden="true">
            Create New API Key
          </span>
        </div>
      </div>
      
      <ApiKeyTable
        apiKeys={apiKeys}
        loading={loading}
        error={error}
        showKey={showKey}
        copySuccess={copySuccess}
        onToggleShowKey={onToggleShowKey}
        onCopy={onCopy}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default ApiKeysCard;
