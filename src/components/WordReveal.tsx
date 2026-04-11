import React, { useState } from 'react';
import { Player } from '../types/game';

interface WordRevealProps {
  players: Player[];
  currentPlayerIndex: number;
  onNext: () => void;
  onAllPlayersViewed: () => void;
}

export function WordReveal({
  players,
  currentPlayerIndex,
  onNext,
  onAllPlayersViewed,
}: WordRevealProps): JSX.Element {
  const [step, setStep] = useState<'confirm' | 'word'>('confirm');
  const player = players[currentPlayerIndex];
  const isLastPlayer = currentPlayerIndex === players.length - 1;

  const handleConfirm = () => {
    setStep('word');
  };

  const handleWordRevealed = () => {
    if (isLastPlayer) {
      onAllPlayersViewed();
    } else {
      setStep('confirm');
      onNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {step === 'confirm' ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Are you {player.name}?</h2>
            <button
              onClick={handleConfirm}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-4 font-bold text-lg transition"
            >
              Yes, it's me ✅
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Your word is:</h2>
            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-8 mb-8 text-center">
              <p className="text-5xl font-bold text-indigo-600">{player.word}</p>
            </div>
            <button
              onClick={handleWordRevealed}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-4 font-bold text-lg transition"
            >
              {isLastPlayer ? 'Everyone got their word! →' : 'Got it! Hand to next →'}
            </button>
          </>
        )}

        <p className="text-xs text-gray-500 text-center mt-6">
          Player {currentPlayerIndex + 1} of {players.length}
        </p>
      </div>
    </div>
  );
}
