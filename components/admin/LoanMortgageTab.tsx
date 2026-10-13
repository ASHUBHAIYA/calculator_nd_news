import React, { useState } from 'react';
import { Home, Check } from 'lucide-react';
import { SiteFinancialConfig } from '@/lib/siteConfig';
import { syncConfigToGithub } from '@/lib/githubSiteConfigSync';
import { getStoredGitHubConfig } from '@/lib/githubClient';
import { GitHubSyncBanner } from './GitHubSyncBanner';

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

  const [ghStatus, setGhStatus] = useState<{
    state: 'idle' | 'saving' | 'success' | 'error' | 'fallback';
    message?: string;
    commitSha?: string;
    commitUrl?: string;
  }>({ state: 'idle' });

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

    const newLoanData = {
      primeRateMin: Number(minRate),
      primeRateMax: Number(maxRate),
      defaultInterestRate: Number(defaultRate),
      defaultTenureYears: Number(defaultTenure),
    };

    // 1. Save locally to preview / localStorage
    await onSave(newLoanData);
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
      message: 'Committing home loan benchmarks directly to GitHub (data/site-config.json)...',
    });

    try {
      const commitRes = await syncConfigToGithub({
        updates: { homeLoan: newLoanData },
        commitMessage: `chore(rates): update loan benchmarks [admin] (${new Date().toLocaleDateString('en-IN')})`,
      });

      if (commitRes.success) {
        setGhStatus({
          state: 'success',
          message: 'Loan benchmarks committed to GitHub! Cloudflare deployment started (~60s).',
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Prime Rate Min (% p.a.) *
            </label>
            <input
              type="number"
              step="0.05"
              value={minRate}
              onChange={(e) => setMinRate(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
              required
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Best-tier borrower rate (e.g. 8.25%)</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Prime Rate Max (% p.a.) *
            </label>
            <input
              type="number"
              step="0.05"
              value={maxRate}
              onChange={(e) => setMaxRate(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
              required
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Standard PSU / Private bank ceiling (e.g. 9.75%)</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Default Prepayment Model Rate (% p.a.) *
            </label>
            <input
              type="number"
              step="0.05"
              value={defaultRate}
              onChange={(e) => setDefaultRate(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
              required
            />
            <span className="text-[10px] text-slate-400 mt-1 block">Pre-filled interest rate on Home Loan calculator</span>
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
