import React from 'react';
import { Player, VoteRecord } from '../types/game';

interface RoundResultProps {
  players: Player[];
  votes: VoteRecord[];
  eliminatedId: number;
  minorityWon: boolean;
  pointsAwarded: Record<number, number>;
  onCheckTopics: () => void;
  onNextRound: () => void;
  onEndGame: () => void;
}

export function RoundResult({
  players,
  votes,
  eliminatedId,
  minorityWon,
  pointsAwarded,
  onCheckTopics,
  onNextRound,
  onEndGame,
}: RoundResultProps): JSX.Element {
  const eliminatedPlayer = players.find((p) => p.id === eliminatedId);

  // Count votes by target
  const voteCounts = new Map<number, number>();
  for (const vote of votes) {
    voteCounts.set(vote.targetId, (voteCounts.get(vote.targetId) ?? 0) + 1);
  }

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-3xl font-bold text-center mb-4">Round Result</h2>

          {/* Elimination + Result */}
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-2">Player Eliminated:</p>
            <p className="text-3xl font-bold text-indigo-600 mb-4">{eliminatedPlayer?.name}</p>
            <p className={`text-2xl font-bold ${minorityWon ? 'text-purple-600' : 'text-indigo-600'}`}>
              {minorityWon ? '🐺 Minority Wins!' : '👨‍👩‍👧‍👦 Majority Wins!'}
            </p>
          </div>

          {/* Vote Tally */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Vote Tally</h3>
            <div className="space-y-2">
              {players.map((player) => (
                <div key={player.id} className="flex justify-between bg-gray-100 rounded-lg p-3">
                  <span className="font-semibold">{player.name}</span>
                  <span className="font-bold text-indigo-600">{voteCounts.get(player.id) ?? 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Points Awarded This Round */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Points This Round</h3>
            <div className="space-y-2">
              {players.map((player) => {
                const pointsEarned = pointsAwarded[player.id] ?? 0;
                return (
                  <div key={player.id} className="flex justify-between bg-gray-100 rounded-lg p-3">
                    <span className="font-semibold">{player.name}</span>
                    <span className={`font-bold ${pointsEarned > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                      +{pointsEarned}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cumulative Scores */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Cumulative Scores</h3>
            <div className="space-y-2">
              {sortedPlayers.map((player, index) => (
                <div key={player.id} className="flex justify-between bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                  <span className="font-semibold">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '·'} {player.name}
                  </span>
                  <span className="font-bold text-indigo-600">{player.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onCheckTopics}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl px-6 py-3 font-bold text-lg transition"
            >
              Check Topics
            </button>
            <button
              onClick={onNextRound}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-3 font-bold text-lg transition"
            >
              Next Round
            </button>
            <button
              onClick={onEndGame}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl px-6 py-3 font-bold text-lg transition"
            >
              End Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
