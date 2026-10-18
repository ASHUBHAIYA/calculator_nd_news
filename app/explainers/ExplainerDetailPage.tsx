import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Share2,
  Bookmark,
  Zap,
  Calculator,
  ArrowRight,
  Info,
} from 'lucide-react';
import { Article, normalizeSources } from '@/lib/types/article';
import { fetchLiveExplainerBySlug, fetchLiveExplainers, normalizeCategory } from '@/lib/explainersApi';
import { MarkdownContent } from '@/components/MarkdownContent';
import { ExplainerCalculatorWidget } from '@/components/ExplainerCalculatorWidget';
import { SeoHead, NewsArticleSchema } from '@/components/SeoHead';
import { AdBanner } from '@/components/AdBanner';

function formatHumanDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'Recently Published';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recently Published';
  }
}

function calculateReadingTime(text?: string, wordCount?: number): number {
  if (wordCount && wordCount > 0) {
    return Math.max(1, Math.ceil(wordCount / 180));
  }
  const words = text ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 180));
}

function getCalculatorRoute(calcName: string): { path: string; label: string } {
  const c = calcName.toLowerCase();
  if (c.includes('salary') || c.includes('tax') || c.includes('pay') || c.includes('fitment')) {
    return { path: '/calculators/in-hand-salary', label: 'In-Hand Salary Calculator (FY 2026-27)' };
  }
  if (c.includes('gold') || c.includes('jewelry')) {
    return { path: '/calculators/gold-jewelry-bill', label: 'Gold Jewelry GST & Bill Estimator' };
  }
  if (c.includes('silver')) {
    return { path: '/calculators/gold-jewelry-bill', label: 'Silver & Sterling Purity Tool' };
  }
  if (c.includes('loan') || c.includes('emi') || c.includes('mortgage')) {
    return { path: '/calculators/home-loan-prepayment', label: 'Home Loan 1 Extra EMI Saver' };
  }
  if (c.includes('fuel') || c.includes('commute') || c.includes('petrol') || c.includes('ev')) {
    return { path: '/calculators/commute-fuel', label: 'Daily Commute Fuel vs EV Cost Calculator' };
  }
  if (c.includes('solar') || c.includes('rooftop')) {
    return { path: '/calculators/solar-rooftop', label: 'PM Surya Ghar Solar Rooftop Subsidy' };
  }
  // Generic fallback to clean name
  const formatted = calcName.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  return { path: '/calculators/in-hand-salary', label: `${formatted} Tool` };
}

export const ExplainerDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;
    let isMounted = true;
    setLoading(true);

    fetchLiveExplainerBySlug(slug)
      .then((data) => {
        if (!isMounted) return;
        setArticle(data);
      })
      .catch((err) => {
        console.warn('Failed to load explainer details:', err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    // Also fetch a few related explainers for bottom recommendations
    fetchLiveExplainers()
      .then((list) => {
        if (!isMounted) return;
        const others = list.filter((a) => a.slug !== slug).slice(0, 3);
        setRelatedArticles(others);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleShare = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-600 text-sm font-semibold">Loading Live Financial Explainer...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
          <Info className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Explainer Not Found
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          The requested financial or statutory guide could not be retrieved. It may have moved or been updated.
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

  const categoryName = normalizeCategory(article.category);
  const readingTime = calculateReadingTime(article.fullContent, article.wordCount);
  const normalizedSources = normalizeSources(article.sources);
  const primaryCalcType = article.calculatorType || article.relatedCalculator || 'in-hand-salary';

  // Build list of all related calculators
  const allCalculatorPills = Array.from(
    new Set([
      ...(article.calculatorType ? [article.calculatorType] : []),
      ...(article.relatedCalculators || []),
    ])
  );

  // Structured schema for Google News / Search
  const newsArticleSchema: NewsArticleSchema = {
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    citation: normalizedSources.map((s) => s.url),
    articleSection: categoryName,
  };

  return (
    <div className="w-full pb-20 bg-slate-50/50 min-h-screen">
      <SeoHead
        title={`${article.title} | BharatCalc Explainers`}
        description={article.summary}
        canonicalPath={`/explainers/${article.slug}`}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Explainers', path: '/explainers' },
          { name: categoryName, path: `/explainers?category=${encodeURIComponent(categoryName)}` },
          { name: article.title, path: `/explainers/${article.slug}` },
        ]}
        newsArticle={newsArticleSchema}
      />

      {/* 1. Article Header */}
      <header className="bg-white border-b border-slate-200/80 pt-8 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb Navigation: Home / Explainers / {Article Category} */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium"
          >
            <Link to="/" className="hover:text-emerald-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link to="/explainers" className="hover:text-emerald-700 transition-colors">
              Explainers
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link
              to={`/explainers?category=${encodeURIComponent(categoryName)}`}
              className="text-emerald-700 hover:text-emerald-800 font-bold transition-colors"
            >
              {categoryName}
            </Link>
          </nav>

          {/* Meta bar: Date, Read Time, and Verified Badge */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fact-Checked &amp; Educational</span>
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

            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Bold Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 font-display tracking-tight leading-[1.18]">
            {article.title}
          </h1>

          {/* Prominent Lead Paragraph / Summary Callout Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-50/70 via-slate-50 to-slate-50 border-l-4 border-emerald-600 border border-slate-200/80 shadow-2xs">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 block mb-1.5">
              Key Takeaway &amp; Summary
            </span>
            <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-normal">
              {article.summary}
            </p>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        {/* 2. Featured Interactive Calculator Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md">
          <div className="mb-6 space-y-1.5 pb-4 border-b border-slate-100">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
              <Zap className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Live Scenario Tool</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 font-display tracking-tight">
              Interactive Scenario Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Test your own numbers against the statutory regulations discussed in this guide. Instant, zero-lag client-side computation.
            </p>
          </div>

          {/* Interactive Calculator Widget */}
          <ExplainerCalculatorWidget type={primaryCalcType} />
        </section>

        {/* 3. Typography & Content Body */}
        <main className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-2xs space-y-8">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100">
            Complete Analysis &amp; Technical Breakdown
          </div>

          <div className="reading-content">
            <MarkdownContent content={article.content || article.fullContent || ''} />
          </div>

          {/* Sources and Verifications */}
          {normalizedSources.length > 0 && (
            <div className="pt-8 border-t border-slate-200 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Statutory Citations &amp; Official References:
              </h4>
              <ul className="space-y-1.5">
                {normalizedSources.map((src, index) => (
                  <li key={index} className="flex items-center gap-2 text-xs text-slate-600">
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 hover:text-emerald-900 hover:underline font-medium break-all"
                    >
                      {src.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>

        {/* 4. Related Calculators & Next Steps */}
        {allCalculatorPills.length > 0 && (
          <section className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Related Interactive Calculators &amp; Next Steps
                </h3>
                <p className="text-[11px] text-slate-500">Explore complementary financial engines</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 pt-2">
              {allCalculatorPills.map((calcName) => {
                const info = getCalculatorRoute(calcName);
                return (
                  <Link
                    key={calcName}
                    to={info.path}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-800 hover:text-emerald-800 transition-all group"
                  >
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{info.label}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-700 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Recommended Explainers */}
        {relatedArticles.length > 0 && (
          <section className="max-w-3xl mx-auto space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              More Financial &amp; Market Explainers
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/explainers/${rel.slug}`}
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-700 uppercase">
                      {normalizeCategory(rel.category)}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-600 inline-flex items-center gap-1 mt-3">
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Compliant Financial Disclosure Banner */}
        <div className="max-w-3xl mx-auto p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 text-amber-900 text-xs leading-relaxed space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-950">
            <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Editorial &amp; Regulatory Disclaimer</span>
          </div>
          <p className="text-amber-900/90">
            Disclaimer: All calculations, rates, and scenarios are for educational purposes based on current Indian market and regulatory frameworks. Please consult a qualified tax or investment advisor for personal portfolio decisions.
          </p>
        </div>

        {/* AdSense Unit */}
        <div className="max-w-3xl mx-auto pt-2">
          <AdBanner placement="explainer_detail_bottom" />
        </div>
      </div>
    </div>
  );
};
