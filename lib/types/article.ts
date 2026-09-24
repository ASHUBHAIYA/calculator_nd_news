export type ArticleCategory =
  | 'Gold & Commodities'
  | 'Tax & Salary'
  | 'Fuel & Energy'
  | 'Market Trends';

export type RelatedCalculator = 'gold' | 'silver' | 'petrol' | 'salary' | 'none';

export interface ArticleSource {
  label: string;
  url: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  fullContent: string;
  category: ArticleCategory;
  relatedCalculator: RelatedCalculator;
  sources: (string | ArticleSource)[];
  publishedAt: string; // ISO 8601 string
  updatedAt: string; // ISO 8601 string
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function normalizeSources(sources: (string | ArticleSource)[]): ArticleSource[] {
  if (!Array.isArray(sources)) return [];
  return sources.map((s) => {
    if (typeof s === 'string') {
      try {
        const u = new URL(s);
        return { label: u.hostname.replace('www.', ''), url: s };
      } catch {
        return { label: s, url: s.startsWith('http') ? s : `https://${s}` };
      }
    }
    return s;
  });
}
