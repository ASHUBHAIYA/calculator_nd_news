import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  BookOpen,
  Eye,
  Edit3,
  Check,
  AlertCircle,
  Link as LinkIcon,
} from 'lucide-react';
import {
  Article,
  ArticleCategory,
  RelatedCalculator,
  ARTICLE_CATEGORIES,
  generateSlug,
  normalizeSources,
} from '@/lib/types/article';
import { MarkdownContent } from '@/components/MarkdownContent';

interface ExplainerEditorModalProps {
  isOpen: boolean;
  articleToEdit: Article | null;
  onClose: () => void;
  onSave: (articleData: Partial<Article>) => Promise<void>;
  isSaving: boolean;
}

const CALCULATOR_OPTIONS: Array<{ value: RelatedCalculator; label: string }> = [
  { value: 'none', label: 'None (Pure Editorial - No Embedded Calculator)' },
  { value: 'gold', label: 'Gold & Silver Jewelry Bill Calculator' },
  { value: 'salary', label: 'In-Hand Salary Calculator (FY 2025-26)' },
  { value: 'loan', label: 'Home Loan Prepayment Saver' },
  { value: 'fuel', label: 'Commute Fuel vs EV Calculator' },
  { value: 'solar', label: 'PM Surya Ghar Solar Rooftop Calculator' },
];

export const ExplainerEditorModal: React.FC<ExplainerEditorModalProps> = ({
  isOpen,
  articleToEdit,
  onClose,
  onSave,
  isSaving,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugAuto, setIsSlugAuto] = useState(true);
  const [summary, setSummary] = useState('');
  const [category, setCategory] = useState<string>('Gold & Commodities');
  const [customCategoryMode, setCustomCategoryMode] = useState<boolean>(false);
  const [relatedCalculator, setRelatedCalculator] = useState<RelatedCalculator>('none');
  const [fullContent, setFullContent] = useState('');
  const [sources, setSources] = useState<Array<{ label: string; url: string }>>([
    { label: '', url: '' },
  ]);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setSlug(articleToEdit.slug);
      setIsSlugAuto(false);
      setSummary(articleToEdit.summary);
      setCategory(articleToEdit.category);
      setRelatedCalculator(articleToEdit.relatedCalculator || 'none');
      setFullContent(articleToEdit.fullContent || '');
      setSources(
        articleToEdit.sources && articleToEdit.sources.length > 0
          ? normalizeSources(articleToEdit.sources)
          : [{ label: '', url: '' }]
      );
    } else {
      setTitle('');
      setSlug('');
      setIsSlugAuto(true);
      setSummary('');
      setCategory('Gold & Commodities');
      setRelatedCalculator('gold');
      setFullContent(`### The Trigger
Explain what happened in the last 12-24 hours to drive this surge or regulatory shift.

### Key Highlights & Facts
- **Key Point 1**: Fact, metric, or verified official circular citation.
- **Key Point 2**: Percentage change or financial impact on typical consumers.
- **Key Point 3**: Key stakeholder or regulatory quotes.

### Regulatory Background & Economic Context
Provide clear, educational context that explains how we arrived at this moment.

### Broader Consumer Impact & What's Next
Summarize forward-looking insights, deadlines, or actionable steps for citizens.`);
      setSources([{ label: 'Official Regulatory Source', url: 'https://' }]);
    }
    setError(null);
    setActiveTab('write');
  }, [articleToEdit, isOpen]);

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isSlugAuto) {
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

    const validSources = sources.filter((s) => s.url.trim().length > 0);

    try {
      await onSave({
        title: title.trim(),
        slug: slug.trim() || generateSlug(title),
        summary: summary.trim(),
        category,
        relatedCalculator,
        fullContent: fullContent.trim(),
        sources: validSources,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save explainer.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950 font-display">
                {articleToEdit ? 'Edit Explainer Article' : 'Compose New Financial Explainer'}
              </h2>
              <p className="text-[11px] text-slate-500">
                {articleToEdit ? `Editing: ${articleToEdit.slug}` : 'Draft data-backed editorial explainer with live calculator sync'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Article Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Why Are 24K Gold Prices Surging Today?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 text-sm font-semibold"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  URL Slug *
                </label>
                <button
                  type="button"
                  onClick={() => setIsSlugAuto(!isSlugAuto)}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold"
                >
                  {isSlugAuto ? 'Custom Slug' : 'Auto-Generate'}
                </button>
              </div>
              <div className="flex rounded-xl border border-slate-300 focus-within:ring-2 focus-within:ring-slate-900 overflow-hidden">
                <span className="inline-flex items-center px-3 bg-slate-100 text-slate-500 text-xs border-r border-slate-300 font-mono">
                  /explainers/
                </span>
                <input
                  type="text"
                  value={slug}
                  disabled={isSlugAuto}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="why-are-gold-prices-surging"
                  className="flex-1 px-3 py-2 text-xs font-mono bg-white focus:outline-hidden disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Category & Related Calculator */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Editorial Category *
                </label>
                <button
                  type="button"
                  onClick={() => setCustomCategoryMode(!customCategoryMode)}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                >
                  {customCategoryMode ? '← Pick from list' : '+ Add Custom Category'}
                </button>
              </div>

              {customCategoryMode ? (
                <div>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Type new category (e.g. Mutual Funds, Real Estate, Crypto)..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-xs font-semibold bg-white"
                    required
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {ARTICLE_CATEGORIES.slice(0, 4).map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => {
                          setCategory(c);
                          setCustomCategoryMode(false);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <select
                  value={category}
                  onChange={(e) => {
                    if (e.target.value === '__custom__') {
                      setCustomCategoryMode(true);
                      setCategory('');
                    } else {
                      setCategory(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-xs font-semibold bg-white"
                >
                  {ARTICLE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__custom__">+ Custom Category...</option>
                </select>
              )}
              <p className="text-[10px] text-slate-400 mt-1">
                Categories group articles in the Explainer Blog index and search filters.
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Linked Interactive Calculator
                </label>
                <span className="text-[10px] text-slate-400 font-medium">Optional</span>
              </div>
              <select
                value={relatedCalculator}
                onChange={(e) => setRelatedCalculator(e.target.value as RelatedCalculator)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-xs font-semibold bg-white"
              >
                {CALCULATOR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                Embeds a live interactive calculation engine inside the article so readers can compute their numbers. Select <strong className="text-slate-600">None</strong> for standard news/editorials.
              </p>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Summary (Featured Card Description)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A concise 2-sentence summary highlighting key numbers, percentages, and triggers..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-xs leading-relaxed"
            />
          </div>

          {/* Full Markdown Content with Tabbed Write/Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Explainer Content (Markdown) *
              </label>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'write' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                  }`}
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Write</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-md font-bold transition-all flex items-center gap-1.5 ${
                    activeTab === 'preview' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  <span>Live Preview</span>
                </button>
              </div>
            </div>

            {activeTab === 'write' ? (
              <textarea
                rows={10}
                value={fullContent}
                onChange={(e) => setFullContent(e.target.value)}
                placeholder="Write full article in Markdown..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 text-xs font-mono leading-relaxed bg-slate-50/50 focus:bg-white"
                required
              />
            ) : (
              <div className="p-4 rounded-xl border border-slate-200 bg-white min-h-[240px] max-h-[300px] overflow-y-auto">
                <MarkdownContent content={fullContent} />
              </div>
            )}
          </div>

          {/* Primary Source Citations */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Primary Sources &amp; Citations</span>
              </label>
              <button
                type="button"
                onClick={handleAddSource}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
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
                    value={src.label}
                    onChange={(e) => handleSourceChange(idx, 'label', e.target.value)}
                    placeholder="Source Label (e.g. RBI Bulletin / MCX)"
                    className="w-1/3 px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                  />
                  <input
                    type="url"
                    value={src.url}
                    onChange={(e) => handleSourceChange(idx, 'url', e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono"
                  />
                  {sources.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSource(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving Article...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{articleToEdit ? 'Update Explainer' : 'Publish Explainer'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
