import { useState, useCallback } from 'react';

// Toast Manager Hook
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((message, options = {}) => {
    const id = Date.now().toString();
    const { type = 'info', duration = 5000, autoClose = true } = options;
    
    setToasts(prev => [...prev, { id, message, type, duration, autoClose }]);
    
    // Auto-remove toast if autoClose is true
    if (autoClose) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  }, [removeToast]);

  return { 
    toasts,
    addToast, 
    removeToast
  };
}
