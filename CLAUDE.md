# Word Wolf (English) — Claude Code Instructions

## Project Overview

Build a browser-based **Word Wolf** party game playable in English, deployable on **GitHub Pages**.  
Stack: **React + TypeScript + Tailwind CSS**, single-page app with no backend.

---

## Tech Stack

| Layer | Choice |
|---|---|
| UI framework | React 18 + TypeScript |
| Styling | Tailwind CSS (CDN or PostCSS build) |
| Build tool | Vite |
| Deployment | GitHub Pages (`gh-pages` branch) |
| AI topic generation | Google Generative AI (Gemini) — called directly from browser |
| API key storage | `sessionStorage` only — cleared on browser close, never sent to any server other than `generativelanguage.googleapis.com` |

---

## Project Structure

```
word-wolf/
├── public/
├── src/
│   ├── components/
│   │   ├── ApiKeySetup.tsx       # API key input & activation screen
│   │   ├── GameSetup.tsx         # Player count, minority count, difficulty, timer, player names
│   │   ├── WordReveal.tsx        # Per-player word confirmation (pass-and-play)
│   │   ├── Discussion.tsx        # Countdown timer + vote start buttons
│   │   ├── Voting.tsx            # Per-player or representative voting
│   │   ├── RoundResult.tsx       # Vote result + scores + "Check Topics" button
│   │   ├── TopicReveal.tsx       # All players' topics revealed
│   │   ├── Scoreboard.tsx        # Cumulative scores between rounds
│   │   └── TopBar.tsx            # Persistent "End Game" button
│   ├── hooks/
│   │   └── useGeminiTopics.ts    # API call logic for topic generation
│   ├── types/
│   │   └── game.ts               # All shared TypeScript types
│   ├── utils/
│   │   ├── gameLogic.ts          # Role assignment, vote counting, score calculation
│   │   └── sanitize.ts           # Input sanitization helpers (XSS prevention)
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Game Rules (implement exactly)

### Roles
- **Majority**: most players. They all share **Word A**.
- **Minority** (wolves): fewer players (user-configured, default 1). They share **Word B**.
- No player knows which group they belong to at the start.

### Round Flow
1. Topics (Word A & Word B) are generated via Google Generative AI (Gemini) before word reveal.
2. Each player privately sees their own word (pass-and-play confirmation screens).
3. Discussion phase begins with a countdown timer.
4. When voting starts, each player votes for who they think is the minority.
5. The player with the most votes is "eliminated."
   - If they are **minority** → **majority wins** → majority players each gain `(minority count)` points.
   - If they are **majority** → **minority wins** → minority players each gain `(majority count)` points.
6. Tie votes: pick the tied player with the lowest index (or prompt re-vote — keep it simple, lowest index is fine).
7. Cumulative scores carry across rounds. Rounds continue until users choose to end.

---

## Screen Flow

```
[API Key Setup]
      ↓ (key saved to sessionStorage, app "activated")
[Game Setup]  ← also reachable from "End Game" button
  - Number of players (min 3, max 10)
  - Number of minority players (default 1, max = players - 2)
  - Difficulty: 1=Easy … 5=Hard  (default 1)
  - Discussion time in minutes (default 5)
  - Player names: one input per player, default "Player1", "Player2", ...
      ↓  (clicking "Start" triggers API call to generate topics)
[Loading screen while topics are generated]
      ↓
[Word Reveal — loop per player]
  Screen A: "Are you [PlayerName]?" → OK button
  Screen B: "Your word is: [WORD]" → OK button
  (repeat for all players)
      ↓
[Discussion]
  - Countdown timer (MM:SS), stops at 00:00 but does NOT auto-advance
  - "Everyone Votes" button
  - "One Representative Votes" button
      ↓
[Voting]
  - If "Everyone Votes": same pass-and-play loop
    - Screen: "[PlayerName]'s vote — tap the player you suspect is the minority"
    - Buttons: one per player name (cannot vote for yourself — disable own button)
  - If "One Representative Votes": single voting screen, result applied to all
      ↓
[Round Result]
  - Show vote tally
  - Show who was eliminated
  - Show whether majority or minority won
  - Show points gained this round per player
  - Show cumulative scores (sorted descending)
  - "Check Topics" button → [Topic Reveal]
  - "Next Round" button → back to [Word Reveal] loop (new topics generated)
  - "End Game" button → back to [Game Setup] (scores reset)
      ↓ ("Check Topics")
[Topic Reveal]
  - Table: Player Name | Their Word | Role (Majority / Minority)
  - "Back to Results" button
```

`TopBar` with **"End Game"** button is visible on every screen **except** [API Key Setup] and [Word Reveal / Voting pass-and-play screens] (to prevent accidental peeking).

---

## API Key Handling

```typescript
// Sanitize before storing — strip whitespace and non-key characters
const sanitizeApiKey = (raw: string): string =>
  raw.replace(/\s/g, '').replace(/[^a-zA-Z0-9\-_]/g, '');

// On "Activate" button click
const handleActivate = () => {
  const clean = sanitizeApiKey(enteredKey);
  if (!clean) return; // show validation error
  sessionStorage.setItem('gemini_api_key', clean);
};

// On app load
const storedKey = sessionStorage.getItem('gemini_api_key') ?? '';

// All API calls use the stored key — never hard-code it
const apiKey = sessionStorage.getItem('gemini_api_key') ?? '';
```

- If no key is stored, always show [API Key Setup] first.
- Provide a small "Change API Key" link in [Game Setup] so users can update it.
- **Never log or transmit the key anywhere except `generativelanguage.googleapis.com`.**
- **Never render the key value into the DOM** (e.g. don't show the full key on screen; show only the last 4 characters as a hint if needed).

---

## Topic Generation (Google Generative AI / Gemini)

Endpoint: `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`  
Model: `gemini-2.5-flash`  
Call this once per round, before the Word Reveal loop.

### Request pattern

```typescript
const difficultyLabel = ['', 'Easy', 'Medium', 'Challenging', 'Hard', 'Expert'][difficulty];

const prompt = `Generate two related but different English nouns or noun phrases for Word Wolf.
Difficulty of words: ${difficultyLabel}
Answer directly and concisely. Do not overthink.

Format:
<MAJORITY_WORD>WordA</MAJORITY_WORD>
<MINORITY_WORD>WordB</MINORITY_WORD>`;

const apiKey = sessionStorage.getItem('gemini_api_key') ?? '';

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
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
```

Parse `response.candidates[0].content.parts[0].text` by extracting the values inside `<MAJORITY_WORD>...</MAJORITY_WORD>` and `<MINORITY_WORD>...</MINORITY_WORD>`. Show a friendly error if parsing fails or API returns an error (e.g. invalid key → redirect to API Key Setup screen).

---

## TypeScript Types

```typescript
// src/types/game.ts

export type Difficulty = 1 | 2 | 3 | 4 | 5;

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
  pointsAwarded: Record<number, number>; // playerId → points gained
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
```

---

## Design Guidelines (Tailwind CSS)

- **Style**: Simple, clean, and **pop** (bright accent colors, rounded corners, playful font sizes).
- Background: light gray (`bg-gray-50`) or white.
- Primary action buttons: `bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-6 py-3 font-bold text-lg`.
- Danger / End button: `bg-rose-500 hover:bg-rose-600`.
- Cards / panels: `bg-white rounded-2xl shadow-md p-6`.
- Use emoji sparingly to add personality (e.g. 🐺 in the title, ✅ for confirm, 🗳️ for voting).
- The app title **"🐺 Word Wolf"** should appear on every screen except pass-and-play screens.
- Fully responsive — usable on a smartphone passed around the table.

---

## Game Logic Utilities (`src/utils/gameLogic.ts`)

Implement and export:

```typescript
// Randomly assign minority roles to `minorityCount` players
export function assignRoles(players: Player[], minorityCount: number, topics: TopicPair): Player[]

// Count votes and return the player id with the most votes (lowest index on tie)
export function countVotes(votes: VoteRecord[]): number

// Calculate points for this round and return updated players
export function calculateScores(
  players: Player[],
  eliminatedId: number,
  minorityCount: number
): { updatedPlayers: Player[]; minorityWon: boolean; pointsAwarded: Record<number, number> }
```

---

## GitHub Pages Deployment

Add to `package.json`:
```json
{
  "homepage": "https://<username>.github.io/word-wolf",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

Set `base: '/word-wolf/'` in `vite.config.ts`.

---

## Security Requirements (XSS Prevention)

This app handles user-supplied strings (player names, API key) that must **never** be inserted into the DOM as raw HTML. React's JSX escapes values by default, but the following rules must be followed explicitly.

### Rules

1. **Never use `dangerouslySetInnerHTML`** anywhere in the codebase. It is banned entirely.

2. **Always render user input as text nodes via JSX**, not as HTML:
   ```tsx
   // ✅ Safe — React escapes this automatically
   <p>{playerName}</p>
   <button>{playerName}</button>

   // ❌ Never do this
   <p dangerouslySetInnerHTML={{ __html: playerName }} />
   ```

3. **Sanitize and validate all user inputs** at the point of entry (form `onChange` handlers), not only at display time:
   ```typescript
   // Player name: strip leading/trailing whitespace, limit to 20 chars,
   // allow only alphanumeric + spaces + basic punctuation
   const sanitizePlayerName = (raw: string): string =>
     raw.trim().slice(0, 20).replace(/[<>"'`]/g, '');

   // API key: strip all whitespace (common paste artifact), allow only
   // characters that appear in Gemini keys (alphanumeric + hyphens + underscores)
   // and require a minimum length for validation.
   const sanitizeApiKey = (raw: string): string =>
     raw.replace(/\s/g, '').replace(/[^a-zA-Z0-9\-_]/g, '');
   ```

4. **API key stored in sessionStorage** must be retrieved and used only as a plain string value — never concatenated into HTML or URL fragments.

5. **API response content** (topic words returned by Gemini) must also be rendered through JSX text nodes, not injected as HTML. Treat the API response as untrusted input.

6. **Content Security Policy** — use a dedicated CSP injector script in `public/csp.js` to apply environment-aware policies. This keeps the application secure in production while allowing local development support.
   - In development, the app allows `localhost` and websocket connections.
   - In production, the app uses strict CSP with only `https://generativelanguage.googleapis.com` and no `unsafe-inline` styles.

7. **Do not use `eval()`, `Function()`, `setTimeout(string)`, or `setInterval(string)`** anywhere.

8. **Validate numeric inputs** (player count, minority count, difficulty, timer) server-side with `Number()` + `isNaN()` checks; reject non-numeric values before storing them in state.

---

## Important Constraints

1. **No backend** — everything runs in the browser.
2. **No cookies** — use only `sessionStorage` for the API key (auto-cleared on browser close).
3. **Pass-and-play** — word reveal and voting screens must fully hide information between players. Show a "Hand the device to [PlayerName]" prompt before revealing sensitive info. The TopBar "End Game" button must be hidden on these screens.
4. The discussion timer reaching zero **must not** auto-navigate. Just display "00:00".
5. Tie votes → eliminate the tied player with the **lowest array index**.
6. TypeScript strict mode (`"strict": true` in `tsconfig.json`) must be enabled. No use of `any` type.
7. All user-supplied strings must pass through the sanitization functions defined in the Security section before being stored in state or rendered.
8. API calls go directly to `generativelanguage.googleapis.com` — do not use any proxy server.
