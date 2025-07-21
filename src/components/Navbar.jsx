import React from 'react';

export default function Navbar({ onShowHistory, currentView }) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-gray-90 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
            <img
              src="/logo.svg"
              alt="PdfQuizly Logo"
              className="w-10 h-10"
            />
            <h1 className="text-2xl font-bold text-gray-900">
              PdfQuizly
            </h1>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => onShowHistory('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'home'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
                cursor-pointer`}
              >
                Home
              </button>
              <button
                onClick={() => onShowHistory('history')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'history'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }
                cursor-pointer`}
              >
                History
              </button>
              <span className="inline-flex items-center text-white font-semibold rounded-xl px-2 py-1 bg-gradient-to-r from-red-500 to-red-600 text-xs">
                Beta
              </span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => onShowHistory(currentView === 'home' ? 'history' : 'home')}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
            >
              {currentView === 'home' ? 'History' : 'Home'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
