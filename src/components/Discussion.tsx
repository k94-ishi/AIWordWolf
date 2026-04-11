import React, { useState, useEffect } from 'react';

interface DiscussionProps {
  timerMinutes: number;
  onEveryoneVotes: () => void;
  onRepresentativeVotes: () => void;
}

export function Discussion({
  timerMinutes,
  onEveryoneVotes,
  onRepresentativeVotes,
}: DiscussionProps): JSX.Element {
  const totalSeconds = timerMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeDisplay = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-8">🕐 Discussion Time</h2>

        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-12 mb-8 text-center">
          <p className="text-6xl font-bold text-indigo-600 font-mono">{timeDisplay}</p>
        </div>

        <p className="text-center text-gray-600 mb-8">
          Discuss who you think is the minority player. The timer will stop at 00:00 but won't move
          you forward.
        </p>

        <div className="space-y-3">
          <button
            onClick={onEveryoneVotes}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-4 font-bold text-lg transition"
          >
            Everyone Votes 🗳️
          </button>
          <button
            onClick={onRepresentativeVotes}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl px-6 py-4 font-bold text-lg transition"
          >
            One Representative Votes
          </button>
        </div>
      </div>
    </div>
  );
}
