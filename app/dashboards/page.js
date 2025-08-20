"use client";
import React from "react";
import {
  Sidebar,
  TopBar,
  ApiKeysCard,
  CreateApiKeyModal,
  EditApiKeyModal,
  DeleteConfirmationModal,
} from "./components";
import { useApiKeys, useModals } from "./hooks";

const DashboardsPage = () => {
  const {
    apiKeys,
    loading,
    error,
    showKey,
    copySuccess,
    createKey,
    updateKey,
    deleteKey,
    copyKey,
    toggleShowKey,
    clearError,
  } = useApiKeys();

  const {
    showCreate,
    showEdit,
    showDelete,
    selectedKey,
    openCreate,
    closeCreate,
    openEdit,
    closeEdit,
    openDelete,
    closeDelete,
  } = useModals();

  const user = null; // Change to { name: "Eden Marco" } to simulate logged-in user

  const handleCreateKey = async (data) => {
    const result = await createKey(data);
    if (result.success) {
      closeCreate();
    }
  };

  const handleEditKey = async (data) => {
    const result = await updateKey(selectedKey.id, data);
    if (result.success) {
      closeEdit();
    }
  };

  const handleDeleteKey = async () => {
    const result = await deleteKey(selectedKey.id);
    if (result.success) {
      closeDelete();
    }
  };

  const handleCopyKey = async (key, keyId) => {
    await copyKey(key, keyId);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar user={user} />
      
      <main className="flex-1 bg-gray-50 min-h-screen p-0">
        <TopBar />
        
        <ApiKeysCard
          apiKeys={apiKeys}
          loading={loading}
          error={error}
          showKey={showKey}
          copySuccess={copySuccess}
          onCreateClick={openCreate}
          onToggleShowKey={toggleShowKey}
          onCopy={handleCopyKey}
          onEdit={openEdit}
          onDelete={openDelete}
        />

        <CreateApiKeyModal
          isOpen={showCreate}
          onClose={closeCreate}
          onSubmit={handleCreateKey}
        />

        <EditApiKeyModal
          isOpen={showEdit}
          onClose={closeEdit}
          onSubmit={handleEditKey}
          apiKey={selectedKey}
        />

        <DeleteConfirmationModal
          isOpen={showDelete}
          onClose={closeDelete}
          onConfirm={handleDeleteKey}
          apiKey={selectedKey}
        />
      </main>
    </div>
  );
};

export default DashboardsPage; 