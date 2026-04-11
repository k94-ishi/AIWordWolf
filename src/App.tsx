import React, { useState } from 'react';
import { Player, GameScreen, Difficulty, TopicPair, VoteRecord } from './types/game';
import { useGeminiTopics } from './hooks/useGeminiTopics';
import { assignRoles, countVotes, calculateScores } from './utils/gameLogic';
import { TopBar } from './components/TopBar';
import { ApiKeySetup } from './components/ApiKeySetup';
import { GameSetup } from './components/GameSetup';
import { WordReveal } from './components/WordReveal';
import { Discussion } from './components/Discussion';
import { Voting } from './components/Voting';
import { RoundResult } from './components/RoundResult';
import { TopicReveal } from './components/TopicReveal';
import { LoadingTopics } from './components/LoadingTopics';

export default function App(): JSX.Element {
  const [screen, setScreen] = useState<GameScreen>(() => {
    const hasApiKey = !!localStorage.getItem('gemini_api_key');
    return hasApiKey ? 'game-setup' : 'api-key-setup';
  });

  const [players, setPlayers] = useState<Player[]>([]);
  const [playerCount, setPlayerCount] = useState(4);
  const [minorityCount, setMinorityCount] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>(1);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [topics, setTopics] = useState<TopicPair | null>(null);
  const [currentTopic, setCurrentTopic] = useState<TopicPair | null>(null);
  const [topicHistory, setTopicHistory] = useState<TopicPair[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [everyoneVotes, setEveryoneVotes] = useState(false);
  const [currentRoundVotes, setCurrentRoundVotes] = useState<VoteRecord[]>([]);
  const [eliminatedId, setEliminatedId] = useState(-1);
  const [minorityWon, setMinorityWon] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState<Record<number, number>>({});

  const { generateTopics, loading: generatingTopics, error: topicsError } = useGeminiTopics();

  const handleActivateApiKey = (apiKey: string) => {
    localStorage.setItem('gemini_api_key', apiKey);
    setScreen('game-setup');
  };

  const handleGameSetupStart = async (
    newPlayerCount: number,
    newMinorityCount: number,
    newDifficulty: Difficulty,
    newTimerMinutes: number,
    newPlayerNames: string[]
  ) => {
    setPlayerCount(newPlayerCount);
    setMinorityCount(newMinorityCount);
    setDifficulty(newDifficulty);
    setTimerMinutes(newTimerMinutes);

    const newPlayers: Player[] = newPlayerNames.map((name, index) => ({
      id: index,
      name,
      isMinority: false,
      word: '',
      score: 0,
    }));
    setPlayers(newPlayers);

    setScreen('loading-topics');
    const newTopics = await generateTopics(newDifficulty, topicHistory);
    if (newTopics) {
      setTopicHistory([...topicHistory, newTopics]);
      const playersWithRoles = assignRoles(newPlayers, newMinorityCount, newTopics);
      setPlayers(playersWithRoles);
      setCurrentTopic(newTopics);
      setCurrentPlayerIndex(0);
      setScreen('word-reveal');
    } else {
      setScreen('game-setup');
    }
  };

  const handleWordRevealNext = () => {
    setCurrentPlayerIndex(currentPlayerIndex + 1);
  };

  const handleAllWordsRevealed = () => {
    setScreen('discussion');
  };

  const handleEveryoneVotesStart = () => {
    setEveryoneVotes(true);
    setCurrentPlayerIndex(0);
    setCurrentRoundVotes([]);
    setScreen('voting');
  };

  const handleRepresentativeVotesStart = () => {
    setEveryoneVotes(false);
    setScreen('voting');
  };

  const handleVotesSubmitted = (votes: VoteRecord[]) => {
    const eliminated = countVotes(votes);
    setEliminatedId(eliminated);
    setCurrentRoundVotes(votes);

    const { updatedPlayers, minorityWon: didMinorityWin, pointsAwarded: points } =
      calculateScores(players, eliminated, minorityCount);

    setPlayers(updatedPlayers);
    setMinorityWon(didMinorityWin);
    setPointsAwarded(points);
    setScreen('round-result');
  };

  const handleCheckTopics = () => {
    setScreen('topic-reveal');
  };

  const handleBackToResults = () => {
    setScreen('round-result');
  };

  const handleNextRound = async () => {
    setScreen('loading-topics');
    const newTopics = await generateTopics(difficulty, topicHistory);
    if (newTopics) {
      setTopicHistory([...topicHistory, newTopics]);
      const playersWithRoles = assignRoles(
        players.map((p) => ({ ...p, isMinority: false, word: '' })),
        minorityCount,
        newTopics
      );
      setPlayers(playersWithRoles);
      setCurrentTopic(newTopics);
      setCurrentPlayerIndex(0);
      setScreen('word-reveal');
    } else {
      setScreen('round-result');
    }
  };

  const handleEndGame = () => {
    setScreen('game-setup');
    setPlayers([]);
    setTopicHistory([]);
    setCurrentPlayerIndex(0);
    setCurrentRoundVotes([]);
    setEliminatedId(-1);
    setMinorityWon(false);
    setPointsAwarded({});
  };

  const handleChangeApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setScreen('api-key-setup');
  };

  const handleRetryTopics = async () => {
    setScreen('loading-topics');
    const newTopics = await generateTopics(difficulty, topicHistory);
    if (newTopics) {
      setTopicHistory([...topicHistory, newTopics]);
      const playersWithRoles = assignRoles(players, minorityCount, newTopics);
      setPlayers(playersWithRoles);
      setCurrentTopic(newTopics);
      setCurrentPlayerIndex(0);
      setScreen('word-reveal');
    } else {
      setScreen('game-setup');
    }
  };

  const showTopBar = ![
    'api-key-setup',
    'word-reveal',
    'voting',
  ].includes(screen);

  return (
    <div className="antialiased bg-gray-50">
      {showTopBar && <TopBar onEndGame={handleEndGame} showEndButton={true} />}

      {screen === 'api-key-setup' && (
        <ApiKeySetup onActivate={handleActivateApiKey} />
      )}

      {screen === 'game-setup' && (
        <GameSetup onStart={handleGameSetupStart} onChangeApiKey={handleChangeApiKey} />
      )}

      {screen === 'loading-topics' && (
        <LoadingTopics error={topicsError} onRetry={handleRetryTopics} />
      )}

      {screen === 'word-reveal' && (
        <WordReveal
          players={players}
          currentPlayerIndex={currentPlayerIndex}
          onNext={handleWordRevealNext}
          onAllPlayersViewed={handleAllWordsRevealed}
        />
      )}

      {screen === 'discussion' && (
        <Discussion
          timerMinutes={timerMinutes}
          onEveryoneVotes={handleEveryoneVotesStart}
          onRepresentativeVotes={handleRepresentativeVotesStart}
        />
      )}

      {screen === 'voting' && (
        <Voting
          players={players}
          everyoneVotes={everyoneVotes}
          onVotesSubmitted={handleVotesSubmitted}
        />
      )}

      {screen === 'round-result' && (
        <RoundResult
          players={players}
          votes={currentRoundVotes}
          eliminatedId={eliminatedId}
          minorityWon={minorityWon}
          pointsAwarded={pointsAwarded}
          onCheckTopics={handleCheckTopics}
          onNextRound={handleNextRound}
          onEndGame={handleEndGame}
        />
      )}

      {screen === 'topic-reveal' && (
        <TopicReveal players={players} onBack={handleBackToResults} />
      )}
    </div>
  );
}
