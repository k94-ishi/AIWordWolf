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
        const apiKey = sessionStorage.getItem('gemini_api_key') ?? '';
        if (!apiKey) {
          setError('API key not found. Please set up your API key.');
          setLoading(false);
          return null;
        }

        const difficultyLabel = ['', 'Easy', 'Normal', 'Hard'][difficulty];

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
            console.error('Gemini auth error:', errorData);
            setError('Unable to reach the AI service. Please verify your API key and try again.');
          } else {
            console.error('Gemini API error:', errorData);
            setError('Unable to reach the AI service. Please try again later.');
          }
          setLoading(false);
          return null;
        }

        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!responseText) {
          console.error('Gemini response missing expected text:', data);
          setError('Unable to generate topics. Please try again.');
          setLoading(false);
          return null;
        }

        const majorityMatch = responseText.match(/<MAJORITY_WORD>(.*?)<\/MAJORITY_WORD>/i);
        const minorityMatch = responseText.match(/<MINORITY_WORD>(.*?)<\/MINORITY_WORD>/i);

        if (!majorityMatch || !minorityMatch) {
          console.error('Gemini parse failed:', responseText);
          setError('Unable to parse topics from the AI response. Please try again.');
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
          console.error('Gemini syntax error:', err);
        } else if (err instanceof Error) {
          console.error('Gemini unexpected error:', err);
        } else {
          console.error('Gemini unknown error:', err);
        }
        setError('An unexpected error occurred while generating topics. Please try again.');
        setLoading(false);
        return null;
      }
    },
    []
  );

  return { generateTopics, loading, error };
}
