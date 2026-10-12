import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  Filter,
} from 'lucide-react';
import { Article, ArticleCategory, ARTICLE_CATEGORIES } from '@/lib/types/article';

interface ExplainersTabProps {
  articles: Article[];
  onOpenCreate: () => void;
  onOpenEdit: (article: Article) => void;
  onOpenDelete: (article: Article) => void;
  loading: boolean;
}

export const ExplainersTab: React.FC<ExplainersTabProps> = ({
  articles,
  onOpenCreate,
  onOpenEdit,
  onOpenDelete,
  loading,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCat === 'All' || art.category === selectedCat;
    const matchesSearch =
      !search.trim() ||
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase()) ||
      art.slug.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Action & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-1 items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles by title, slug or content..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 text-xs bg-slate-50/60 focus:bg-white"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50/60 focus:bg-white cursor-pointer"
          >
            <option value="All">All Categories ({articles.length})</option>
            {ARTICLE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>New Explainer</span>
        </button>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Title &amp; Slug</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Calculator</th>
                <th className="py-3 px-4">Published</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
                      <span>Loading explainers...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="space-y-1">
                      <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                      <div className="font-semibold text-slate-700">No explainers match your criteria</div>
                      <div className="text-[11px]">Click &quot;New Explainer&quot; to author your first article.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => {
                  const pubDate = new Date(art.publishedAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={art.id || art.slug} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 line-clamp-1">{art.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono line-clamp-1 mt-0.5">
                          /explainers/{art.slug}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {art.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {art.relatedCalculator || 'none'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{pubDate}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/explainers/${art.slug}`}
                            target="_blank"
                            title="View Public Page"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => onOpenEdit(art)}
                            title="Edit Explainer"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onOpenDelete(art)}
                            title="Delete Explainer"
                            className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
