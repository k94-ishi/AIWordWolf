/**
 * Sanitize player name: strip whitespace, limit to 20 chars,
 * allow only alphanumeric + spaces + basic punctuation
 */
export function sanitizePlayerName(raw: string): string {
  return raw.trim().slice(0, 20).replace(/[<>"'`]/g, '');
}

/**
 * Sanitize API key: strip all whitespace (common paste artifact),
 * allow only characters that appear in Gemini keys (alphanumeric + hyphens + underscores)
 */
export function sanitizeApiKey(raw: string): string {
  return raw.replace(/\s/g, '').replace(/[^a-zA-Z0-9\-_]/g, '');
}

/**
 * Validate API key format and minimum length.
 */
export function isValidApiKey(key: string): boolean {
  return typeof key === 'string' && key.length >= 20;
}

/**
 * Validate player count (3-10 players)
 */
export function validatePlayerCount(count: number): boolean {
  const num = Number(count);
  return !isNaN(num) && num >= 3 && num <= 10;
}

/**
 * Validate minority count (cannot exceed players - 2)
 */
export function validateMinorityCount(minorityCount: number, totalPlayers: number): boolean {
  const num = Number(minorityCount);
  return !isNaN(num) && num >= 1 && num <= totalPlayers - 2;
}

/**
 * Validate difficulty (1-3)
 */
export function validateDifficulty(difficulty: number): boolean {
  const num = Number(difficulty);
  return !isNaN(num) && num >= 1 && num <= 3;
}

/**
 * Validate timer (in minutes, must be positive)
 */
export function validateTimer(minutes: number): boolean {
  const num = Number(minutes);
  return !isNaN(num) && num > 0;
}
