import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  Share2,
  TrendingUp,
  Bookmark,
  CheckCircle2,
  Tag,
  BookOpen,
} from 'lucide-react';
import { Article, ArticleCategory, normalizeSources } from '@/lib/types/article';
import { INITIAL_ARTICLES } from '@/lib/articlesData';
import { fetchArticleBySlug, fetchArticles } from '@/lib/supabase';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ExplainerCalculatorWidget } from '@/components/ExplainerCalculatorWidget';
import { SeoHead, NewsArticleSchema } from '@/components/SeoHead';
import { AdBanner } from '@/components/AdBanner';

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

export const ExplainerDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(() => {
    // Immediate fallback to memory seed if present
    const found = INITIAL_ARTICLES.find((a) => a.slug === slug);
    return found || null;
  });
  const [allArticles, setAllArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [loading, setLoading] = useState<boolean>(!article);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    fetchArticleBySlug(slug)
      .then(({ article: foundArticle }) => {
        if (foundArticle) {
          setArticle(foundArticle);
        }
      })
      .catch((err) => {
        console.error('Error fetching explainer:', err);
      })
      .finally(() => setLoading(false));

    // Fetch all articles for "Trending in Other Categories"
    fetchArticles()
      .then(({ articles: list }) => {
        if (list && list.length > 0) {
          setAllArticles(list);
        }
      })
      .catch(() => {});
  }, [slug]);

  if (loading && !article) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-600 text-sm font-semibold">Loading Explainer...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Explainer Not Found</h1>
        <p className="text-sm text-slate-600">
          The requested financial or commodity explainer could not be located.
        </p>
        <Link
          to="/explainers"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Explainers</span>
        </Link>
      </div>
    );
  }

  const categoryStyle = getCategoryColor(article.category);
  const readingTime = calculateReadingTime(article.fullContent);
  const normalizedSources = normalizeSources(article.sources);
  const sourceUrls = normalizedSources.map((s) => s.url);

  // Trending in other categories (exclude current article, prefer different categories)
  const otherPosts = allArticles
    .filter((a) => a.slug !== article.slug)
    .sort((a, b) => {
      // Prioritize different categories
      const aDiff = a.category !== article.category ? 1 : 0;
      const bDiff = b.category !== article.category ? 1 : 0;
      return bDiff - aDiff;
    })
    .slice(0, 3);

  // Schema.org NewsArticle structured data
  const newsArticleSchema: NewsArticleSchema = {
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    citation: sourceUrls,
    articleSection: article.category,
  };

  return (
    <div className="w-full pb-16">
      {/* Dynamic SEO & Schema.org JSON-LD */}
      <SeoHead
        title={`${article.title} | BharatCalc`}
        description={article.summary}
        canonicalPath={`/explainers/${article.slug}`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Explainers', path: '/explainers' },
          { name: article.category, path: `/explainers?category=${encodeURIComponent(article.category)}` },
          { name: article.title, path: `/explainers/${article.slug}` },
        ]}
        newsArticle={newsArticleSchema}
      />

      {/* 1. Header Area with Breadcrumbs, Category Pill, Human-Readable Date */}
      <header className="bg-white border-b border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs: Home > Explainers > [Category] > Title */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-4"
          >
            <Link to="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/explainers" className="hover:text-emerald-700 transition-colors">
              Explainers
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              to={`/explainers?category=${encodeURIComponent(article.category)}`}
              className="hover:text-emerald-700 font-medium transition-colors"
            >
              {article.category}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold line-clamp-1 max-w-xs sm:max-w-md">
              {article.title}
            </span>
          </nav>

          {/* Category Pill & Meta Stats */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${categoryStyle.badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${categoryStyle.dot}`} />
              {article.category}
            </span>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <time dateTime={article.publishedAt}>{formatHumanDate(article.publishedAt)}</time>
            </div>

            <span className="text-slate-300">•</span>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{readingTime} min read</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 font-display tracking-tight leading-tight max-w-4xl">
            {article.title}
          </h1>

          {/* Meta Summary / Lead paragraph */}
          <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-sm sm:text-base leading-relaxed max-w-4xl font-normal">
            <span className="font-bold text-slate-900 block text-xs uppercase tracking-wider mb-1 text-emerald-800">
              Executive Summary
            </span>
            {article.summary}
          </div>
        </div>
      </header>

      {/* Main Two-Column Layout (Article Body on Left, Sticky Calculator on Right) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Column */}
          <main className="lg:col-span-8 space-y-8">
            {/* Markdown Body */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
              <MarkdownContent content={article.fullContent} />
            </div>

            {/* AdSense In-Article Placement with safe clearance */}
            <div className="my-8">
              <AdBanner format="rectangle" slotId={`explainer-${article.slug}-inarticle`} />
            </div>

            {/* Sources Box: Primary Sources & References */}
            {normalizedSources.length > 0 && (
              <section
                aria-label="Primary Sources & References"
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 shadow-2xs"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">Primary Sources & References</h2>
                    <p className="text-[11px] text-slate-500">
                      Authoritative citations, regulatory gazettes, and market benchmarks
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 pt-2 border-t border-slate-200/70">
                  {normalizedSources.map((source, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="text-slate-400 font-mono mt-0.5">{idx + 1}.</span>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-900 hover:underline font-medium break-all"
                      >
                        <span>{source.label || source.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0 text-slate-400" />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </main>

          {/* Embedded Sticky Utility / Sidebar on Right */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Relevant Interactive Calculator Widget */}
              <ExplainerCalculatorWidget relatedCalculator={article.relatedCalculator} />

              {/* Sidebar Ad Placement */}
              <AdBanner format="rectangle" slotId={`explainer-${article.slug}-sidebar`} />
            </div>
          </aside>
        </div>
      </div>

      {/* Pre-footer: "Trending in Other Categories" showing 2-3 related posts */}
      {otherPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-12 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                Trending in Other Categories
              </h2>
            </div>
            <Link
              to="/explainers"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-1"
            >
              <span>View All Explainers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherPosts.map((post) => {
              const pill = getCategoryColor(post.category);
              return (
                <Link
                  key={post.id}
                  to={`/explainers/${post.slug}`}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${pill.badge}`}
                      >
                        {post.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {formatHumanDate(post.publishedAt)}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>Read Full Explainer</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
