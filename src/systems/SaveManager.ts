import { SAVE_KEY } from '../constants';

type Ratings = Record<string, string>;

/**
 * SaveManager — localStorage read/write wrapper.
 * All keys are namespaced with "kendo_" to avoid collisions.
 */
export class SaveManager {
  static get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null; // private/incognito mode may throw
    }
  }

  static set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Storage full or unavailable — silently ignore
    }
  }

  static getRatings(): Ratings {
    try {
      const raw = localStorage.getItem(SAVE_KEY.STAGE_RATINGS);
      return raw ? (JSON.parse(raw) as Ratings) : {};
    } catch {
      return {};
    }
  }

  static setRatings(ratings: Ratings) {
    try {
      localStorage.setItem(SAVE_KEY.STAGE_RATINGS, JSON.stringify(ratings));
    } catch {
      // ignore
    }
  }

  static isKoryuUnlocked(): boolean {
    return SaveManager.get(SAVE_KEY.UNLOCKED_KORYU) === 'true';
  }

  static unlockKoryu() {
    SaveManager.set(SAVE_KEY.UNLOCKED_KORYU, 'true');
  }

  static getCompletionCount(): number {
    return parseInt(SaveManager.get(SAVE_KEY.COMPLETION_COUNT) ?? '0', 10);
  }

  static incrementCompletionCount() {
    const n = SaveManager.getCompletionCount();
    SaveManager.set(SAVE_KEY.COMPLETION_COUNT, String(n + 1));
  }
}
