import React from 'react';

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "default" // default, danger, warning
}) {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: (
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          iconBg: 'bg-red-100',
          confirmBtn: 'bg-red-600 hover:bg-red-700 text-white'
        };
      case 'warning':
        return {
          icon: (
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ),
          iconBg: 'bg-yellow-100',
          confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        };
      default:
        return {
          icon: (
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          iconBg: 'bg-blue-100',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center mr-3`}>
            {styles.icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        <p className="text-gray-600 mb-6">{message}</p>
        
        <div className="flex space-x-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg transition-colors font-medium ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
