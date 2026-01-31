// Helper to get asset URL with base path for GitHub Pages
const BASE_URL = import.meta.env.BASE_URL || '/';
export const assetUrl = (path: string) => `${BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;

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
  date: string;
  mode: string;
  details: string;
}

export interface CollectedBlock {
  id: string;
  userId: string;
  type: string;
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
  { id: 'jake', name: 'Jake', avatar: assetUrl('assets/avatars/jake.png'), gender: 'boy' },
  { id: 'jeanie', name: 'Jeanie', avatar: assetUrl('assets/avatars/jeanie.png'), gender: 'girl' }
];

const CURRENT_USER_KEY = 'math-craft-current-user';
const HIGH_SCORES_KEY = 'math-craft-high-scores';
const HISTORY_KEY = 'math-craft-history';
const INVENTORY_KEY = 'math-craft-inventory';

export const AVAILABLE_BLOCKS = [
  { type: 'grass', name: 'Grass Block', src: assetUrl('assets/blocks/grass.png'), rarity: 'common' },
  { type: 'diamond', name: 'Diamond Ore', src: assetUrl('assets/blocks/diamond_ore.png'), rarity: 'legendary' },
  { type: 'gold', name: 'Gold Ore', src: assetUrl('assets/blocks/gold_ore.png'), rarity: 'rare' },
  { type: 'tnt', name: 'TNT', src: assetUrl('assets/blocks/tnt.png'), rarity: 'epic' },
  { type: 'obsidian', name: 'Obsidian', src: assetUrl('assets/blocks/obsidian.png'), rarity: 'epic' },
  { type: 'crafting_table', name: 'Crafting Table', src: assetUrl('assets/blocks/crafting_table.png'), rarity: 'common' },
  { type: 'water', name: 'Water', src: assetUrl('assets/blocks/water.png'), rarity: 'common' },
  { type: 'powder_snow', name: 'Powder Snow', src: assetUrl('assets/blocks/powder_snow.png'), rarity: 'rare' },
  { type: 'sticky_piston', name: 'Sticky Piston', src: assetUrl('assets/blocks/sticky_piston.png'), rarity: 'rare' },
  { type: 'redstone_lamp', name: 'Redstone Lamp', src: assetUrl('assets/blocks/redstone_lamp.png'), rarity: 'rare' },
  { type: 'dried_kelp', name: 'Dried Kelp Block', src: assetUrl('assets/blocks/dried_kelp_block.png'), rarity: 'common' }
];

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
    const all: CollectedBlock[] = data ? JSON.parse(data) : [];
    return all.filter((item) => item.userId === user.id);
  } catch (e) {
    return [];
  }
}

export function addToInventory(blockType: string) {
  const user = getCurrentUser();
  if (!user) return [];
  
  const allData = localStorage.getItem(INVENTORY_KEY);
  const allInventory: CollectedBlock[] = allData ? JSON.parse(allData) : [];
  
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

export function getHighScores(): HighScore[] {
  const user = getCurrentUser();
  if (!user) return [];
  try {
    const data = localStorage.getItem(HIGH_SCORES_KEY);
    const all: (HighScore & { userId?: string })[] = data ? JSON.parse(data) : [];
    return all.filter((item) => item.userId === user.id);
  } catch (e) {
    return [];
  }
}

export function saveHighScore(name: string, score: number, mode: string) {
  const user = getCurrentUser();
  if (!user) return [];
  
  const allData = localStorage.getItem(HIGH_SCORES_KEY);
  const allScores: (HighScore & { userId: string })[] = allData ? JSON.parse(allData) : [];
  
  const newScore: HighScore & { userId: string } = {
    id: crypto.randomUUID(),
    userId: user.id,
    name,
    score,
    date: new Date().toISOString(),
    mode
  };
  
  allScores.push(newScore);
  allScores.sort((a, b) => b.score - a.score);
  
  localStorage.setItem(HIGH_SCORES_KEY, JSON.stringify(allScores));
  return getHighScores();
}

export function getHistory(): GameRecord[] {
  const user = getCurrentUser();
  if (!user) return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    const all: (GameRecord & { userId?: string })[] = data ? JSON.parse(data) : [];
    return all.filter((item) => item.userId === user.id);
  } catch (e) {
    return [];
  }
}

export function saveGameToHistory(score: number, mode: string, details: string) {
  const user = getCurrentUser();
  if (!user) return [];
  
  const allData = localStorage.getItem(HISTORY_KEY);
  const allHistory: (GameRecord & { userId: string })[] = allData ? JSON.parse(allData) : [];
  
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
    if (game.details.includes('Multiplication') || (game.details.includes('Mixed') && game.details.includes('×'))) acc['multiply'] = (acc['multiply'] || 0) + 1;
    if (game.details.includes('Division') || (game.details.includes('Mixed') && game.details.includes('÷'))) acc['divide'] = (acc['divide'] || 0) + 1;
    if (game.details.includes('Addition') || (game.details.includes('Mixed') && game.details.includes('+'))) acc['add'] = (acc['add'] || 0) + 1;
    if (game.details.includes('Subtraction') || (game.details.includes('Mixed') && game.details.includes('-'))) acc['subtract'] = (acc['subtract'] || 0) + 1;
    
    return acc;
  }, {} as Record<string, number>);
}
