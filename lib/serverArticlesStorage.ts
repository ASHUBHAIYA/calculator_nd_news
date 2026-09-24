import fs from 'fs';
import path from 'path';
import { Article, generateSlug } from './types/article';
import { INITIAL_ARTICLES } from './articlesData';

const DATA_DIR = path.join(process.cwd(), 'data');
const ARTICLES_FILE = path.join(DATA_DIR, 'articles.json');

// In-memory cache for ultra-fast access
let memoryArticles: Article[] | null = null;

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ARTICLES_FILE)) {
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(INITIAL_ARTICLES, null, 2), 'utf-8');
      memoryArticles = [...INITIAL_ARTICLES];
    }
  } catch (err) {
    console.error('Error initializing data file for articles:', err);
    memoryArticles = [...INITIAL_ARTICLES];
  }
}

export function loadArticles(): Article[] {
  if (memoryArticles) return memoryArticles;
  ensureDataFile();
  try {
    if (fs.existsSync(ARTICLES_FILE)) {
      const content = fs.readFileSync(ARTICLES_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryArticles = parsed;
        return memoryArticles;
      }
    }
  } catch (err) {
    console.error('Error reading articles file, using initial fallback:', err);
  }
  memoryArticles = [...INITIAL_ARTICLES];
  return memoryArticles;
}

export function saveArticles(articles: Article[]): boolean {
  memoryArticles = articles;
  ensureDataFile();
  try {
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving articles to disk:', err);
    return false;
  }
}

export function getAllArticles(category?: string, search?: string): Article[] {
  let list = [...loadArticles()];
  if (category && category !== 'All') {
    list = list.filter((a) => a.category.toLowerCase() === category.toLowerCase());
  }
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.fullContent.toLowerCase().includes(q)
    );
  }
  // Sort latest published first
  return list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getArticleBySlug(slug: string): Article | null {
  const list = loadArticles();
  const found = list.find((a) => a.slug === slug.toLowerCase().trim());
  return found || null;
}

export function createArticle(input: Partial<Article>): Article {
  const list = loadArticles();
  const title = input.title?.trim() || 'Untitled Explainer';
  let slug = input.slug?.trim() ? generateSlug(input.slug) : generateSlug(title);

  // Ensure unique slug
  let counter = 1;
  const originalSlug = slug;
  while (list.some((a) => a.slug === slug)) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  const nowIso = new Date().toISOString();
  const newArticle: Article = {
    id: input.id || `art-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title,
    slug,
    summary: input.summary?.trim() || '',
    fullContent: input.fullContent || '',
    category: input.category || 'Market Trends',
    relatedCalculator: input.relatedCalculator || 'none',
    sources: input.sources || [],
    publishedAt: input.publishedAt || nowIso,
    updatedAt: nowIso,
  };

  const updatedList = [newArticle, ...list];
  saveArticles(updatedList);
  return newArticle;
}

export function updateArticle(idOrSlug: string, updates: Partial<Article>): Article | null {
  const list = loadArticles();
  const idx = list.findIndex((a) => a.id === idOrSlug || a.slug === idOrSlug);
  if (idx === -1) return null;

  const current = list[idx];
  let slug = current.slug;
  if (updates.title && updates.title !== current.title && !updates.slug) {
    slug = generateSlug(updates.title);
  } else if (updates.slug) {
    slug = generateSlug(updates.slug);
  }

  const updatedArticle: Article = {
    ...current,
    ...updates,
    id: current.id,
    slug,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updatedArticle;
  saveArticles(list);
  return updatedArticle;
}

export function deleteArticle(idOrSlug: string): boolean {
  const list = loadArticles();
  const filtered = list.filter((a) => a.id !== idOrSlug && a.slug !== idOrSlug);
  if (filtered.length === list.length) return false;
  saveArticles(filtered);
  return true;
}
