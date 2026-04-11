# 🐺 Word Wolf

A fun browser-based party game where players try to identify the "wolves" (minority players with a different word).

## Game Overview

Players are divided into a **majority** (all with the same word) and a **minority** (wolves with a different word). Without knowing their role, players discuss and vote to eliminate who they think is a wolf. If they eliminate a wolf, the majority wins. If they eliminate a majority player, the wolves win!

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

## Deployment

### GitHub Pages

1. Update `package.json` `homepage` field with your GitHub username:
   ```json
   "homepage": "https://YOUR_USERNAME.github.io/word-wolf"
   ```

2. Deploy:
   ```bash
   npm run deploy
   ```

## Features

- ✨ AI-powered topic generation using Claude API
- 🎮 Pass-and-play mechanics (device passed around the table)
- ⏱️ Customizable discussion timer
- 📊 Persistent score tracking across rounds
- 🎯 5 difficulty levels (Easy to Expert)
- 📱 Fully responsive design for mobile phones

## How to Play

1. Set up your Anthropic API key
2. Configure game settings (number of players, difficulty, etc.)
3. Enter player names
4. Each player secretly views their word
5. Discuss for the allotted time
6. Vote on who is a wolf
7. Results reveal, and the process repeats
8. Continue playing unlimited rounds!

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Google Generative AI (Gemini)** for topic generation
- **localStorage** for API key storage (secure, never sent elsewhere)

## Security

- API key stored locally only
- Content Security Policy (CSP) enabled
- XSS protection with input sanitization
- No backend required

## License

MIT
# AIWordWolf
