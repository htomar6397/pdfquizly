import React, { useState, useEffect, useRef, useCallback } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function Result({ questions = [], answers = [], difficulty = 'Easy' }) {
  const [showDetails, setShowDetails] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const detailsRef = useRef(null);

  // Ensure answers is an array and has the same length as questions
  const validAnswers = Array.isArray(answers) ? answers : [];
  const score = questions.reduce((count, question, index) => {
    return count + (validAnswers[index] === question.correctAnswer ? 1 : 0);
  }, 0);
  
  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 60; // 60% passing threshold

  // Animate score and slide-in on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimateScore(true), 500);
    setTimeout(() => setSlideIn(true), 100); // slight delay for smoothness
    return () => clearTimeout(timer);
  }, []);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Outstanding! 🎉", color: "text-green-600", bg: "bg-green-50" };
    if (percentage >= 80) return { message: "Excellent work! 👏", color: "text-green-600", bg: "bg-green-50" };
    if (percentage >= 70) return { message: "Good job! 👍", color: "text-blue-600", bg: "bg-blue-50" };
    if (percentage >= 60) return { message: "Well done! ✓", color: "text-blue-600", bg: "bg-blue-50" };
    return { message: "Keep practicing! 📚", color: "text-orange-600", bg: "bg-orange-50" };
  };

  const performance = getPerformanceMessage();

  const toggleDetails = useCallback(() => {
    const newShowDetails = !showDetails;
    setShowDetails(newShowDetails);
    
    if (newShowDetails) {
      // Wait for the next render to ensure the details section is in the DOM
      setTimeout(() => {
        if (detailsRef.current) {
          detailsRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, [showDetails]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Results Card */}
        <div className={`bg-white rounded-2xl shadow-xl p-8 mb-6 text-center border border-gray-100 transition-all duration-700 ease-out transform ${slideIn ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`}>
          {/* Header with difficulty */}
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Quiz Results
              <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium align-middle ${
                difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {difficulty}
              </span>
            </h1>
          </div>

          {/* Celebration Icon */}
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className={`w-full h-full rounded-full flex items-center justify-center text-4xl ${
              passed ? 'bg-green-100' : 'bg-orange-100'
            } transition-all duration-1000 ${animateScore ? 'scale-100' : 'scale-0'}`}>
              {passed ? '🎉' : '📚'}
            </div>
          </div>

          {/* Results Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quiz Completed!
          </h1>
          
          <div className={`inline-block px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            performance.bg
          } ${performance.color}`}>
            {performance.message}
          </div>

          {/* Score Display */}
          <div className="mb-8">
            <div className={`text-6xl font-bold mb-2 transition-all duration-1000 ${
              animateScore ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            } ${passed ? 'text-green-600' : 'text-orange-600'}`}>
              {percentage}%
            </div>
            <p className="text-xl text-gray-600">
              <span className="font-semibold">{score}</span> out of <span className="font-semibold">{questions.length}</span> correct
            </p>
          </div>

          {/* Progress Ring */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-200"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={passed ? 'text-green-500' : 'text-orange-500'}
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray={`${percentage}, 100`}
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  style={{
                    transition: 'stroke-dasharray 2s ease-in-out',
                    strokeDasharray: animateScore ? `${percentage}, 100` : '0, 100'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-2xl font-bold ${
                  passed ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {passed ? '✓' : '○'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={toggleDetails}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {showDetails ? 'Hide' : 'View'} Detailed Results
            </button>
            

            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Another Quiz
            </button>
          </div>
        </div>

        {/* Detailed Results */}
        <div 
          ref={detailsRef}
          className={`transition-all duration-500 ease-in-out overflow-hidden ${
            showDetails ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mt-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Review</h2>
            <div className="space-y-4">
              {questions.map((question, index) => {
                const userAnswer = answers[index];
                const correctAnswer = question.options[question.correctAnswer];
                const userAnswerText = userAnswer !== null ? question.options[userAnswer] : 'Not answered';
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={index} className={`p-4 rounded-lg border-2 ${
                    isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900 flex-1">
                        {index + 1}. {question.question}
                      </h3>
                      <div className={`ml-4 px-2 py-1 rounded text-xs font-medium ${
                        isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </div>
                    </div>
                    
                    <div className="text-sm space-y-1">
                      <p className={`${
                        userAnswer ? 'text-gray-700' : 'text-gray-500 italic'
                      }`}>
                        <span className="font-medium">Your answer:</span> {userAnswerText}
                      </p>
                      {!isCorrect && (
                        <p className="text-green-700">
                          <span className="font-medium">Correct answer:</span> {correctAnswer}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}

    </div>
  );
}
