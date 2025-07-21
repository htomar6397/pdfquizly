import React, { useState, useEffect, useRef, useCallback } from 'react';
/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
/* eslint-enable no-unused-vars */

const Toast = ({ message, type = 'info', onClose, autoClose = true, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(true);
  const timerRef = useRef(null);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  }, [onClose]);

  const startTimer = useCallback(() => {
    if (autoClose) {
      timerRef.current = setTimeout(handleClose, duration);
    }
  }, [autoClose, duration, handleClose]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  const getTypeStyles = useCallback(() => {
    const baseStyles = {
      container: 'p-4 rounded-lg shadow-lg border-l-4',
      icon: 'w-5 h-5 flex-shrink-0',
      content: 'text-sm font-medium',
      closeButton: 'ml-4 p-1 rounded-full hover:bg-opacity-20 hover:bg-current transition-colors',
    };
    
    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          container: `${baseStyles.container} bg-green-50 border-green-500`,
          icon: `${baseStyles.icon} text-green-500`,
          content: `${baseStyles.content} text-green-800`,
          iconMarkup: (
            <svg className={baseStyles.icon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'error':
        return {
          ...baseStyles,
          container: `${baseStyles.container} bg-red-50 border-red-500`,
          icon: `${baseStyles.icon} text-red-500`,
          content: `${baseStyles.content} text-red-800`,
          iconMarkup: (
            <svg className={baseStyles.icon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'warning':
        return {
          ...baseStyles,
          container: `${baseStyles.container} bg-yellow-50 border-yellow-500`,
          icon: `${baseStyles.icon} text-yellow-500`,
          content: `${baseStyles.content} text-yellow-800`,
          iconMarkup: (
            <svg className={baseStyles.icon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      default:
        return {
          ...baseStyles,
          container: `${baseStyles.container} bg-blue-50 border-blue-500`,
          icon: `${baseStyles.icon} text-blue-500`,
          content: `${baseStyles.content} text-blue-800`,
          iconMarkup: (
            <svg className={baseStyles.icon} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )
        };
    }
  }, [type]);

  const styles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`${styles.container} w-full max-w-sm mb-2`}
      role="alert"
      aria-live="assertive"
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          {styles.iconMarkup}
        </div>
        <div className="ml-3 flex-1">
          <p className={styles.content}>
            {message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            type="button"
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Close notification"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Toast;
