/**
 * Esquema y servicio de persistencia en localStorage.
 *
 * Notas importantes:
 * - `lastVisit` se almacena como cadena ISO en formato YYYY-MM-DD (fecha local),
 *   por ejemplo: "2025-10-22". Esto permite comparar días sin considerar
 *   horas/minutos y facilita la lógica de racha (streak).
 * - `streak` es un número entero que representa los días consecutivos en los
 *   que el usuario abrió la app. La lógica de incremento/reseteo la maneja el
 *   `AppStateProvider` (comparando `lastVisit` con la fecha actual).
 * - La clave usada en localStorage es `lumapp_user_data_v1`. Cambia la versión
 *   si estructuras los datos en el futuro para invalidar valores antiguos.
 */

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
  /**
   * Número de días consecutivos. Incrementado por `AppStateProvider`.
   */
  streak?: number;
  /**
   * Fecha de la última visita en formato ISO YYYY-MM-DD (cadena).
   */
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
  /**
   * Devuelve los datos del usuario o null si no hay nada o estamos en SSR.
   */
  getUser(): UserData | null {
    if (typeof window === 'undefined') return null;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return safeParse<UserData>(raw);
  },

  /**
   * Sobrescribe los datos del usuario en localStorage. Atrapa errores de
   * serialización/espacio y los registra en consola.
   */
  setUser(data: UserData) {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('[localStorageService] failed to set user', e);
    }
  },

  /**
   * Elimina los datos del usuario del almacenamiento.
   */
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
