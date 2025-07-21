import React, { useState, useEffect, useRef, useCallback } from 'react';

const Quiz = ({ questions: initialQuestions = [], onFinish, difficulty = 'Easy' }) => {
  // State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [validatedQuestions, setValidatedQuestions] = useState([]);
  
  // Refs
  const mainContentRef = useRef(null);
  const timerRef = useRef(null);

  // Utility functions
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Event handlers
  const handleAnswerSelect = useCallback((answerIndex) => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answerIndex;
      return newAnswers;
    });
  }, [currentQuestionIndex]);

  const toggleFlagQuestion = useCallback(() => {
    setFlaggedQuestions(prev => {
      const newFlags = new Set(prev);
      if (newFlags.has(currentQuestionIndex)) {
        newFlags.delete(currentQuestionIndex);
      } else {
        newFlags.add(currentQuestionIndex);
      }
      return newFlags;
    });
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < validatedQuestions.length) {
      setCurrentQuestionIndex(index);
      setIsReviewMode(false);
      if (mainContentRef.current) {
        mainContentRef.current.focus();
      }
    }
  }, [validatedQuestions.length]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < validatedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentQuestionIndex === validatedQuestions.length - 1) {
      // On last question, go to review mode
      setIsReviewMode(true);
    }
  }, [currentQuestionIndex, validatedQuestions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      clearInterval(timerRef.current);
      
      // Just pass the answers array directly to onFinish
      if (typeof onFinish === 'function') {
        await onFinish(answers);
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
      setIsSubmitting(false);
    }
  }, [isSubmitting, answers, onFinish]);

  // Initialize quiz questions
  useEffect(() => {
    try {
      const validQuestions = Array.isArray(initialQuestions) 
        ? initialQuestions.filter(q => 
            q && 
            q.question && 
            Array.isArray(q.options) && 
            q.options.length >= 2 && 
            q.correctAnswer != null
          )
        : [];
      
      setValidatedQuestions(validQuestions);
      setAnswers(new Array(validQuestions.length).fill(null));
      
      // Calculate total time (1 minute per question, minimum 1 minute)
      const totalTime = Math.max(validQuestions.length * 60, 60);
      setTimeRemaining(totalTime);
    } catch (err) {
      setError('Failed to load quiz questions. Please try again.');
      console.error('Error initializing quiz:', err);
    }
  }, [initialQuestions]);

  // Timer effect - separate from initialization
  useEffect(() => {
    if (validatedQuestions.length === 0) return;
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [validatedQuestions.length, handleSubmit]);

  // Derived state
  const currentQuestion = validatedQuestions[currentQuestionIndex] || {};
  const currentAnswer = answers[currentQuestionIndex];
  const answeredCount = answers.filter(a => a !== null).length;
  const progressPercentage = validatedQuestions.length > 0 
    ? (answeredCount / validatedQuestions.length) * 100 
    : 0;

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Quiz</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Restart Quiz
          </button>
        </div>
      </div>
    );
  }

  // Handle no questions state
  if (validatedQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No Questions Available</h2>
          <p className="text-gray-700 mb-6">
            We couldn't find any valid questions to display. Please try uploading a different document or check the content format.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main quiz interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only absolute left-0 top-0 bg-blue-600 text-white px-4 py-2 z-50"
      >
        Skip to main content
      </a>

      {/* Header with timer and progress */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Quiz</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {difficulty}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm font-medium text-gray-700">
                <span className="mr-1">⏱️</span>
                <span>{formatTime(timeRemaining)}</span>
              </div>
              <button
                onClick={() => setIsReviewMode(true)}
                className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                aria-label="Review all questions"
              >
                Review ({answeredCount}/{validatedQuestions.length})
              </button>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
              aria-valuenow={Math.round(progressPercentage)}
              aria-valuemin="0"
              aria-valuemax="100"
              role="progressbar"
            />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main 
        id="main-content" 
        ref={mainContentRef}
        tabIndex="-1"
        className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 focus:outline-none"
      >
        {isReviewMode ? (
          // Review mode
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Review Your Answers</h2>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm font-medium ml-4"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
            <button
              onClick={() => setIsReviewMode(false)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Back to Quiz
            </button>
            
            {/* Review questions list */}
            <div className="mt-6 space-y-4">
              {validatedQuestions.map((question, index) => (
                <div 
                  key={index}
                  className={`p-4 border rounded-lg ${
                    answers[index] !== null 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        Q{index + 1}. {question.question}
                      </h3>
                      {answers[index] !== null ? (
                        <p className="mt-1 text-sm text-gray-600">
                          Your answer: {String.fromCharCode(65 + answers[index])}. {question.options[answers[index]]}
                        </p>
                      ) : (
                        <p className="mt-1 text-sm text-red-600">Not answered</p>
                      )}
                    </div>
                    <button
                      onClick={() => goToQuestion(index)}
                      className="ml-4 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      Go to question
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Quiz mode
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Question header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Question {currentQuestionIndex + 1} of {validatedQuestions.length}
                </h2>
                <button
                  onClick={toggleFlagQuestion}
                  className={`text-sm font-medium flex items-center ${
                    flaggedQuestions.has(currentQuestionIndex)
                      ? 'text-yellow-600 hover:text-yellow-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  aria-label={
                    flaggedQuestions.has(currentQuestionIndex)
                      ? 'Unflag this question'
                      : 'Flag this question for review'
                  }
                >
                  {flaggedQuestions.has(currentQuestionIndex) ? '⭐' : '☆'} Flag
                </button>
              </div>
            </div>

            {/* Question content */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Options */}
              <fieldset className="space-y-3">
                <legend className="sr-only">Options</legend>
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`relative p-4 border rounded-lg cursor-pointer transition-colors ${
                      currentAnswer === index
                        ? 'bg-blue-50 border-blue-300'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleAnswerSelect(index);
                      }
                    }}
                    role="radio"
                    aria-checked={currentAnswer === index}
                    tabIndex={0}
                  >
                    <div className="flex items-center">
                      <div className="flex items-center h-5">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            currentAnswer === index ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                          }`}
                        >
                          {currentAnswer === index && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
                          )}
                        </div>
                      </div>
                      <div className="ml-3 text-sm">
                        <span className="font-medium text-gray-900">
                          {String.fromCharCode(65 + index)}. {option}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </fieldset>
            </div>

            {/* Navigation buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  currentQuestionIndex === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                Previous
              </button>
              
              {currentQuestionIndex < validatedQuestions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={() => setIsReviewMode(true)}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm font-medium"
                >
                  Review & Submit
                </button>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Quiz;
