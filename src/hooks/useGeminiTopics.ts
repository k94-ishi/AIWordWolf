import { useState, useCallback } from 'react';
import { Difficulty, TopicPair } from '../types/game';

export function useGeminiTopics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateTopics = useCallback(
    async (difficulty: Difficulty, previousPairs: TopicPair[]): Promise<TopicPair | null> => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = localStorage.getItem('gemini_api_key') ?? '';
        if (!apiKey) {
          setError('API key not found. Please set up your API key.');
          setLoading(false);
          return null;
        }

        const difficultyLabel = ['', 'Easy', 'Medium', 'Challenging', 'Hard', 'Expert'][
          difficulty
        ];

        const prompt = `Generate two related but different English nouns or noun phrases for Word Wolf.
Difficulty of words: ${difficultyLabel}
Answer directly and concisely. Do not overthink.

Format:
<MAJORITY_WORD>WordA</MAJORITY_WORD>
<MINORITY_WORD>WordB</MINORITY_WORD>`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                maxOutputTokens: 1000,
              },
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401 || response.status === 403) {
            setError('Invalid API key. Please check your key and try again.');
          } else {
            setError(`API error: ${errorData.error?.message ?? 'Unknown error'}`);
          }
          setLoading(false);
          return null;
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
          setError('No response from API.');
          setLoading(false);
          return null;
        }

        const majorityMatch = responseText.match(/<MAJORITY_WORD>(.*?)<\/MAJORITY_WORD>/i);
        const minorityMatch = responseText.match(/<MINORITY_WORD>(.*?)<\/MINORITY_WORD>/i);

        if (!majorityMatch || !minorityMatch) {
          setError('Failed to parse topic pair from API response.');
          setLoading(false);
          return null;
        }

        const topics: TopicPair = {
          majorityWord: majorityMatch[1].trim(),
          minorityWord: minorityMatch[1].trim(),
        };

        setLoading(false);
        return topics;
      } catch (err) {
        if (err instanceof SyntaxError) {
          setError('Failed to parse API response. Please try again.');
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
        setLoading(false);
        return null;
      }
    },
    []
  );

  return { generateTopics, loading, error };
}
