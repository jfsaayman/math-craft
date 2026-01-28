export interface HighScore {
  id: string;
  name: string;
  score: number;
  date: string;
  mode: string;
}

export interface GameRecord {
  id: string;
  score: number;
  date: string; // ISO string
  mode: string; // 'practice' | 'time-attack'
  details: string; // e.g., "Multiplication (Tables: 2,5,10)"
}

const HIGH_SCORES_KEY = 'math-craft-high-scores';
const HISTORY_KEY = 'math-craft-history';

export function getHighScores(): HighScore[] {
  try {
    const data = localStorage.getItem(HIGH_SCORES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveHighScore(name: string, score: number, mode: string) {
  const scores = getHighScores();
  const newScore: HighScore = {
    id: crypto.randomUUID(),
    name,
    score,
    date: new Date().toISOString(),
    mode
  };
  
  scores.push(newScore);
  // Sort descending by score
  scores.sort((a, b) => b.score - a.score);
  // Keep top 10
  const top10 = scores.slice(0, 10);
  
  localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(top10));
  return top10;
}

export function getHistory(): GameRecord[] {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function saveGameToHistory(score: number, mode: string, details: string) {
  const history = getHistory();
  const record: GameRecord = {
    id: crypto.randomUUID(),
    score,
    date: new Date().toISOString(),
    mode,
    details
  };
  
  // Add to beginning
  history.unshift(record);
  
  // Optional: Limit history size (e.g., keep last 100 games)
  if (history.length > 100) {
    history.pop();
  }
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return history;
}

export function getTodayStats() {
  const history = getHistory();
  const today = new Date().toDateString();
  
  const todayGames = history.filter(game => new Date(game.date).toDateString() === today);
  
  return {
    count: todayGames.length,
    totalScore: todayGames.reduce((acc, curr) => acc + curr.score, 0),
    games: todayGames
  };
}
