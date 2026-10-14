import React, { useState } from 'react';
import { Check, Plus, Trash2, ArrowUpRight, TrendingUp } from 'lucide-react';
import { SiteFinancialConfig, BenchmarkCardConfig } from '@/lib/siteConfig';
import { syncConfigToGithub } from '@/lib/githubSiteConfigSync';
import { getStoredGitHubConfig } from '@/lib/githubClient';
import { GitHubSyncBanner } from './GitHubSyncBanner';

interface LiveTickerTabProps {
  config: SiteFinancialConfig;
  onSave: (newBenchmarks: BenchmarkCardConfig[]) => Promise<void>;
  isSaving: boolean;
}

export const LiveTickerTab: React.FC<LiveTickerTabProps> = ({ config, onSave, isSaving }) => {
  const [benchmarks, setBenchmarks] = useState<BenchmarkCardConfig[]>(
    config.liveTickerBenchmarks || []
  );
  const [successMsg, setSuccessMsg] = useState(false);

  const [ghStatus, setGhStatus] = useState<{
    state: 'idle' | 'saving' | 'success' | 'error' | 'fallback';
    message?: string;
    commitSha?: string;
    commitUrl?: string;
  }>({ state: 'idle' });

  React.useEffect(() => {
    if (config.liveTickerBenchmarks && config.liveTickerBenchmarks.length > 0) {
      setBenchmarks(config.liveTickerBenchmarks);
    }
  }, [config.liveTickerBenchmarks]);

  const handleBenchmarkChange = (
    index: number,
    field: keyof BenchmarkCardConfig,
    value: string | boolean
  ) => {
    const next = [...benchmarks];
    next[index] = { ...next[index], [field]: value };
    setBenchmarks(next);
  };

  const handleAddCard = () => {
    setBenchmarks([
      ...benchmarks,
      {
        id: `custom-metric-${Date.now()}`,
        label: 'New Metric Title',
        value: '₹0.00',
        delta: 'Live Tag',
        isPositive: true,
        category: 'Market Metric',
      },
    ]);
  };

  const handleRemoveCard = (index: number) => {
    setBenchmarks(benchmarks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Save locally to preview / localStorage
    await onSave(benchmarks);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);

    // 2. Commit to GitHub directly
    const ghConfig = getStoredGitHubConfig();
    if (!ghConfig.token || !ghConfig.token.trim()) {
      setGhStatus({
        state: 'fallback',
        message:
          'Saved to local browser storage only. Please enter and save your GitHub Personal Access Token in the top bar to commit globally to Cloudflare Pages.',
      });
      return;
    }

    setGhStatus({
      state: 'saving',
      message: 'Committing live ticker cards directly to GitHub (data/site-config.json)...',
    });

    try {
      const commitRes = await syncConfigToGithub({
        updates: { liveTickerBenchmarks: benchmarks },
        commitMessage: `chore(ticker): update live ticker benchmarks [admin] (${new Date().toLocaleDateString('en-IN')})`,
      });

      if (commitRes.success) {
        setGhStatus({
          state: 'success',
          message: 'Live ticker cards committed to GitHub! Cloudflare deployment started (~60s).',
          commitSha: commitRes.commitSha,
          commitUrl: commitRes.commitUrl,
        });
      } else {
        setGhStatus({
          state: 'error',
          message: commitRes.message || commitRes.error || 'Failed to commit to GitHub.',
        });
      }
    } catch (err: any) {
      setGhStatus({
        state: 'error',
        message: `GitHub sync error: ${err.message || 'Request failed'}`,
      });
    }
  };

  const isCommitting = ghStatus.state === 'saving';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <GitHubSyncBanner status={ghStatus} />

      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Live Financial Ticker Cards</h2>
              <p className="text-[11px] text-slate-500">
                Front-page ticker items, market benchmark deltas, and live spot indicators.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {successMsg && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fade-in flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved Live Ticker!</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleAddCard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add Card</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benchmarks.map((card, idx) => (
            <div
              key={card.id || idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Card #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveCard(idx)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                  title="Remove Card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Card Label
                </label>
                <input
                  type="text"
                  value={card.label}
                  onChange={(e) => handleBenchmarkChange(idx, 'label', e.target.value)}
                  placeholder="e.g. Gold 24K (10g)"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Display Value
                  </label>
                  <input
                    type="text"
                    value={card.value}
                    onChange={(e) => handleBenchmarkChange(idx, 'value', e.target.value)}
                    placeholder="e.g. ₹76,850"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Trend Indicator
                  </label>
                  <select
                    value={card.isPositive ? 'pos' : 'neg'}
                    onChange={(e) =>
                      handleBenchmarkChange(idx, 'isPositive', e.target.value === 'pos')
                    }
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium cursor-pointer"
                  >
                    <option value="pos">Positive / Green ▲</option>
                    <option value="neg">Neutral / Red ▼</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Delta / Subtitle
                  </label>
                  <input
                    type="text"
                    value={card.delta}
                    onChange={(e) => handleBenchmarkChange(idx, 'delta', e.target.value)}
                    placeholder="e.g. Live Spot / Sec 115BAC"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={card.category}
                    onChange={(e) => handleBenchmarkChange(idx, 'category', e.target.value)}
                    placeholder="e.g. Bullion / FY 2026-27"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isSaving || isCommitting}
          className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isCommitting ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Committing to GitHub...</span>
            </>
          ) : isSaving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Saving Ticker...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Save &amp; Broadcast Live Ticker</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
