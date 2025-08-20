'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

const Notification = ({ message, type, isVisible, onClose, duration = 3000 }) => {
  const [isShowing, setIsShowing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true);
      const timer = setTimeout(() => {
        setIsShowing(false);
        setTimeout(() => onClose(), 300); // Wait for animation to complete
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getNotificationStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-500',
          border: 'border-green-600',
          icon: <CheckCircle className="w-5 h-5 text-white" />,
        };
      case 'error':
        return {
          bg: 'bg-red-500',
          border: 'border-red-600',
          icon: <XCircle className="w-5 h-5 text-white" />,
        };
      default:
        return {
          bg: 'bg-blue-600',
          border: 'border-blue-700',
          icon: <CheckCircle className="w-5 h-5 text-white" />,
        };
    }
  };

  const styles = getNotificationStyles();

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-sm w-full transform transition-all duration-300 ease-in-out ${
        isShowing ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`${styles.bg} ${styles.border} border rounded-lg shadow-lg p-4 text-white`}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {styles.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            onClick={() => {
              setIsShowing(false);
              setTimeout(() => onClose(), 300);
            }}
            className="flex-shrink-0 ml-2 text-white hover:text-gray-200 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
