import { Player, TopicPair, VoteRecord } from '../types/game';

/**
 * Randomly assign minority roles to minorityCount players
 */
export function assignRoles(
  players: Player[],
  minorityCount: number,
  topics: TopicPair
): Player[] {
  const indices = Array.from({ length: players.length }, (_, i) => i).sort(
    () => Math.random() - 0.5
  );

  const minorityIndices = new Set(indices.slice(0, minorityCount));

  return players.map((player, index) => {
    const isMinority = minorityIndices.has(index);
    return {
      ...player,
      isMinority,
      word: isMinority ? topics.minorityWord : topics.majorityWord,
    };
  });
}

/**
 * Count votes and return the player id with the most votes (lowest index on tie)
 */
export function countVotes(votes: VoteRecord[]): number {
  const voteCounts = new Map<number, number>();

  for (const vote of votes) {
    voteCounts.set(vote.targetId, (voteCounts.get(vote.targetId) ?? 0) + 1);
  }

  let maxVotes = 0;
  let eliminatedId = -1;

  for (const [playerId, count] of voteCounts.entries()) {
    if (count > maxVotes || (count === maxVotes && (eliminatedId === -1 || playerId < eliminatedId))) {
      maxVotes = count;
      eliminatedId = playerId;
    }
  }

  return eliminatedId;
}

/**
 * Calculate points for this round and return updated players
 */
export function calculateScores(
  players: Player[],
  eliminatedId: number,
  minorityCount: number
): {
  updatedPlayers: Player[];
  minorityWon: boolean;
  pointsAwarded: Record<number, number>;
} {
  const eliminatedPlayer = players.find((p) => p.id === eliminatedId);
  if (!eliminatedPlayer) {
    throw new Error(`Player with id ${eliminatedId} not found`);
  }

  const pointsAwarded: Record<number, number> = {};
  let minorityWon = false;

  const majorityCount = players.length - minorityCount;

  if (eliminatedPlayer.isMinority) {
    // Majority wins
    minorityWon = false;
    for (const player of players) {
      if (!player.isMinority) {
        pointsAwarded[player.id] = minorityCount;
      }
    }
  } else {
    // Minority wins
    minorityWon = true;
    for (const player of players) {
      if (player.isMinority) {
        pointsAwarded[player.id] = majorityCount;
      }
    }
  }

  const updatedPlayers = players.map((player) => ({
    ...player,
    score: player.score + (pointsAwarded[player.id] ?? 0),
  }));

  return { updatedPlayers, minorityWon, pointsAwarded };
}
