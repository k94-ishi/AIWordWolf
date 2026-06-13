import React, { useState } from 'react';
import { Difficulty } from '../types/game';
import { sanitizePlayerName } from '../utils/sanitize';

interface GameSetupProps {
  onStart: (playerCount: number, minorityCount: number, difficulty: Difficulty, timerMinutes: number, playerNames: string[]) => void;
  onChangeApiKey: () => void;
}

export function GameSetup({ onStart, onChangeApiKey }: GameSetupProps): JSX.Element {
  const [playerCount, setPlayerCount] = useState(4);
  const [minorityCount, setMinorityCount] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [playerNames, setPlayerNames] = useState(
    Array.from({ length: 4 }, (_, i) => `Player${i + 1}`)
  );

  const handlePlayerCountChange = (newCount: number) => {
    setPlayerCount(newCount);
    if (minorityCount > newCount - 2) {
      setMinorityCount(Math.max(1, newCount - 2));
    }
    // Adjust player names array
    setPlayerNames(prevNames => {
      const newNames = [...prevNames];
      if (newCount > prevNames.length) {
        // Add new players
        for (let i = prevNames.length; i < newCount; i++) {
          newNames.push(`Player${i + 1}`);
        }
      } else if (newCount < prevNames.length) {
        // Remove excess players
        newNames.splice(newCount);
      }
      return newNames;
    });
  };

  const handlePlayerNameChange = (index: number, value: string) => {
    const sanitized = sanitizePlayerName(value);
    const newNames = [...playerNames];
    newNames[index] = sanitized || `Player${index + 1}`;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    onStart(playerCount, minorityCount, difficulty, timerMinutes, playerNames);
  };

  const maxMinority = playerCount - 2;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Game Setup</h2>

        <div className="space-y-6">
          {/* Player Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Number of Players: {playerCount}
            </label>
            <input
              type="range"
              min="3"
              max="10"
              value={playerCount}
              onChange={(e) => handlePlayerCountChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">Min: 3, Max: 10</p>
          </div>

          {/* Minority Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Minority Players (Wolves): {minorityCount}
            </label>
            <input
              type="range"
              min="1"
              max={maxMinority}
              value={minorityCount}
              onChange={(e) => setMinorityCount(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">Max: {maxMinority}</p>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Difficulty:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d as Difficulty)}
                  className={`py-2 rounded-lg font-semibold text-sm transition ${
                    difficulty === d
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {['', 'Easy', 'Normal', 'Hard'][difficulty]}
            </p>
          </div>

          {/* Timer */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Discussion Time: {timerMinutes}m
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={timerMinutes}
              onChange={(e) => setTimerMinutes(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">1-10 minutes</p>
          </div>

          {/* Player Names */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Player Names
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {playerNames.map((name, index) => (
                <input
                  key={index}
                  type="text"
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  placeholder={`Player ${index + 1}`}
                  maxLength={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full mt-8 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-3 font-bold text-lg transition"
        >
          Start Game
        </button>

        <button
          onClick={onChangeApiKey}
          className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl px-6 py-2 font-semibold text-sm transition"
        >
          Change API Key
        </button>
      </div>
    </div>
  );
}
