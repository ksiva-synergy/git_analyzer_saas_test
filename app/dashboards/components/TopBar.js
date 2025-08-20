import React from "react";

const TopBar = () => {
  return (
    <div className="px-10 pt-8 pb-4 flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <span>Pages</span>
        <span>/</span>
        <span>Overview</span>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">
            Current Plan
          </div>
          <div className="text-3xl font-bold text-gray-900">Researcher</div>
        </div>
        
        <div className="flex flex-col md:items-end gap-2">
          <button 
            className="rounded-lg bg-blue-600 text-white px-4 py-2 font-medium hover:bg-blue-700 transition-colors"
            aria-label="Manage subscription plan"
            tabIndex={0}
          >
            Manage Plan
          </button>
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>API Limit</span>
            <span className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden inline-block">
              <span 
                className="block h-2 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full" 
                style={{ width: '2.4%' }}
              />
            </span>
            <span className="font-semibold text-gray-900">24 / 1,000 Requests</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
