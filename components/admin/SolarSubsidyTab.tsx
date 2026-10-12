import React, { useState } from 'react';
import { Sun, Check, Zap } from 'lucide-react';
import { SiteFinancialConfig } from '@/lib/siteConfig';

interface SolarSubsidyTabProps {
  config: SiteFinancialConfig;
  onSave: (newSolarConfig: SiteFinancialConfig['solarRooftop']) => Promise<void>;
  isSaving: boolean;
}

export const SolarSubsidyTab: React.FC<SolarSubsidyTabProps> = ({ config, onSave, isSaving }) => {
  const [costPerKw, setCostPerKw] = useState(config.solarRooftop.benchmarkCostPerKw);
  const [sub1Kw, setSub1Kw] = useState(config.solarRooftop.subsidy1Kw);
  const [sub2Kw, setSub2Kw] = useState(config.solarRooftop.subsidy2Kw);
  const [sub3Kw, setSub3Kw] = useState(config.solarRooftop.subsidy3KwPlus);
  const [unitsPerKw, setUnitsPerKw] = useState(config.solarRooftop.dailyUnitsGeneratedPerKw);
  const [successMsg, setSuccessMsg] = useState(false);

  React.useEffect(() => {
    if (config.solarRooftop) {
      setCostPerKw(config.solarRooftop.benchmarkCostPerKw);
      setSub1Kw(config.solarRooftop.subsidy1Kw);
      setSub2Kw(config.solarRooftop.subsidy2Kw);
      setSub3Kw(config.solarRooftop.subsidy3KwPlus);
      setUnitsPerKw(config.solarRooftop.dailyUnitsGeneratedPerKw);
    }
  }, [config.solarRooftop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      benchmarkCostPerKw: Number(costPerKw),
      subsidy1Kw: Number(sub1Kw),
      subsidy2Kw: Number(sub2Kw),
      subsidy3KwPlus: Number(sub3Kw),
      dailyUnitsGeneratedPerKw: Number(unitsPerKw),
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">PM Surya Ghar: Muft Bijli Yojana Subsidies</h2>
              <p className="text-[11px] text-slate-500">
                Ministry of New &amp; Renewable Energy (MNRE) central direct financial assistance (DBT) structure.
              </p>
            </div>
          </div>
          {successMsg && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fade-in flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Saved Solar Subsidies!</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Benchmark Cost (₹/kW) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={costPerKw}
                onChange={(e) => setCostPerKw(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Installed cost benchmark</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1 kW System Subsidy *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={sub1Kw}
                onChange={(e) => setSub1Kw(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">MNRE Standard DBT</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2 kW System Subsidy *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={sub2Kw}
                onChange={(e) => setSub2Kw(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">MNRE Standard DBT</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              3 kW &amp; Above Max Subsidy *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={sub3Kw}
                onChange={(e) => setSub3Kw(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">Maximum scheme cap</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Daily Units per kW Installed
            </label>
            <input
              type="number"
              step="0.1"
              value={unitsPerKw}
              onChange={(e) => setUnitsPerKw(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Average ~4.0 - 4.5 kWh/day</span>
          </div>
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
              <span>Saving Subsidies...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Save Solar Scheme Rules</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
