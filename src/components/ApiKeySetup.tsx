import React, { useState } from 'react';
import { sanitizeApiKey, isValidApiKey } from '../utils/sanitize';

interface ApiKeySetupProps {
  onActivate: (apiKey: string) => void;
}

export function ApiKeySetup({ onActivate }: ApiKeySetupProps): JSX.Element {
  const [enteredKey, setEnteredKey] = useState('');
  const [error, setError] = useState('');

  const handleActivate = () => {
    const clean = sanitizeApiKey(enteredKey);
    if (!clean || !isValidApiKey(clean)) {
      setError('API key is invalid. Please check and try again.');
      return;
    }
    onActivate(clean);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2">🐺 Word Wolf</h1>
        <p className="text-center text-gray-600 mb-8">
          A party game for guessing the minority word
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Google Generative AI API Key
            </label>
            <input
              type="password"
              value={enteredKey}
              onChange={(e) => {
                setEnteredKey(e.target.value);
                setError('');
              }}
              placeholder="AIza..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-gray-500 mt-2">
              Get your API key from{' '}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-500 underline hover:text-indigo-600"
              >
                aistudio.google.com/apikey
              </a>
            </p>
          </div>

          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

          <button
            onClick={handleActivate}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-3 font-bold text-lg transition"
          >
            Activate ✅
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-6">
          Your API key is stored locally only. Never shared with any server.
        </p>
      </div>
    </div>
  );
}
