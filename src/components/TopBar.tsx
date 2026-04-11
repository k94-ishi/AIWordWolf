import React from 'react';

interface TopBarProps {
  onEndGame: () => void;
  showEndButton: boolean;
}

export function TopBar({ onEndGame, showEndButton }: TopBarProps): JSX.Element {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <h1 className="text-2xl font-bold">🐺 Word Wolf</h1>
      {showEndButton && (
        <button
          onClick={onEndGame}
          className="bg-rose-500 hover:bg-rose-600 text-white rounded-lg px-4 py-2 font-semibold text-sm"
        >
          End Game
        </button>
      )}
    </div>
  );
}
