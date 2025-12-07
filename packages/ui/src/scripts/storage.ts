/**
 * Safe localStorage utilities with error handling for private browsing mode
 */

export function safeGetItem(key: string): string | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

export function safeSetItem(key: string, value: string): boolean {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function safeRemoveItem(key: string): boolean {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
