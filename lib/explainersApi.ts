import { Article, ArticleCategory, RelatedCalculator } from './types/article';
import { INITIAL_ARTICLES } from './articlesData';
import { getCachedArticles } from './articlesStorage';

export function getExplainerApiBaseUrl(): string {
  try {
    if (typeof import.meta !== 'undefined' && import.meta && (import.meta as any).env) {
      const url = (import.meta as any).env.VITE_EXPLAINER_API;
      if (typeof url === 'string' && url.trim().length > 0) return url.trim().replace(/\/+$/, '');
    }
  } catch {}

  try {
    if (typeof process !== 'undefined' && process && process.env) {
      const url = process.env.VITE_EXPLAINER_API;
      if (typeof url === 'string' && url.trim().length > 0) return url.trim().replace(/\/+$/, '');
    }
  } catch {}

  return 'https://api.authorizetech.in/api';
}

export function normalizeCategory(cat?: string | null): string {
  if (!cat) return 'Personal Finance';
  const lower = cat.toLowerCase().trim();
  if (lower === 'all') return 'All';
  if (lower === 'personal-finance' || lower === 'personal finance') return 'Personal Finance';
  if (lower === 'tax-salary' || lower === 'tax & salary') return 'Tax & Salary';
  if (lower === 'market' || lower === 'market-trends' || lower === 'market trends') return 'Market';
  if (lower === 'economy' || lower === 'banking-rbi' || lower === 'banking & rbi') return 'Economy';
  if (lower === 'gold-commodities' || lower === 'gold & commodities') return 'Gold & Commodities';
  if (lower === 'fuel-energy' || lower === 'fuel & energy') return 'Fuel & Energy';
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

export function toApiCategory(cat?: string | null): string | undefined {
  if (!cat || cat === 'All') return undefined;
  const lower = cat.toLowerCase().trim();
  if (lower.includes('tax') || lower.includes('salary')) return 'tax-salary';
  if (lower.includes('personal')) return 'personal-finance';
  if (lower.includes('market')) return 'market';
  if (lower.includes('economy')) return 'economy';
  if (lower.includes('gold')) return 'gold-commodities';
  if (lower.includes('fuel')) return 'fuel-energy';
  return lower.replace(/\s+/g, '-');
}

export function mapToRelatedCalculator(calc?: string | null): RelatedCalculator {
  if (!calc) return 'none';
  const c = calc.toLowerCase();
  if (c.includes('salary') || c.includes('tax') || c.includes('pay') || c.includes('fitment')) return 'salary';
  if (c.includes('gold') || c.includes('jewelry')) return 'gold';
  if (c.includes('silver')) return 'silver';
  if (c.includes('petrol') || c.includes('fuel') || c.includes('ev') || c.includes('commute')) return 'petrol';
  if (c.includes('loan') || c.includes('emi') || c.includes('mortgage')) return 'loan';
  if (c.includes('solar') || c.includes('rooftop')) return 'solar';
  return 'none';
}

export function mapApiExplainerToArticle(raw: any): Article {
  const primaryCalc = raw.primary_calculator || raw.calculatorType || raw.related_calculator || null;
  const relatedCalcs = Array.isArray(raw.related_calculators)
    ? raw.related_calculators
    : Array.isArray(raw.relatedCalculators)
    ? raw.relatedCalculators
    : [];

  const rawSources = raw.sources || (raw.source_reference ? [{ label: 'Financial Desk / Wire', url: raw.source_reference }] : []);
  const normalizedCategory = normalizeCategory(raw.category);

  return {
    id: String(raw.id || raw.slug || Math.random().toString(36).slice(2)),
    title: raw.title || 'Financial Explainer',
    slug: raw.slug || '',
    summary: raw.summary || '',
    fullContent: raw.content || raw.fullContent || raw.full_content || raw.summary || '',
    content: raw.content || raw.fullContent || raw.full_content || raw.summary || '',
    category: normalizedCategory as ArticleCategory,
    calculatorType: primaryCalc,
    relatedCalculators: relatedCalcs,
    relatedCalculator: mapToRelatedCalculator(primaryCalc),
    sources: rawSources,
    publishedAt: raw.published_at || raw.publishedAt || raw.created_at || new Date().toISOString(),
    updatedAt: raw.updated_at || raw.updatedAt || raw.created_at || raw.published_at || new Date().toISOString(),
    wordCount: typeof raw.word_count === 'number' ? raw.word_count : undefined,
  };
}

function getLocalFallbackArticles(category?: string): Article[] {
  const cached = getCachedArticles();
  const base = cached && cached.length > 0 ? cached : INITIAL_ARTICLES;
  if (!category || category === 'All') return base;
  const normTarget = normalizeCategory(category).toLowerCase();
  return base.filter((a) => {
    const aNorm = normalizeCategory(a.category).toLowerCase();
    return aNorm === normTarget || a.category.toLowerCase().includes(normTarget);
  });
}

/**
 * Fetches explainers from live FastAPI backend (/explainers?limit=50)
 * Seamlessly falls back to local articles on failure or empty response
 */
export async function fetchLiveExplainers(category?: string): Promise<Article[]> {
  const baseUrl = getExplainerApiBaseUrl();
  const apiCat = toApiCategory(category);
  const url = apiCat
    ? `${baseUrl}/explainers?limit=50&category=${encodeURIComponent(apiCat)}`
    : `${baseUrl}/explainers?limit=50`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Explainers API error: HTTP ${res.status}`);
    }

    const data = await res.json();
    const rawList: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.explainers)
      ? data.explainers
      : Array.isArray(data?.items)
      ? data.items
      : [];

    if (rawList.length === 0) {
      // Empty list from API -> return fallback
      return getLocalFallbackArticles(category);
    }

    let mapped = rawList.map(mapApiExplainerToArticle);

    // If category requested, ensure filter matches even if API returns unfiltered list
    if (category && category !== 'All') {
      const normTarget = normalizeCategory(category).toLowerCase();
      mapped = mapped.filter((a) => {
        const aNorm = normalizeCategory(a.category).toLowerCase();
        return aNorm === normTarget || a.category.toLowerCase().includes(normTarget);
      });
      if (mapped.length === 0) {
        return getLocalFallbackArticles(category);
      }
    }

    return mapped;
  } catch (err) {
    console.warn('Explainers API fetch failed, falling back to bundled dataset:', err);
    return getLocalFallbackArticles(category);
  }
}

/**
 * Fetches a single explainer by slug from live FastAPI backend (/explainers/{slug})
 * Falls back to finding in bundled dataset if API request fails
 */
export async function fetchLiveExplainerBySlug(slug: string): Promise<Article | null> {
  if (!slug) return null;
  const baseUrl = getExplainerApiBaseUrl();
  const cleanSlug = encodeURIComponent(slug.trim());

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${baseUrl}/explainers/${cleanSlug}`, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const raw = data?.explainer || data?.article || data;
      if (raw && (raw.title || raw.slug)) {
        return mapApiExplainerToArticle(raw);
      }
    }
  } catch (err) {
    console.warn(`Explainers API fetch for slug "${slug}" failed:`, err);
  }

  // Fallback to local static and cached articles
  const localList = getLocalFallbackArticles();
  const found = localList.find((a) => a.slug === slug || a.id === slug);
  return found || null;
}
