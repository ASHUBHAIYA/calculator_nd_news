import React, { useState } from 'react';
import { Check, Plus, Trash2, ArrowUpRight, TrendingUp } from 'lucide-react';
import { SiteFinancialConfig, BenchmarkCardConfig } from '@/lib/siteConfig';

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
    await onSave(benchmarks);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Homepage Live Ticker Benchmark Cards</h2>
              <p className="text-[11px] text-slate-500">
                These 7 hero benchmark cards are displayed at the very top of the homepage for instant reader context.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {successMsg && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fade-in flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Saved Live Ticker!</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleAddCard}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Card</span>
            </button>
          </div>
        </div>

        {/* List of Benchmark Cards */}
        <div className="space-y-3">
          {benchmarks.map((card, idx) => (
            <div
              key={card.id || idx}
              className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono font-bold flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{card.label}</span>
                </div>
                {benchmarks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCard(idx)}
                    className="p-1 text-slate-400 hover:text-red-600 rounded-md"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Label / Title
                  </label>
                  <input
                    type="text"
                    value={card.label}
                    onChange={(e) => handleBenchmarkChange(idx, 'label', e.target.value)}
                    placeholder="e.g. Gold 24K (per 10g)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Display Value / Rate
                  </label>
                  <input
                    type="text"
                    value={card.value}
                    onChange={(e) => handleBenchmarkChange(idx, 'value', e.target.value)}
                    placeholder="e.g. ₹76,850 or 8.40%"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-mono font-bold text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Delta / Badge Tag
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
                    placeholder="e.g. Bullion / FY 2025-26"
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
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
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
