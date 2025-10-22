export type UserData = {
  name?: string;
  age?: string;
  sex?: string;
  weight?: string;
  height?: string;
  painLevel?: number[];
  emergencyContact?: string;
  emergencyPhone?: string;
  isSetupComplete?: boolean;
  // streak: number of consecutive days
  streak?: number;
  // lastVisit: ISO date string (YYYY-MM-DD) representing the last day the user opened the app
  lastVisit?: string;
};

const STORAGE_KEY = 'lumapp_user_data_v1';

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    console.warn('[localStorageService] failed to parse value', e);
    return null;
  }
}

export const localStorageService = {
  getUser(): UserData | null {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return safeParse<UserData>(raw);
  },

  setUser(data: UserData) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('[localStorageService] failed to set user', e);
    }
  },

  clearUser() {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('[localStorageService] failed to clear user', e);
    }
  }
};

export default localStorageService;
