import { SurpriseData } from '../types';
import { DEFAULT_SURPRISE_DATA } from '../data/defaultSurprise';

const STORAGE_KEY = 'etoile_surprise_delivery_data_v1';

export function loadSurpriseData(): SurpriseData {
  try {
    // 1. Check if URL hash contains compressed payload
    if (window.location.hash.startsWith('#surprise=')) {
      const base64Str = window.location.hash.replace('#surprise=', '');
      const jsonStr = decodeURIComponent(escape(atob(base64Str)));
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.recipientName) {
        // Save to localStorage as backup
        saveSurpriseData(parsed);
        return parsed;
      }
    }

    // 2. Check localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_SURPRISE_DATA, ...parsed };
    }
  } catch (err) {
    console.warn('Could not load custom surprise data from hash/storage, falling back to default', err);
  }

  return DEFAULT_SURPRISE_DATA;
}

export function saveSurpriseData(data: SurpriseData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export function generateShareableUrl(data: SurpriseData): string {
  try {
    const jsonStr = JSON.stringify(data);
    const base64Str = btoa(unescape(encodeURIComponent(jsonStr)));
    const url = new URL(window.location.href);
    url.hash = `surprise=${base64Str}`;
    return url.toString();
  } catch (err) {
    console.error('Failed to encode shareable URL', err);
    return window.location.href;
  }
}
