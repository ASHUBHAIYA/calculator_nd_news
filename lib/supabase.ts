import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Article, ArticleCategory, RelatedCalculator, generateSlug } from './types/article';
import { INITIAL_ARTICLES } from './articlesData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validate whether real credentials (not placeholders) are provided
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes('your-project.supabase.co') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.includes('your-anon-key')
  );
};

// Singleton client
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

export interface SavedCalculation {
  id: string;
  calculator_type: string;
  title: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  notes?: string;
  created_at: string;
}

// Convert DB row format to application Article interface
function mapRowToArticle(row: any): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    summary: row.summary,
    fullContent: row.full_content || row.fullContent || '',
    category: row.category as ArticleCategory,
    relatedCalculator: (row.related_calculator || row.relatedCalculator || 'none') as RelatedCalculator,
    sources: Array.isArray(row.sources) ? row.sources : [],
    publishedAt: row.published_at || row.publishedAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
  };
}

// ==============================================================================
// 1. ARTICLES REPOSITORY (Supabase Cloud + Graceful Local Fallback)
// ==============================================================================

export async function fetchArticles(
  category?: string,
  search?: string
): Promise<{ articles: Article[]; source: 'supabase' | 'fallback' }> {
  if (supabase) {
    try {
      let query = supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false });

      if (category && category !== 'All') {
        query = query.eq('category', category);
      }

      if (search && search.trim()) {
        const q = search.trim();
        query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%,full_content.ilike.%${q}%`);
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return {
          articles: data.map(mapRowToArticle),
          source: 'supabase',
        };
      }
      if (error) {
        console.warn('Supabase fetch error, using local fallback:', error.message);
      }
    } catch (err) {
      console.warn('Failed querying Supabase, falling back to local dataset:', err);
    }
  }

  // Graceful fallback to server API or initial memory seed
  try {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (search && search.trim()) params.append('search', search.trim());
    const res = await fetch(`/api/articles?${params.toString()}`);
    if (res.ok) {
      const json = await res.json();
      if (json.articles && Array.isArray(json.articles)) {
        return { articles: json.articles, source: 'fallback' };
      }
    }
  } catch {
    // offline/static build mode
  }

  // Pure in-memory fallback
  let list = [...INITIAL_ARTICLES];
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
  return { articles: list, source: 'fallback' };
}

export async function fetchArticleBySlug(
  slug: string
): Promise<{ article: Article | null; source: 'supabase' | 'fallback' }> {
  const cleanSlug = slug.toLowerCase().trim();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('slug', cleanSlug)
        .maybeSingle();

      if (!error && data) {
        // Fire-and-forget view count increment
        supabase.rpc('increment_article_views', { article_slug: cleanSlug }).catch(() => {});
        return { article: mapRowToArticle(data), source: 'supabase' };
      }
    } catch (err) {
      console.warn('Error reading article from Supabase, attempting fallback:', err);
    }
  }

  // Fallback to server API
  try {
    const res = await fetch(`/api/articles/${cleanSlug}`);
    if (res.ok) {
      const json = await res.json();
      if (json.article) {
        return { article: json.article, source: 'fallback' };
      }
    }
  } catch {}

  // Fallback to initial seed
  const found = INITIAL_ARTICLES.find((a) => a.slug === cleanSlug);
  return { article: found || null, source: 'fallback' };
}

export async function insertArticle(articleData: Partial<Article>): Promise<Article> {
  const title = articleData.title?.trim() || 'Untitled Explainer';
  const slug = articleData.slug?.trim() ? generateSlug(articleData.slug) : generateSlug(title);
  const now = new Date().toISOString();

  const payload = {
    title,
    slug,
    summary: articleData.summary?.trim() || '',
    full_content: articleData.fullContent || '',
    category: articleData.category || 'Market Trends',
    related_calculator: articleData.relatedCalculator || 'none',
    sources: articleData.sources || [],
    published_at: articleData.publishedAt || now,
    updated_at: now,
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        return mapRowToArticle(data);
      }
      if (error) {
        console.error('Supabase article insert failed:', error);
        throw new Error(error.message);
      }
    } catch (err: any) {
      console.warn('Falling back to local API for article insert:', err);
    }
  }

  // Fallback to Node.js backend
  const res = await fetch('/api/articles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(articleData),
  });

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}));
    throw new Error(errJson.error || 'Failed to publish explainer');
  }

  const json = await res.json();
  return json.article;
}

// ==============================================================================
// 2. SAVED CALCULATIONS REPOSITORY (Persistent User History)
// ==============================================================================

const LOCAL_STORAGE_CALCS_KEY = 'bharatcalc_saved_calculations';

export async function saveCalculation(data: {
  calculatorType: string;
  title: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  notes?: string;
}): Promise<SavedCalculation> {
  const newCalc: SavedCalculation = {
    id: `calc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    calculator_type: data.calculatorType,
    title: data.title,
    inputs: data.inputs,
    results: data.results,
    notes: data.notes,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data: dbData, error } = await supabase
        .from('saved_calculations')
        .insert([
          {
            calculator_type: data.calculatorType,
            title: data.title,
            inputs: data.inputs,
            results: data.results,
            notes: data.notes,
          },
        ])
        .select()
        .single();

      if (!error && dbData) {
        return {
          id: dbData.id,
          calculator_type: dbData.calculator_type,
          title: dbData.title,
          inputs: dbData.inputs,
          results: dbData.results,
          notes: dbData.notes,
          created_at: dbData.created_at,
        };
      }
    } catch (e) {
      console.warn('Could not save calculation to Supabase, saving locally:', e);
    }
  }

  // Local storage fallback
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CALCS_KEY) || '[]');
    const updated = [newCalc, ...existing].slice(0, 50); // Keep last 50
    localStorage.setItem(LOCAL_STORAGE_CALCS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }

  return newCalc;
}

export async function fetchSavedCalculations(calculatorType?: string): Promise<SavedCalculation[]> {
  if (supabase) {
    try {
      let query = supabase
        .from('saved_calculations')
        .select('*')
        .order('created_at', { ascending: false });

      if (calculatorType) {
        query = query.eq('calculator_type', calculatorType);
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          calculator_type: d.calculator_type,
          title: d.title,
          inputs: d.inputs,
          results: d.results,
          notes: d.notes,
          created_at: d.created_at,
        }));
      }
    } catch (e) {
      console.warn('Error reading saved calculations from Supabase:', e);
    }
  }

  // LocalStorage fallback
  try {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CALCS_KEY) || '[]');
    if (calculatorType) {
      return stored.filter((c: SavedCalculation) => c.calculator_type === calculatorType);
    }
    return stored;
  } catch {
    return [];
  }
}

export async function deleteSavedCalculation(id: string): Promise<boolean> {
  if (supabase) {
    try {
      const { error } = await supabase.from('saved_calculations').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Supabase delete error:', e);
    }
  }

  try {
    const stored: SavedCalculation[] = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_CALCS_KEY) || '[]'
    );
    const filtered = stored.filter((c) => c.id !== id);
    localStorage.setItem(LOCAL_STORAGE_CALCS_KEY, JSON.stringify(filtered));
    return true;
  } catch {
    return false;
  }
}

// ==============================================================================
// 3. CONNECTION DIAGNOSTICS & SYSTEM INFO
// ==============================================================================

export interface SupabaseStatus {
  isConfigured: boolean;
  endpointUrl: string | null;
  mode: 'supabase_cloud' | 'local_fallback';
  statusMessage: string;
}

export function getSupabaseStatus(): SupabaseStatus {
  const configured = isSupabaseConfigured();
  return {
    isConfigured: configured,
    endpointUrl: configured ? supabaseUrl : null,
    mode: configured ? 'supabase_cloud' : 'local_fallback',
    statusMessage: configured
      ? 'Connected to Supabase PostgreSQL Database'
      : 'Running in Local/Server Fallback Mode (Add VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY to link Supabase)',
  };
}
