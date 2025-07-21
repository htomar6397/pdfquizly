import React from 'react';

export default function Hero({
  onUpload,
  difficulty,
  setDifficulty,
  numQuestions,
  setNumQuestions,
  error,
}) {
  return (
    
     
        <div className="min-h-[calc(100vh-7rem)] bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center ">
          {/* Tag */}
          <div className="inline-flex items-center px-3 py-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            AI-Powered Quiz Generator
          </div>
          
          {/* Main Content */}
          <div className="text-center flex flex-col items-center justify-center ">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              Transform Your PDFs into
              <span className="text-blue-600"> Interactive Quizzes</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Upload your study materials and generate personalized quizzes instantly. 
              Perfect for exam preparation and knowledge assessment.
            </p>
          </div>
          
        {/* Main Function - Quiz Options */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 max-w-4xl mx-auto my-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Create Your Quiz</h3>
          
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            
            {/* Difficulty Level */}
            {/* Simplified Difficulty Dropdown */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            
            {/* Simplified Questions Dropdown */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Questions
              </label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value={5}>5 Questions</option>
                <option value={10}>10 Questions</option>
                <option value={15}>15 Questions</option>
                <option value={20}>20 Questions</option>
              </select>
            </div>
            
            {/* Upload Button */}
            <div>
              <label className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 rounded-lg shadow cursor-pointer font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center group">
                <svg className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Upload PDF & Generate Quiz
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={onUpload}
                />
              </label>
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200 flex items-start">
              <svg className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          {/* Info Note */}
          <p className="text-xs text-gray-500 mt-3 text-center">
            📄 Supports English text PDFs only • 🔒 Your data is secure
          </p>
        </div>
        
        {/* Features - Compact */}
        <div className="grid grid-cols-3 gap-4 mt-6 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="text-xs font-semibold text-gray-900 mb-1">Lightning Fast</h4>
            <p className="text-[10px] text-gray-600">Generate in seconds</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-xs font-semibold text-gray-900 mb-1">Smart Questions</h4>
            <p className="text-[10px] text-gray-600">AI-powered content</p>
          </div>
          
          <div className="text-center">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-xs font-semibold text-gray-900 mb-1">Track Progress</h4>
            <p className="text-[10px] text-gray-600">Monitor learning</p>
          </div>
        </div>
      </div>
   
  );
}
