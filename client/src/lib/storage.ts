// Helper to get asset URL with base path for GitHub Pages
const BASE_URL = import.meta.env.BASE_URL || '/';
export const assetUrl = (path: string) => `${BASE_URL}${path.startsWith('/') ? path.slice(1) : path}`;

export interface User {
  id: string;
  name: string;
  avatar: string;
  gender: 'boy' | 'girl';
}

export interface UserStats {
  totalMissions: number;
  totalXP: number;
  todayMissions: number;
  todayXP: number;
  todayDate: string;  // ISO date string (YYYY-MM-DD)
  blocks: Record<string, number>;  // { gold_block: 5, diamond_block: 2, ... }
}

interface CookieData {
  currentUser: string;
  users: Record<string, UserStats>;
}

export const USERS: User[] = [
  { id: 'jake', name: 'Jake', avatar: assetUrl('assets/avatars/jake.png'), gender: 'boy' },
  { id: 'jeanie', name: 'Jeanie', avatar: assetUrl('assets/avatars/jeanie.png'), gender: 'girl' },
  { id: 'chris', name: 'Chris', avatar: assetUrl('assets/avatars/chris.png'), gender: 'boy' },
  { id: 'fienie', name: 'Fienie', avatar: assetUrl('assets/avatars/fienie.png'), gender: 'girl' }
];

export const AVAILABLE_BLOCKS = [
  { type: 'gold_block', name: 'Gold Block', src: assetUrl('assets/blocks/gold_block.png'), rarity: 'rare' },
  { type: 'diamond_block', name: 'Diamond Block', src: assetUrl('assets/blocks/diamond_block.png'), rarity: 'rare' },
  { type: 'treasure_chest', name: 'Treasure Chest', src: assetUrl('assets/blocks/treasure_chest.png'), rarity: 'epic' },
  { type: 'sword', name: 'Sword', src: assetUrl('assets/blocks/sword.png'), rarity: 'legendary' },
  { type: 'cannon', name: 'Cannon', src: assetUrl('assets/blocks/cannon.png'), rarity: 'legendary' },
  { type: 'machine_gun', name: 'Machine Gun', src: assetUrl('assets/blocks/machine_gun.png'), rarity: 'epic' },
  { type: 'magic_wand', name: 'Magic Wand', src: assetUrl('assets/blocks/magic_wand.png'), rarity: 'rare' },
  { type: 'explosives', name: 'Explosives', src: assetUrl('assets/blocks/explosives.png'), rarity: 'epic' },
  { type: 'chocolate', name: 'Chocolate', src: assetUrl('assets/blocks/chocolate.png'), rarity: 'common' },
  { type: 'coin', name: 'Coin', src: assetUrl('assets/blocks/coin.png'), rarity: 'common' },
  { type: 'apple', name: 'Apple', src: assetUrl('assets/blocks/apple.png'), rarity: 'common' },
  { type: 'hamburger', name: 'Hamburger', src: assetUrl('assets/blocks/hamburger.png'), rarity: 'common' }
];

const COOKIE_NAME = 'math-craft-data';
const COOKIE_EXPIRY_DAYS = 365;

// Low-level cookie helpers
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getDefaultUserStats(): UserStats {
  return {
    totalMissions: 0,
    totalXP: 0,
    todayMissions: 0,
    todayXP: 0,
    todayDate: getTodayDateString(),
    blocks: {}
  };
}

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function getCookieData(): CookieData {
  const raw = getCookie(COOKIE_NAME);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // Invalid JSON, reset
    }
  }
  return { currentUser: '', users: {} };
}

function saveCookieData(data: CookieData): void {
  setCookie(COOKIE_NAME, JSON.stringify(data), COOKIE_EXPIRY_DAYS);
}

// User management
export function getCurrentUser(): User | null {
  const data = getCookieData();
  if (!data.currentUser) return null;
  return USERS.find(u => u.id === data.currentUser) || null;
}

export function setCurrentUser(userId: string): void {
  const data = getCookieData();
  data.currentUser = userId;
  // Initialize user stats if not exists
  if (userId && !data.users[userId]) {
    data.users[userId] = getDefaultUserStats();
  }
  saveCookieData(data);
}

// Stats management
export function getUserStats(userId: string): UserStats {
  const data = getCookieData();
  const stats = data.users[userId] || getDefaultUserStats();

  // Check for day rollover
  const today = getTodayDateString();
  if (stats.todayDate !== today) {
    stats.todayMissions = 0;
    stats.todayXP = 0;
    stats.todayDate = today;
    // Save the reset stats
    data.users[userId] = stats;
    saveCookieData(data);
  }

  return stats;
}

export function saveUserStats(userId: string, stats: UserStats): void {
  const data = getCookieData();
  data.users[userId] = stats;
  saveCookieData(data);
}

// Game recording functions
export function recordGameComplete(score: number): void {
  const user = getCurrentUser();
  if (!user) return;

  const stats = getUserStats(user.id);
  stats.totalMissions += 1;
  stats.totalXP += score;
  stats.todayMissions += 1;
  stats.todayXP += score;

  saveUserStats(user.id, stats);
}

export function recordBlockCollected(blockType: string): void {
  const user = getCurrentUser();
  if (!user) return;

  const stats = getUserStats(user.id);
  stats.blocks[blockType] = (stats.blocks[blockType] || 0) + 1;

  saveUserStats(user.id, stats);
}

// Stats retrieval functions
export function getTodayStats(): { count: number; totalScore: number } {
  const user = getCurrentUser();
  if (!user) return { count: 0, totalScore: 0 };

  const stats = getUserStats(user.id);
  return {
    count: stats.todayMissions,
    totalScore: stats.todayXP
  };
}

export function getOverallStats(): { count: number; totalScore: number } {
  const user = getCurrentUser();
  if (!user) return { count: 0, totalScore: 0 };

  const stats = getUserStats(user.id);
  return {
    count: stats.totalMissions,
    totalScore: stats.totalXP
  };
}

export function getBlockCounts(): Record<string, number> {
  const user = getCurrentUser();
  if (!user) return {};

  const stats = getUserStats(user.id);
  return stats.blocks;
}

export function getUniqueBlocksCollected(): number {
  const blocks = getBlockCounts();
  return Object.keys(blocks).filter(k => blocks[k] > 0).length;
}

export function getTotalBlocksCollected(): number {
  const blocks = getBlockCounts();
  return Object.values(blocks).reduce((sum, count) => sum + count, 0);
}
