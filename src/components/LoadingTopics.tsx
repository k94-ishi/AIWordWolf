import React from 'react';

interface LoadingTopicsProps {
  error: string | null;
  onRetry: () => void;
}

export function LoadingTopics({ error, onRetry }: LoadingTopicsProps): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {error ? (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={onRetry}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-3 font-bold text-lg transition"
            >
              Try Again
            </button>
          </>
        ) : (
          <>
            <p className="text-3xl mb-4">🎯</p>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Topics...</h2>
            <p className="text-gray-600 mb-6">AI is creating your game topics</p>
            <div className="flex justify-center gap-2">
              <div className="h-3 w-3 bg-indigo-500 rounded-full animate-bounce"></div>
              <div className="h-3 w-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="h-3 w-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
