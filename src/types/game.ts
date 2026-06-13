export type Difficulty = 1 | 2 | 3;

export interface Player {
  id: number;
  name: string;
  isMinority: boolean;
  word: string;
  score: number;
}

export interface TopicPair {
  majorityWord: string;
  minorityWord: string;
}

export interface VoteRecord {
  voterId: number;
  targetId: number;
}

export interface RoundResult {
  eliminatedPlayerId: number;
  minorityWon: boolean;
  votes: VoteRecord[];
  pointsAwarded: Record<number, number>;
}

export type GameScreen =
  | 'api-key-setup'
  | 'game-setup'
  | 'loading-topics'
  | 'word-reveal'
  | 'discussion'
  | 'voting'
  | 'round-result'
  | 'topic-reveal';
