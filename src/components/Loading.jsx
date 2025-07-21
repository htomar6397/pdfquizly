import React, { useState, useEffect } from "react";

export default function Loading({ stage, progress, ocrActive, onCancel }) {
  const [dots, setDots] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Track elapsed time
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getStageInfo = () => {
    switch (stage) {
      case 'parsing':
        return {
          title: 'Processing PDF',
          description: 'Extracting and analyzing text content from your document',
          icon: (
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )
        };
      case 'generating':
        return {
          title: 'Generating Quiz',
          description: 'AI is creating personalized questions based on your content',
          icon: (
            <svg className="w-8 h-8 text-green-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          )
        };
      default:
        return {
          title: 'Processing',
          description: 'Please wait while we prepare your quiz',
          icon: (
            <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )
        };
    }
  };

  const stageInfo = getStageInfo();
  const progressPercentage = Math.max(0, Math.min(100, progress));

  // Accessibility: ref for focus management
  const containerRef = React.useRef(null);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4"
      role="status"
      aria-live="polite"
      tabIndex={-1}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        {/* Icon and Title */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            {stageInfo.icon}
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {stageInfo.title}{dots}
          </h2>
          <p className="text-sm text-gray-600 text-center leading-relaxed">
            {stageInfo.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={progressPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label={`Processing progress: ${progressPercentage}%`}
            />
          </div>
        </div>

        {/* OCR Notice */}
        {ocrActive && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-800">OCR Processing Active</p>
                <p className="text-xs text-amber-700 mt-1">
                  Your PDF appears to be scanned. We're using advanced text recognition - this may take a bit longer.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Time Elapsed */}
        <div className="text-center mb-4">
          <p className="text-xs text-gray-500">
            Time elapsed: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}
          </p>
        </div>

        {/* Cancel Button */}
        {onCancel && (
          <div className="text-center">
            <button
              onClick={onCancel}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors underline"
              aria-label="Cancel processing"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 font-medium mb-1">💡 Pro Tip:</p>
          <p className="text-xs text-blue-600">
            {stage === 'parsing' 
              ? 'For faster processing, use PDFs with selectable text rather than scanned images.'
              : 'The AI is analyzing your content to create the most relevant questions possible.'}
          </p>
        </div>
      </div>
    </div>
  );
}
