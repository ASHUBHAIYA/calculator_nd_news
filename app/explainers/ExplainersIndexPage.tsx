import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { Article } from '@/lib/types/article';
import { fetchLiveExplainers, normalizeCategory } from '@/lib/explainersApi';
import { sortArticlesLatestFirst } from '@/lib/articlesStorage';
import { SeoHead } from '@/components/SeoHead';
import { AdBanner } from '@/components/AdBanner';

const CATEGORIES = [
  'All',
  'Tax & Salary',
  'Personal Finance',
  'Market',
  'Economy',
] as const;

type CategoryOption = (typeof CATEGORIES)[number];

const ARTICLES_PER_PAGE = 9;

function formatHumanDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Recently Updated';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recently Updated';
  }
}

function calculateReadingTime(text?: string, wordCount?: number): number {
  if (wordCount && wordCount > 0) {
    return Math.max(1, Math.ceil(wordCount / 180));
  }
  const words = text ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 180));
}

function getCategoryBadge(cat: string) {
  const norm = normalizeCategory(cat).toLowerCase();
  if (norm.includes('tax') || norm.includes('salary')) {
    return {
      pill: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      dot: 'bg-emerald-500',
    };
  }
  if (norm.includes('personal')) {
    return {
      pill: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
      dot: 'bg-indigo-500',
    };
  }
  if (norm.includes('gold') || norm.includes('commodit')) {
    return {
      pill: 'bg-amber-50 text-amber-800 border-amber-200/80',
      dot: 'bg-amber-500',
    };
  }
  if (norm.includes('market')) {
    return {
      pill: 'bg-purple-50 text-purple-800 border-purple-200/80',
      dot: 'bg-purple-500',
    };
  }
  if (norm.includes('fuel') || norm.includes('energy')) {
    return {
      pill: 'bg-blue-50 text-blue-800 border-blue-200/80',
      dot: 'bg-blue-500',
    };
  }
  return {
    pill: 'bg-slate-100 text-slate-800 border-slate-200',
    dot: 'bg-slate-500',
  };
}

function formatCalculatorLabel(toolName?: string | null): string {
  if (!toolName || toolName === 'none') return 'Interactive Calculator';
  const clean = toolName.replace(/-/g, ' ').trim();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

export const ExplainersIndexPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawParamCat = searchParams.get('category') || 'All';
  const matchedCat = CATEGORIES.find(
    (c) => c.toLowerCase() === rawParamCat.toLowerCase()
  ) || 'All';

  const [selectedCategory, setSelectedCategory] = useState<CategoryOption>(matchedCat);
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Load articles from FastAPI backend
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchLiveExplainers(selectedCategory)
      .then((data) => {
        if (!isMounted) return;
        const sorted = sortArticlesLatestFirst(data);
        setArticles(sorted);
      })
      .catch((err) => {
        console.warn('Failed to load explainers:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const handleCategorySelect = (cat: CategoryOption) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setCurrentPage(1);
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  // Filter articles client-side for live search query
  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return articles;

    return articles.filter((article) => {
      const titleMatch = article.title?.toLowerCase().includes(query);
      const summaryMatch = article.summary?.toLowerCase().includes(query);
      const categoryMatch = article.category?.toLowerCase().includes(query);
      const calcMatch = article.calculatorType?.toLowerCase().includes(query);
      return titleMatch || summaryMatch || categoryMatch || calcMatch;
    });
  }, [articles, searchQuery]);

  // Featured hero article (shown on 'All' with page 1 and no search query)
  const isDefaultView = selectedCategory === 'All' && !searchQuery.trim();
  const featuredArticle = isDefaultView && filteredArticles.length > 0 ? filteredArticles[0] : null;

  // Grid articles (exclude featured article on page 1 of default view)
  const gridArticles =
    isDefaultView && currentPage === 1 && filteredArticles.length > 0
      ? filteredArticles.slice(1)
      : filteredArticles;

  // Pagination calculation
  const totalItems = gridArticles.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ARTICLES_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const startIndex = (safeCurrentPage - 1) * ARTICLES_PER_PAGE;
  const endIndex = Math.min(startIndex + ARTICLES_PER_PAGE, totalItems);
  const paginatedArticles = gridArticles.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="w-full pb-20 bg-slate-50/50 min-h-screen">
      <SeoHead
        title="Financial Explainers & Calculator Insights | BharatCalc"
        description="Data-backed financial intelligence, Union Budget tax analysis, commodity price breakdowns, and interactive calculators for Indian taxpayers and investors."
        canonicalPath="/explainers"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Explainers', path: '/explainers' },
        ]}
      />

      {/* 1. Hero Header */}
      <section className="bg-white border-b border-slate-200/80 pt-12 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Live Market Intelligence &amp; Guides</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 font-display tracking-tight leading-[1.15]">
              Financial Explainers &amp; Calculator Insights
            </h1>

            <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed">
              Authoritative, data-backed analysis decoding Indian tax amendments, pay revisions, bullion movements, and loan strategies. Every explainer is paired with real-time interactive calculation engines.
            </p>
          </div>

          {/* 2. Search & Category Filter Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900 ring-offset-1'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Live Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by topic, keyword, or tool..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Clear search query"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        {/* Featured Hero Article Banner */}
        {!loading && featuredArticle && currentPage === 1 && (
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-black px-3 py-1 rounded-full bg-emerald-400 text-slate-950 uppercase tracking-wider">
                  Featured Lead Story
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  {normalizeCategory(featuredArticle.category)}
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
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all hover:gap-3"
                >
                  <span>Read Full Explainer</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/10 px-3 py-2 rounded-xl backdrop-blur-xs">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{calculateReadingTime(featuredArticle.fullContent, featuredArticle.wordCount)} min read</span>
                </div>

                {featuredArticle.calculatorType && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-2 rounded-xl font-medium">
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Tool: {formatCalculatorLabel(featuredArticle.calculatorType)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Section Heading with Item Count & Filter State */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-900">
              {selectedCategory === 'All'
                ? searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : 'All Financial Guides & Intelligence'
                : `${selectedCategory} Insights`}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-semibold shadow-2xs">
              {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          {totalPages > 1 && !loading && (
            <span className="text-xs text-slate-500 font-medium">
              Page {safeCurrentPage} of {totalPages}
            </span>
          )}
        </div>

        {/* 4. State Handling: Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4 animate-pulse"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 w-24 bg-slate-200 rounded-full" />
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-5/6 bg-slate-200 rounded" />
                  <div className="h-5 w-3/4 bg-slate-200 rounded" />
                </div>
                <div className="space-y-1.5 pt-2">
                  <div className="h-3 w-full bg-slate-100 rounded" />
                  <div className="h-3 w-full bg-slate-100 rounded" />
                  <div className="h-3 w-2/3 bg-slate-100 rounded" />
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="h-6 w-32 bg-slate-100 rounded-lg" />
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-lg">No explainers match your criteria</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We couldn&apos;t find any guides matching {searchQuery ? `"${searchQuery}"` : 'the selected category'}. Try broadening your search or resetting all filters.
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear search / Reset filters</span>
            </button>
          </div>
        ) : (
          /* 3. Card Grid UI: 3-column responsive grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((item) => {
              const badge = getCategoryBadge(item.category);
              const readTime = calculateReadingTime(item.fullContent, item.wordCount);
              const calcLabel = formatCalculatorLabel(item.calculatorType || item.relatedCalculator);

              return (
                <Link
                  key={item.id || item.slug}
                  to={`/explainers/${item.slug}`}
                  className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:-translate-y-1 hover:shadow-lg hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between group text-left relative"
                >
                  <div className="space-y-3">
                    {/* Header: Category pill + Reading Time badge */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.pill}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                        {normalizeCategory(item.category)}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{readTime} min read</span>
                      </span>
                    </div>

                    {/* Headline: High contrast, line-clamp-2 */}
                    <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {/* Summary Preview: line-clamp-3 */}
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Footer: Interactive tool pill + Read Guide arrow */}
                  <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/80 truncate max-w-[170px]">
                      <Zap className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">Tool: {calcLabel}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 group-hover:text-emerald-800 shrink-0">
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && !loading && (
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
              <button
                type="button"
                onClick={() => handlePageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage <= 1}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors inline-flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                const isSelected = pageNum === safeCurrentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => handlePageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage >= totalPages}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors inline-flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </nav>
        )}

        {/* AdSense Placement */}
        <div className="pt-4">
          <AdBanner placement="explainers_bottom" />
        </div>
      </div>
    </div>
  );
};
