'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Code, Key, ArrowRight } from 'lucide-react';
import Notification from '../components/Notification';

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [connectionStatus, setConnectionStatus] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/protected', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });
      
      const result = await response.json();
      
      if (result.valid) {
        // Show success notification
        setNotification({ show: true, message: 'API key is valid!', type: 'success' });
      } else {
        // Show error notification with more details
        const errorMessage = result.error || 'Invalid API key. Please try again.';
        setNotification({ show: true, message: errorMessage, type: 'error' });
        console.error('API validation failed:', result);
      }
    } catch (error) {
      console.error('Network error:', error);
      setNotification({ show: true, message: 'Network error. Please check your connection.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      const response = await fetch('/api/test-connection');
      const result = await response.json();
      
      if (result.status === 'success') {
        setConnectionStatus('connected');
        setNotification({ show: true, message: 'Database connection successful!', type: 'success' });
      } else {
        setConnectionStatus('error');
        setNotification({ show: true, message: `Connection failed: ${result.message}`, type: 'error' });
      }
    } catch (error) {
      setConnectionStatus('error');
      setNotification({ show: true, message: 'Failed to test connection', type: 'error' });
    }
  };

  return (
    <>
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.show}
        onClose={() => setNotification({ ...notification, show: false })}
      />
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">API Playground</h1>
            <p className="text-gray-600">Test your API key to access protected endpoints</p>
            
            {/* Connection Status */}
            <div className="mt-4">
              <button
                onClick={testConnection}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  connectionStatus === 'connected' 
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : connectionStatus === 'error'
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {connectionStatus === 'connected' ? '✓ Connected' : 
                 connectionStatus === 'error' ? '✗ Connection Failed' : 
                 'Test Database Connection'}
              </button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
            </div>
            
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Validate API Key
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/dashboards')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
