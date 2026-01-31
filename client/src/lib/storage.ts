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

export interface CollectedBlock {
  id: string;
  userId: string;
  type: string; // 'grass', 'diamond', 'gold', 'tnt'
  name: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  gender: 'boy' | 'girl';
}

export const USERS: User[] = [
  { id: 'jake', name: 'Jake', avatar: '/assets/avatars/jake.png', gender: 'boy' },
  { id: 'jeanie', name: 'Jeanie', avatar: '/assets/avatars/jeanie.png', gender: 'girl' }
];

const CURRENT_USER_KEY = 'math-craft-current-user';

export function getCurrentUser(): User | null {
  const userId = localStorage.getItem(CURRENT_USER_KEY);
  if (!userId) return null;
  return USERS.find(u => u.id === userId) || null;
}

export function setCurrentUser(userId: string) {
  localStorage.setItem(CURRENT_USER_KEY, userId);
}

export function getInventory(): CollectedBlock[] {
  const user = getCurrentUser();
  if (!user) return [];
  try {
    const data = localStorage.getItem(INVENTORY_KEY);
    const all = data ? JSON.parse(data) : [];
    return all.filter((item: any) => item.userId === user.id);
  } catch (e) {
    return [];
  }
}

export function addToInventory(blockType: string) {
  const user = getCurrentUser();
  if (!user) return [];
  
  const allData = localStorage.getItem(INVENTORY_KEY);
  const allInventory = allData ? JSON.parse(allData) : [];
  
  const blockDef = AVAILABLE_BLOCKS.find(b => b.type === blockType);
  if (!blockDef) return getInventory();

  const newBlock: CollectedBlock = {
    id: crypto.randomUUID(),
    userId: user.id,
    type: blockType,
    name: blockDef.name,
    date: new Date().toISOString()
  };

  allInventory.push(newBlock);
  localStorage.setItem(INVENTORY_KEY, JSON.stringify(allInventory));
  return getInventory();
}

export function getHistory(): GameRecord[] {
  const user = getCurrentUser();
  if (!user) return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    const all = data ? JSON.parse(data) : [];
    return all.filter((item: any) => item.userId === user.id);
  } catch (e) {
    return [];
  }
}

export function saveGameToHistory(score: number, mode: string, details: string) {
  const user = getCurrentUser();
  if (!user) return [];
  
  const allData = localStorage.getItem(HISTORY_KEY);
  const allHistory = allData ? JSON.parse(allData) : [];
  
  const record: GameRecord & { userId: string } = {
    id: crypto.randomUUID(),
    userId: user.id,
    score,
    date: new Date().toISOString(),
    mode,
    details
  };
  
  allHistory.unshift(record);
  if (allHistory.length > 500) allHistory.pop();
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(allHistory));
  return getHistory();
}

export function getTodayStats() {
  const history = getHistory();
  const today = new Date().toDateString();
  
  const todayGames = history.filter(game => new Date(game.date).toDateString() === today);

  return {
    count: todayGames.length,
    totalScore: todayGames.reduce((acc, curr) => acc + curr.score, 0),
    games: todayGames,
    breakdown: calculateBreakdown(todayGames)
  };
}

export function getOverallStats() {
  const history = getHistory();
  
  return {
    count: history.length,
    totalScore: history.reduce((acc, curr) => acc + curr.score, 0),
    games: history,
    breakdown: calculateBreakdown(history)
  };
}

function calculateBreakdown(games: GameRecord[]) {
  return games.reduce((acc, game) => {
    if (game.details.includes('Multiplication') || game.details.includes('Mixed') && game.details.includes('×')) acc['multiply'] = (acc['multiply'] || 0) + 1;
    if (game.details.includes('Division') || game.details.includes('Mixed') && game.details.includes('÷')) acc['divide'] = (acc['divide'] || 0) + 1;
    if (game.details.includes('Addition') || game.details.includes('Mixed') && game.details.includes('+')) acc['add'] = (acc['add'] || 0) + 1;
    if (game.details.includes('Subtraction') || game.details.includes('Mixed') && game.details.includes('-')) acc['subtract'] = (acc['subtract'] || 0) + 1;
    
    return acc;
  }, {} as Record<string, number>);
}
