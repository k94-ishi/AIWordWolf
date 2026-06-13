import rawCSV from '../data/wordpairs.csv?raw';
import { Difficulty, TopicPair } from '../types/game';

interface WordPairRow {
  difficulty: 'easy' | 'normal' | 'hard';
  majorityWord: string;
  minorityWord: string;
}

const DIFFICULTY_LABEL: Record<Difficulty, 'easy' | 'normal' | 'hard'> = {
  1: 'easy',
  2: 'normal',
  3: 'hard',
};

function parsedPairs(): WordPairRow[] {
  return rawCSV
    .trim()
    .split('\n')
    .slice(1) // skip header
    .map((line) => {
      const firstComma = line.indexOf(',');
      const secondComma = line.indexOf(',', firstComma + 1);
      return {
        difficulty: line.slice(0, firstComma).trim() as WordPairRow['difficulty'],
        majorityWord: line.slice(firstComma + 1, secondComma).trim(),
        minorityWord: line.slice(secondComma + 1).trim(),
      };
    });
}

export function getLocalTopic(
  difficulty: Difficulty,
  previousPairs: TopicPair[]
): TopicPair {
  const label = DIFFICULTY_LABEL[difficulty];
  const allForDifficulty = parsedPairs().filter((p) => p.difficulty === label);

  const usedKeys = new Set(
    previousPairs.map((p) => `${p.majorityWord}|${p.minorityWord}`)
  );

  const available = allForDifficulty.filter(
    (p) => !usedKeys.has(`${p.majorityWord}|${p.minorityWord}`)
  );

  // If all pairs exhausted, cycle back through the full list
  const pool = available.length > 0 ? available : allForDifficulty;
  const picked = pool[Math.floor(Math.random() * pool.length)];

  return {
    majorityWord: picked.majorityWord,
    minorityWord: picked.minorityWord,
  };
}
