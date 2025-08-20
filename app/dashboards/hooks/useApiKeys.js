import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showKey, setShowKey] = useState({});
  const [copySuccess, setCopySuccess] = useState({});

  // Fetch API keys from Supabase
  const fetchKeys = async () => {
    setLoading(true);
    setError("");
    
    try {
      const { data, error: fetchError } = await supabase
        .from("api_keys")
        .select("id,label,description,usage,key,createdAt,usageLimit");
      
      if (fetchError) {
        setError("Failed to load API keys");
      } else {
        setApiKeys(data || []);
      }
    } catch (err) {
      setError("Failed to load API keys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  // Create new API key
  const createKey = async (data) => {
    setLoading(true);
    setError("");
    
    try {
      const { data: newKey, error: insertError } = await supabase
        .from("api_keys")
        .insert([
          {
            label: data.label,
            description: data.description,
            usage: 0,
            key: `tvly-${Math.random().toString(36).slice(2, 30)}`,
            createdAt: new Date().toISOString().slice(0, 10),
            usageLimit: data.usageLimit,
          },
        ])
        .select()
        .single();
      
      if (insertError) {
        setError("Failed to create API key");
      } else {
        setApiKeys((prev) => [newKey, ...prev]);
        return { success: true };
      }
    } catch (err) {
      setError("Failed to create API key");
    } finally {
      setLoading(false);
    }
    
    return { success: false };
  };

  // Update API key
  const updateKey = async (id, data) => {
    setLoading(true);
    setError("");
    
    try {
      const { error: updateError } = await supabase
        .from("api_keys")
        .update({ label: data.label, description: data.description })
        .eq("id", id);
      
      if (updateError) {
        setError("Failed to update API key");
      } else {
        setApiKeys((prev) => 
          prev.map((k) => 
            k.id === id 
              ? { ...k, label: data.label, description: data.description } 
              : k
          )
        );
        return { success: true };
      }
    } catch (err) {
      setError("Failed to update API key");
    } finally {
      setLoading(false);
    }
    
    return { success: false };
  };

  // Delete API key
  const deleteKey = async (id) => {
    setLoading(true);
    setError("");
    
    try {
      console.log('Attempting to delete API key with ID:', id);
      
      const { data, error: deleteError } = await supabase
        .from("api_keys")
        .delete()
        .eq("id", id)
        .select();
      
      console.log('Delete response:', { data, error: deleteError });
      
      if (deleteError) {
        console.error('Delete error:', deleteError);
        setError(`Failed to delete API key: ${deleteError.message}`);
      } else {
        console.log('Successfully deleted API key, updating local state');
        setApiKeys((prev) => prev.filter((k) => k.id !== id));
        return { success: true };
      }
    } catch (err) {
      console.error('Delete exception:', err);
      setError(`Failed to delete API key: ${err.message}`);
    } finally {
      setLoading(false);
    }
    
    return { success: false };
  };

  // Copy API key to clipboard
  const copyKey = async (key, keyId) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopySuccess(prev => ({ ...prev, [keyId]: "Copied!" }));
      setTimeout(() => {
        setCopySuccess(prev => {
          const newState = { ...prev };
          delete newState[keyId];
          return newState;
        });
      }, 1200);
      return { success: true };
    } catch (err) {
      setError("Failed to copy API key");
      return { success: false };
    }
  };

  // Toggle key visibility
  const toggleShowKey = (id) => {
    setShowKey((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Clear error
  const clearError = () => {
    setError("");
  };

  return {
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
    refetch: fetchKeys,
  };
};
