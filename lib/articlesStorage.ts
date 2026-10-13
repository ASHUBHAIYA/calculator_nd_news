import { Article } from './types/article';
import { INITIAL_ARTICLES } from './articlesData';

export const ARTICLES_STORAGE_KEY = 'bharatcalc_articles_cache_v1';

/**
 * Returns articles from localStorage if available, or null.
 */
export function getCachedArticles(): Article[] | null {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sortArticlesLatestFirst(parsed);
        }
      }
    }
  } catch (err) {
    console.warn('Error reading cached articles from localStorage:', err);
  }
  return null;
}

/**
 * Saves articles array to localStorage for instant local/preview feedback.
 */
export function setCachedArticles(articles: Article[]): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
    }
  } catch (err) {
    console.warn('Error saving articles to localStorage:', err);
  }
}

/**
 * Ensures articles are consistently ordered with latest published first.
 */
export function sortArticlesLatestFirst(articles: Article[]): Article[] {
  return [...articles].sort((a, b) => {
    const timeA = new Date(a.publishedAt || a.updatedAt || 0).getTime();
    const timeB = new Date(b.publishedAt || b.updatedAt || 0).getTime();
    return timeB - timeA;
  });
}
