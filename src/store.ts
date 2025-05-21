import { create } from 'zustand';

/**
 * Central storage for all game settings
 *
 * constants in uppercase
 * variables in lowercase
 * import into component / hook and use like:
 * const { SIZE } = useGameStore();
 * 
 */
export const useGameStore = create((set, get) => ({
  // constants
  R: 10, // player tongue tip radius
  centerPos: { x: 120, y: 420 },
  P1: {
    pos: {x: 40, y: 420},
    colors: ['green', 'gold', 'orange']
  },
  P2: {
    pos: {x: 225, y: 420},
    colors: ['hotpink', 'darkorchid', 'indianred']
  },
  SIZE: { w: 270, h: 480 }, // canvas size
  SPEED: 600,
  COLS: {
    red: 0xff0000,
    green: 0x00ff00,
    darkgreen: 0x00aa00,
    brown: 0x4d2926,
    stone: 0x9D9D9D,
  },
  // variables
  mute: getStorage('mute', false),
  hiScore: getStorage('hiScore', 50),
  score: 0,
  plays: 0,
  setScore: (score) => set({ score }),
  getScore: () => get().score,
  setHiScore: (hiScore) => {
    set({ hiScore });
    setStorage('hiScore', hiScore);
  },
  getHiScore: () => get().hiScore,
  toggleMute: () => set((state) => ({ mute: !state.mute })),
  setMute: (mute) => set({ mute }),
  getMute: () => get().mute,
  setPlays: (plays) => set({ plays }),
  getPlays: () => get().plays,
}));

export const getGameState = useGameStore.getState
export const subscribe = useGameStore.subscribe

function getStorage(key, fallback = false) {
  try {
    if (typeof localStorage === 'undefined') return fallback;

    const item = localStorage.getItem(key);
    if (item !== null) return JSON.parse(item);
    if (fallback) {
      localStorage.setItem(key, JSON.stringify(fallback));
    }
    return fallback;
  } catch (err) {
    return fallback;
  }
}

function setStorage(key, value) {
  try {
    if (typeof localStorage === 'undefined') return false;
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    // localStorage not available or quota exceeded, etc.
    console.warn(`Could not save "${key}" to localStorage:`, err);
    return false;
  }
}
