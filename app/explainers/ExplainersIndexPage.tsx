import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  Plus,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Tag,
} from 'lucide-react';
import { Article, ArticleCategory } from '@/lib/types/article';
import { INITIAL_ARTICLES } from '@/lib/articlesData';
import { fetchArticles as fetchArticlesSupabase, getSupabaseStatus } from '@/lib/supabase';
import { CreateExplainerModal } from '@/components/CreateExplainerModal';
import { SupabaseCloudflareModal } from '@/components/SupabaseCloudflareModal';
import { SeoHead } from '@/components/SeoHead';
import { AdBanner } from '@/components/AdBanner';

const CATEGORIES: Array<'All' | ArticleCategory> = [
  'All',
  'Gold & Commodities',
  'Tax & Salary',
  'Fuel & Energy',
  'Market Trends',
];

function formatHumanDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Sep 24, 2026';
  }
}

function calculateReadingTime(text: string): number {
  const words = text ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

function getCategoryColor(cat: ArticleCategory) {
  switch (cat) {
    case 'Gold & Commodities':
      return {
        badge: 'bg-amber-50 text-amber-800 border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'Tax & Salary':
      return {
        badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
      };
    case 'Fuel & Energy':
      return {
        badge: 'bg-blue-50 text-blue-800 border-blue-200',
        dot: 'bg-blue-500',
      };
    case 'Market Trends':
    default:
      return {
        badge: 'bg-purple-50 text-purple-800 border-purple-200',
        dot: 'bg-purple-500',
      };
  }
}

export const ExplainersIndexPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = (searchParams.get('category') as ArticleCategory) || 'All';

  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<'All' | ArticleCategory>(
    CATEGORIES.includes(initialCategory) ? initialCategory : 'All'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<'supabase' | 'fallback'>('fallback');

  const supabaseStatus = getSupabaseStatus();

  const fetchArticles = () => {
    setLoading(true);
    fetchArticlesSupabase(selectedCategory, searchQuery)
      .then(({ articles: list, source }) => {
        setArticles(list);
        setDataSource(source);
      })
      .catch((err) => {
        console.warn('Error fetching articles:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, searchQuery]);

  const handleCategorySelect = (cat: 'All' | ArticleCategory) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleArticleCreated = (newArticle: Article) => {
    setArticles((prev) => [newArticle, ...prev]);
  };

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const remainingArticles = articles.length > 0 ? articles.slice(1) : [];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Trending Financial, Tax & Commodity Explainers | BharatCalc"
        description="Authoritative, data-backed explainers on Indian gold surges, New Tax Regime slabs (FY 2025-26), commute fuel economies, and RBI floating mortgage rules."
        canonicalPath="/explainers"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Trending Explainers', path: '/explainers' },
        ]}
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Regulatory Grounding & Financial Intelligence</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
                Trending Financial & Commodity Explainers
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Clear, transparent deep dives decoding gold price surges, FY 2025-26 tax slabs, fuel economies, and mortgage amortizations. Every explainer is paired with an interactive calculator.
              </p>
            </div>

            <div className="shrink-0 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setIsArchitectureModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="View Supabase & Cloudflare Pages Configuration"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    supabaseStatus.isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                <span>Supabase & Cloudflare</span>
              </button>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Publish Explainer</span>
              </button>
            </div>
          </div>

          {/* Filters & Search Bar */}
          <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-slate-100">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search explainers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* AdSense Banner with safe margin */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <AdBanner format="leaderboard" slotId="explainers-hub-top" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        {/* Featured Hero Article */}
        {featuredArticle && selectedCategory === 'All' && !searchQuery && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 uppercase tracking-wider">
                  Featured Explainer
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {featuredArticle.category}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-300 font-medium">
                  {formatHumanDate(featuredArticle.publishedAt)}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white leading-tight">
                {featuredArticle.title}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                {featuredArticle.summary}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to={`/explainers/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                >
                  <span>Read Full Explainer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{calculateReadingTime(featuredArticle.fullContent)} min read</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Grid of Articles */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">No explainers found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your category filter or search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedCategory === 'All' && !searchQuery ? remainingArticles : articles).map(
              (item) => {
                const pill = getCategoryColor(item.category);
                const readingTime = calculateReadingTime(item.fullContent);

                return (
                  <Link
                    key={item.id}
                    to={`/explainers/${item.slug}`}
                    className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between group text-left"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${pill.badge}`}
                        >
                          {item.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {formatHumanDate(item.publishedAt)}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3 h-3" />
                        <span>{readingTime} min</span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:text-emerald-900">
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              }
            )}
          </div>
        )}
      </div>

      {/* Authoring Modal */}
      <CreateExplainerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleArticleCreated}
      />

      {/* Supabase & Cloudflare Architecture Diagnostics Modal */}
      <SupabaseCloudflareModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />
    </div>
  );
};
