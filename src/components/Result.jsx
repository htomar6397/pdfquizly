import React, { useState, useEffect } from "react";
import ConfirmDialog from "./ConfirmDialog";

export default function Result({ questions, answers, onRestart }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [animateScore, setAnimateScore] = useState(false);

  const score = answers.filter(
    (a, i) => a === questions[i].correctAnswer
  ).length;
  
  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 60; // 60% passing threshold

  // Animate score on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimateScore(true), 500);
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

  const handleRestart = () => {
    setShowConfirm(true);
  };

  const confirmRestart = () => {
    setShowConfirm(false);
    onRestart();
  };

  const downloadResults = () => {
    const results = {
      score: `${score}/${questions.length}`,
      percentage: `${percentage}%`,
      passed: passed,
      date: new Date().toLocaleDateString(),
      questions: questions.map((q, i) => ({
        question: q.question,
        yourAnswer: q.options[answers[i]] || 'Not answered',
        correctAnswer: q.options[q.correctAnswer],
        isCorrect: answers[i] === q.correctAnswer
      }))
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Main Results Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 text-center border border-gray-100">
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
              onClick={() => setShowDetails(!showDetails)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {showDetails ? 'Hide' : 'View'} Detailed Results
            </button>
            
            <button
              onClick={downloadResults}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Results
            </button>
            
            <button
              onClick={handleRestart}
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
        {showDetails && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
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
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmRestart}
        title="Start New Quiz?"
        message="This will take you back to upload a new PDF. Your current results will be lost unless you download them first."
        confirmText="Start New Quiz"
        cancelText="Stay Here"
        type="default"
      />
    </div>
  );
}
