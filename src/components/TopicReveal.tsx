import React from 'react';
import { Player } from '../types/game';

interface TopicRevealProps {
  players: Player[];
  onBack: () => void;
}

export function TopicReveal({ players, onBack }: TopicRevealProps): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-3xl font-bold text-center mb-8">Topics Revealed</h2>

          <div className="overflow-x-auto mb-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-indigo-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Player</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Word</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-800">{player.name}</td>
                    <td className="py-3 px-4 text-gray-800">
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg font-bold">
                        {player.word}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-lg font-bold ${
                          player.isMinority
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {player.isMinority ? '🐺 Minority' : '👨‍👩‍👧‍👦 Majority'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={onBack}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-3 font-bold text-lg transition"
          >
            Back to Results
          </button>
        </div>
      </div>
    </div>
  );
}
