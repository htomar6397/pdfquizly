import React from 'react';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-full">
          <p className="text-sm text-gray-600">
            Building with <span className="text-blue-600">❤️</span> at <a href="https://mvpx.studio" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">mvpx.studio</a> 🚀
          </p>
        </div>
      </div>
    </footer>
  );
}
