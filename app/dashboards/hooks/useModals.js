import { useState } from "react";

export const useModals = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);

  const openCreate = () => {
    setShowCreate(true);
  };

  const closeCreate = () => {
    setShowCreate(false);
  };

  const openEdit = (key) => {
    setSelectedKey(key);
    setShowEdit(true);
  };

  const closeEdit = () => {
    setShowEdit(false);
    setSelectedKey(null);
  };

  const openDelete = (key) => {
    setSelectedKey(key);
    setShowDelete(true);
  };

  const closeDelete = () => {
    setShowDelete(false);
    setSelectedKey(null);
  };

  const closeAll = () => {
    setShowCreate(false);
    setShowEdit(false);
    setShowDelete(false);
    setSelectedKey(null);
  };

  return {
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
    closeAll,
  };
};
