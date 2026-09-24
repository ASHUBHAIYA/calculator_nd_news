import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import { Article, ArticleCategory, RelatedCalculator, generateSlug } from '@/lib/types/article';
import { insertArticle } from '@/lib/supabase';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (article: Article) => void;
}

export const CreateExplainerModal: React.FC<Props> = ({ isOpen, onClose, onCreated }) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugCustom, setIsSlugCustom] = useState(false);
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('Gold & Commodities');
  const [relatedCalculator, setRelatedCalculator] = useState<RelatedCalculator>('gold');
  const [fullContent, setFullContent] = useState('');
  const [sources, setSources] = useState<Array<{ label: string; url: string }>>([
    { label: '', url: '' },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustom) {
      setSlug(generateSlug(val));
    }
  };

  const handleAddSource = () => {
    setSources([...sources, { label: '', url: '' }]);
  };

  const handleRemoveSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  const handleSourceChange = (index: number, field: 'label' | 'url', val: string) => {
    const next = [...sources];
    next[index][field] = val;
    setSources(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Article Title is required.');
      return;
    }
    if (!fullContent.trim()) {
      setError('Article Full Content (Markdown) is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const validSources = sources.filter((s) => s.url.trim().length > 0);

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || generateSlug(title),
          summary: summary.trim(),
          category,
          relatedCalculator,
          fullContent: fullContent.trim(),
          sources: validSources,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create article');
      }

      onCreated(data.article);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error creating article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Publish Trending Explainer</h2>
              <p className="text-xs text-slate-500">Auto-generates clean SEO slug & Schema.org NewsArticle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
              Article Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Why Did Gold Prices Surge Today?"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Slug */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                SEO URL Slug (Auto-Generated)
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsSlugCustom(false);
                  setSlug(generateSlug(title));
                }}
                className="text-[11px] text-emerald-600 hover:underline"
              >
                Reset to Auto
              </button>
            </div>
            <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs">
              <span className="text-slate-400 font-mono">/explainers/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setIsSlugCustom(true);
                  setSlug(generateSlug(e.target.value));
                }}
                placeholder="why-did-gold-prices-surge-today"
                className="w-full bg-transparent font-mono text-slate-800 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Category & Related Calculator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Gold & Commodities">Gold & Commodities</option>
                <option value="Tax & Salary">Tax & Salary</option>
                <option value="Fuel & Energy">Fuel & Energy</option>
                <option value="Market Trends">Market Trends</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                Related Interactive Calculator
              </label>
              <select
                value={relatedCalculator}
                onChange={(e) => setRelatedCalculator(e.target.value as RelatedCalculator)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="gold">Gold Jewelry 3% GST Calculator</option>
                <option value="silver">Silver & Sterling Purity Calculator</option>
                <option value="salary">In-Hand Salary (FY 2025-26)</option>
                <option value="petrol">Commute Fuel & EV Run Cost</option>
                <option value="none">None (General Financial Tools Suite)</option>
              </select>
            </div>
          </div>

          {/* Meta Summary (40-60 words) */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                SEO Meta Summary (40–60 words) *
              </label>
              <span className="text-[11px] text-slate-400 font-mono">
                {summary.trim() ? summary.trim().split(/\s+/).length : 0} words
              </span>
            </div>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Short, factual description summarizing key takeaways for Google snippet & AdSense preview..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Full Markdown Content */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
              Full Content (Markdown Supported: # Heading, **bold**, lists, tables, &gt; quotes) *
            </label>
            <textarea
              rows={8}
              required
              value={fullContent}
              onChange={(e) => setFullContent(e.target.value)}
              placeholder="Write the comprehensive explainer here in standard Markdown..."
              className="w-full font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Sources and Citations */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Primary Sources & Citations
              </label>
              <button
                type="button"
                onClick={handleAddSource}
                className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Source</span>
              </button>
            </div>

            <div className="space-y-2">
              {sources.map((src, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Citation Label (e.g. IBJA Official Benchmark)"
                    value={src.label}
                    onChange={(e) => handleSourceChange(idx, 'label', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-hidden"
                  />
                  <input
                    type="url"
                    placeholder="https://example.com/source"
                    value={src.url}
                    onChange={(e) => handleSourceChange(idx, 'url', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono focus:outline-hidden"
                  />
                  {sources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSource(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all"
            >
              {isSubmitting ? <span>Publishing...</span> : <span>Publish Explainer</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
