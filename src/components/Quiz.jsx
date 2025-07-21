import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Quiz Component
 * A fully accessible and robust quiz component with error handling and review functionality
 */
const Quiz = ({ questions = [], onFinish, error = null }) => {
  // Timer configuration
  const TOTAL_QUIZ_TIME = 10 * 60; // 10 minutes in seconds

  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_QUIZ_TIME);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const timerRef = useRef(null);
  const mainContentRef = useRef(null);

  // Handle quiz submission with error handling
  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      onFinish(answers);
    } catch (err) {
      console.error('Error submitting quiz:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [answers, isSubmitting, onFinish]);

  // Validate questions prop
  const validatedQuestions = React.useMemo(() => {
    console.log('Validating questions:', questions);
    
    if (!Array.isArray(questions) || questions.length === 0) {
      console.error('Invalid or empty questions array');
      return [];
    }
    
    const filtered = questions.filter((q, index) => {
      const isValid = q && 
        typeof q.question === 'string' && 
        Array.isArray(q.options) && 
        q.options.length > 0 &&
        typeof q.correctAnswer === 'number' &&
        q.correctAnswer >= 0 && 
        q.correctAnswer < q.options.length;
      
      if (!isValid) {
        console.warn(`Invalid question at index ${index}:`, q);
      }
      return isValid;
    });
    
    console.log(`Filtered ${filtered.length} valid questions out of ${questions.length}`);
    return filtered;
  }, [questions]);

  // Initialize answers
  useEffect(() => {
    setAnswers(new Array(validatedQuestions.length).fill(null));
  }, [validatedQuestions]);

  // Timer effect - 10 minute countdown for entire quiz
  useEffect(() => {
    // Start the countdown timer
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

    // Clean up the interval when component unmounts
    return () => clearInterval(timerRef.current);
  }, [handleSubmit]);

  // Focus management for accessibility
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.focus();
    }
  }, [currentQuestionIndex, isReviewMode]);

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
    }
  }, [validatedQuestions.length]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < validatedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, validatedQuestions.length]);

  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);



  // Utility functions
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = validatedQuestions.length > 0 
    ? (answers.filter(a => a !== null).length / validatedQuestions.length) * 100 
    : 0;
    
  // Get current question data
  const currentQuestion = validatedQuestions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const answeredCount = answers.filter(a => a !== null).length;

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
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

  // Render the quiz interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only absolute left-0 top-0 bg-blue-600 text-white px-4 py-2 z-50"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-900">Quiz</h1>
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
                onClick={() => setIsReviewMode(false)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Back to Quiz
              </button>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 mb-6">
              {validatedQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium transition-colors ${
                    answers[index] !== null
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200'
                  } ${
                    flaggedQuestions.has(index) ? 'ring-2 ring-yellow-400' : ''
                  }`}
                  aria-label={`Question ${index + 1}${answers[index] !== null ? ', answered' : ''}${flaggedQuestions.has(index) ? ', flagged for review' : ''}`}
                  aria-current={currentQuestionIndex === index ? 'step' : undefined}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {answeredCount} of {validatedQuestions.length} answered
                {flaggedQuestions.size > 0 && (
                  <span className="ml-4">
                    {flaggedQuestions.size} flagged for review
                  </span>
                )}
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </div>
        ) : (
          // Quiz mode
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Question header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Question {currentQuestionIndex + 1} of {validatedQuestions.length}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="text-lg font-medium">
                    Time Left: {formatTime(timeRemaining)}
                  </div>
                  <button
                    onClick={toggleFlagQuestion}
                    className={`text-sm font-medium flex items-center ${
                      flaggedQuestions.has(currentQuestionIndex)
                        ? 'text-yellow-600 hover:text-yellow-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    aria-label={flaggedQuestions.has(currentQuestionIndex) ? 'Unflag this question' : 'Flag this question for review'}
                  >
                    {flaggedQuestions.has(currentQuestionIndex) ? '⭐' : '☆'} Flag
                  </button>
                </div>
              </div>
            </div>

            {/* Question content */}
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <fieldset className="space-y-3">
                <legend className="sr-only">Select an option</legend>
                {currentQuestion.options.map((option, index) => (
                  <div 
                    key={index}
                    className={`relative p-4 border rounded-lg cursor-pointer transition-colors ${
                      currentAnswer === index
                        ? 'bg-blue-50 border-blue-300'
                        : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                    role="radio"
                    aria-checked={currentAnswer === index}
                    tabIndex="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleAnswerSelect(index);
                      }
                    }}
                  >
                    <div className="flex items-center">
                      <div className="flex items-center h-5">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          currentAnswer === index 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                        }`}>
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
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 text-sm font-medium"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
              )}
            </div>
          </div>
        )}
      </main>

     
    </div>
  );
};

// Runtime type checking
const validateProps = (props) => {
  if (!Array.isArray(props.questions)) {
    console.error('Invalid questions prop: expected an array');
    return false;
  }
  
  if (typeof props.onFinish !== 'function') {
    console.error('Invalid onFinish prop: expected a function');
    return false;
  }
  
  return true;
};

// Validate props when component mounts
const QuizWithValidation = (props) => {
  useEffect(() => {
    if (import.meta.env.MODE !== 'production') {
      validateProps(props);
    }
  }, [props]);
  
  return <Quiz {...props} />;
};

export default QuizWithValidation;
