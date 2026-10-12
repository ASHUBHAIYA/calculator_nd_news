import React, { useState } from 'react';
import { Home, Check } from 'lucide-react';
import { SiteFinancialConfig } from '@/lib/siteConfig';

interface LoanMortgageTabProps {
  config: SiteFinancialConfig;
  onSave: (newLoanConfig: SiteFinancialConfig['homeLoan']) => Promise<void>;
  isSaving: boolean;
}

export const LoanMortgageTab: React.FC<LoanMortgageTabProps> = ({ config, onSave, isSaving }) => {
  const [minRate, setMinRate] = useState(config.homeLoan.primeRateMin);
  const [maxRate, setMaxRate] = useState(config.homeLoan.primeRateMax);
  const [defaultRate, setDefaultRate] = useState(config.homeLoan.defaultInterestRate);
  const [defaultTenure, setDefaultTenure] = useState(config.homeLoan.defaultTenureYears);
  const [successMsg, setSuccessMsg] = useState(false);

  React.useEffect(() => {
    if (config.homeLoan) {
      setMinRate(config.homeLoan.primeRateMin);
      setMaxRate(config.homeLoan.primeRateMax);
      setDefaultRate(config.homeLoan.defaultInterestRate);
      setDefaultTenure(config.homeLoan.defaultTenureYears);
    }
  }, [config.homeLoan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      primeRateMin: Number(minRate),
      primeRateMax: Number(maxRate),
      defaultInterestRate: Number(defaultRate),
      defaultTenureYears: Number(defaultTenure),
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
              <Home className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Home Loan &amp; Mortgage Benchmarks</h2>
              <p className="text-[11px] text-slate-500">
                RBI Repo Rate linked lending rates (EBLR/RLLR) and default calculator parameters.
              </p>
            </div>
          </div>
          {successMsg && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fade-in flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Saved Mortgage Rates!</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Prime Rate Range Min (%) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                value={minRate}
                onChange={(e) => setMinRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                %
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Prime Rate Range Max (%) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                value={maxRate}
                onChange={(e) => setMaxRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                %
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Calculator Default Rate (%) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                value={defaultRate}
                onChange={(e) => setDefaultRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                % p.a.
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Default Loan Tenure (Years) *
            </label>
            <input
              type="number"
              value={defaultTenure}
              onChange={(e) => setDefaultTenure(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
              required
            />
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
              <span>Saving Loan Rates...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Save Loan &amp; Mortgage Rules</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
