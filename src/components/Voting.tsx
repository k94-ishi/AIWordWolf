import React, { useState } from 'react';
import { Player, VoteRecord } from '../types/game';

interface VotingProps {
  players: Player[];
  everyoneVotes: boolean;
  onVotesSubmitted: (votes: VoteRecord[]) => void;
}

export function Voting({ players, everyoneVotes, onVotesSubmitted }: VotingProps): JSX.Element {
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [votes, setVotes] = useState<VoteRecord[]>([]);

  const currentVoter = players[currentVoterIndex];
  const isLastVoter = currentVoterIndex === players.length - 1;

  const handleVote = (targetId: number) => {
    if (!everyoneVotes) {
      // Representative voting - all players get this one vote
      onVotesSubmitted(
        players.map((player) => ({
          voterId: player.id,
          targetId,
        }))
      );
      return;
    }

    // Everyone voting - record this vote and move to next
    const newVotes = [
      ...votes,
      {
        voterId: currentVoter.id,
        targetId,
      },
    ];
    setVotes(newVotes);

    if (isLastVoter) {
      onVotesSubmitted(newVotes);
    } else {
      setCurrentVoterIndex(currentVoterIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-8">
          {everyoneVotes ? `${currentVoter.name}'s Vote` : 'Who is the minority?'}
        </h2>

        <div className="space-y-3 mb-8">
          {players.map((player) => (
            <button
              key={player.id}
              onClick={() => handleVote(player.id)}
              disabled={everyoneVotes && player.id === currentVoter.id}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-lg transition ${
                everyoneVotes && player.id === currentVoter.id
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-500 hover:text-white'
              }`}
            >
              {player.name}
            </button>
          ))}
        </div>

        {everyoneVotes && (
          <p className="text-xs text-gray-500 text-center">
            Voter {currentVoterIndex + 1} of {players.length}
          </p>
        )}
      </div>
    </div>
  );
}
