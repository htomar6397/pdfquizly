import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Toast from './Toast';

const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-xs space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            autoClose={toast.autoClose}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
