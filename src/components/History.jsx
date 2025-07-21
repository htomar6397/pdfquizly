import React, { useState, useEffect } from 'react';

export default function History({ onBackToHome }) {
  const [quizHistory, setQuizHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'new', 'pyq', 'completed'
  const [sortBy, setSortBy] = useState('date'); // 'date', 'score', 'name'
  const [searchTerm, setSearchTerm] = useState('');

  // Load quiz history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('quizHistory');
    if (savedHistory) {
      const history = JSON.parse(savedHistory);
      setQuizHistory(history);
      setFilteredHistory(history);
    }
  }, []);

  // Filter and sort history
  useEffect(() => {
    let filtered = [...quizHistory];

    // Apply mode filter
    if (filterMode !== 'all') {
      if (filterMode === 'completed') {
        filtered = filtered.filter(quiz => quiz.completed);
      } else {
        filtered = filtered.filter(quiz => quiz.mode === filterMode);
      }
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'name':
          return a.fileName.localeCompare(b.fileName);
        case 'date':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredHistory(filtered);
  }, [quizHistory, filterMode, sortBy, searchTerm]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all quiz history? This action cannot be undone.')) {
      localStorage.removeItem('quizHistory');
      setQuizHistory([]);
      setFilteredHistory([]);
    }
  };

  const deleteQuiz = (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz from history?')) {
      const updatedHistory = quizHistory.filter(quiz => quiz.id !== quizId);
      setQuizHistory(updatedHistory);
      localStorage.setItem('quizHistory', JSON.stringify(updatedHistory));
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quiz History</h1>
              <p className="text-gray-600 mt-1">
                Track your learning progress and review past quizzes
              </p>
            </div>
            <button
              onClick={onBackToHome}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Home
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{quizHistory.length}</div>
              <div className="text-sm text-blue-700">Total Quizzes</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {quizHistory.filter(q => q.completed).length}
              </div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {quizHistory.filter(q => q.mode === 'pyq').length}
              </div>
              <div className="text-sm text-purple-700">PYQ Quizzes</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {quizHistory.filter(q => q.completed).length > 0 
                  ? Math.round(quizHistory.filter(q => q.completed).reduce((acc, q) => acc + (q.score || 0), 0) / quizHistory.filter(q => q.completed).length)
                  : 0}%
              </div>
              <div className="text-sm text-orange-700">Avg Score</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search quizzes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Quizzes</option>
              <option value="new">New Quizzes</option>
              <option value="pyq">PYQ Quizzes</option>
              <option value="completed">Completed Only</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="score">Sort by Score</option>
              <option value="name">Sort by Name</option>
            </select>
            {quizHistory.length > 0 && (
              <button
                onClick={clearHistory}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Quiz List */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Quiz History Found</h3>
            <p className="text-gray-500 mb-6">
              {searchTerm || filterMode !== 'all' 
                ? 'No quizzes match your current filters. Try adjusting your search or filter settings.'
                : 'Start taking quizzes to see your history here.'}
            </p>
            <button
              onClick={onBackToHome}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Quiz
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredHistory.map((quiz) => (
              <div key={quiz.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {quiz.fileName || 'Untitled Quiz'}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        quiz.mode === 'pyq' 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {quiz.mode === 'pyq' ? 'PYQ' : 'New'}
                      </span>
                      {quiz.completed && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreBadge(quiz.score)}`}>
                          {quiz.score}%
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span>{quiz.numQuestions} questions</span>
                      <span>•</span>
                      <span>{quiz.difficulty}</span>
                      <span>•</span>
                      <span>{formatDate(quiz.createdAt)}</span>
                      {quiz.completed && (
                        <>
                          <span>•</span>
                          <span className={getScoreColor(quiz.score)}>
                            Completed with {quiz.score}%
                          </span>
                        </>
                      )}
                    </div>

                    {quiz.fileSize && (
                      <div className="text-xs text-gray-400">
                        File size: {(quiz.fileSize / 1024 / 1024).toFixed(2)} MB
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteQuiz(quiz.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete quiz"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
