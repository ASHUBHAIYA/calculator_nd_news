import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Filter,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Tag,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Article, ArticleCategory } from '@/lib/types/article';
import { INITIAL_ARTICLES } from '@/lib/articlesData';
import { fetchArticles as fetchArticlesSupabase, getSupabaseStatus } from '@/lib/supabase';
import { sortArticlesLatestFirst, getCachedArticles } from '@/lib/articlesStorage';
import { SeoHead } from '@/components/SeoHead';
import { AdBanner } from '@/components/AdBanner';

const CATEGORIES: Array<'All' | ArticleCategory> = [
  'All',
  'Gold & Commodities',
  'Tax & Salary',
  'Fuel & Energy',
  'Market Trends',
];

const ARTICLES_PER_PAGE = 6;

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

  // Seed with cached articles if present, otherwise initial articles (sorted latest first)
  const [articles, setArticles] = useState<Article[]>(() => {
    const cached = getCachedArticles();
    if (cached && cached.length > 0) {
      return sortArticlesLatestFirst(cached);
    }
    return sortArticlesLatestFirst(INITIAL_ARTICLES);
  });
  const [selectedCategory, setSelectedCategory] = useState<'All' | ArticleCategory>(
    CATEGORIES.includes(initialCategory) ? initialCategory : 'All'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState<'supabase' | 'fallback'>('fallback');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const supabaseStatus = getSupabaseStatus();

  const fetchArticles = () => {
    setLoading(true);
    fetchArticlesSupabase(selectedCategory, searchQuery)
      .then(({ articles: list, source }) => {
        const sorted = sortArticlesLatestFirst(list);
        setArticles(sorted);
        setDataSource(source);
      })
      .catch((err) => {
        console.warn('Error fetching articles:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArticles();
    setCurrentPage(1); // Reset to page 1 on filter or search changes
  }, [selectedCategory, searchQuery]);

  const handleCategorySelect = (cat: 'All' | ArticleCategory) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  // When on 'All' with no search query on page 1, show a Hero featured explainer
  const isDefaultView = selectedCategory === 'All' && !searchQuery.trim();
  const featuredArticle = isDefaultView && articles.length > 0 ? articles[0] : null;

  // Grid list: on default view on page 1, exclude featuredArticle from grid; on page 2+, show all articles in grid
  const gridArticles =
    isDefaultView && currentPage === 1 && articles.length > 0
      ? articles.slice(1)
      : articles;

  // Pagination calculation
  const totalItems = gridArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ARTICLES_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const startIndex = (safeCurrentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = Math.min(startIndex + ARTICLES_PER_PAGE, totalItems);
  const paginatedArticles = gridArticles.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Trending Financial, Tax & Commodity Explainers | BharatCalc"
        description="Authoritative, data-backed explainers on Indian gold surges, New Tax Regime slabs (FY 2026-27), commute fuel economies, and RBI floating mortgage rules."
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
                <span>Regulatory Grounding & Financial Intelligence</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
                Trending Financial & Commodity Explainers
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Clear, transparent deep dives decoding gold price surges, FY 2026-27 tax slabs, fuel economies, and mortgage amortizations. Every explainer is paired with an interactive calculator.
              </p>
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

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        {/* Featured Hero Article (Latest Explainer) */}
        {featuredArticle && currentPage === 1 && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 uppercase tracking-wider">
                  Latest &amp; Featured Explainer
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

        {/* Section Heading with Item Count */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              {selectedCategory === 'All'
                ? searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : 'All Financial & Commodity Explainers'
                : `${selectedCategory} Explainers`}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {articles.length} total
            </span>
          </div>

          {totalPages > 1 && (
            <span className="text-xs text-slate-500 font-medium">
              Page {safeCurrentPage} of {totalPages}
            </span>
          )}
        </div>

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
            {paginatedArticles.map((item) => {
              const pill = getCategoryColor(item.category);
              const readingTime = calculateReadingTime(item.fullContent);

              return (
                <Link
                  key={item.id || item.slug}
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
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <nav
            aria-label="Explainers Pagination"
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200"
          >
            <div className="text-xs text-slate-500 font-medium">
              Showing <span className="font-semibold text-slate-800">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-slate-800">{endIndex}</span> of{' '}
              <span className="font-semibold text-slate-800">{totalItems}</span> articles
            </div>

            <div className="flex items-center gap-1.5">
              {/* First Page */}
              <button
                type="button"
                onClick={() => handlePageChange(1)}
                disabled={safeCurrentPage === 1}
                aria-label="Go to first page"
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              {/* Prev Page */}
              <button
                type="button"
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                aria-label="Previous page"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              {/* Page Number Pills */}
              <div className="flex items-center gap-1 mx-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  // Only display near pages if totalPages is large
                  if (
                    totalPages > 7 &&
                    pageNum !== 1 &&
                    pageNum !== totalPages &&
                    Math.abs(pageNum - safeCurrentPage) > 2
                  ) {
                    if (
                      pageNum === 2 ||
                      pageNum === totalPages - 1
                    ) {
                      return (
                        <span key={`ellipsis-${pageNum}`} className="px-1 text-slate-400 text-xs font-bold">
                          …
                        </span>
                      );
                    }
                    return null;
                  }

                  const isActive = pageNum === safeCurrentPage;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-slate-950 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Page */}
              <button
                type="button"
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                aria-label="Next page"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Last Page */}
              <button
                type="button"
                onClick={() => handlePageChange(totalPages)}
                disabled={safeCurrentPage === totalPages}
                aria-label="Go to last page"
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
};
