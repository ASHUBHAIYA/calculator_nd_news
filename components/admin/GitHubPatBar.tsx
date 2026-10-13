import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  Github,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ExternalLink,
  Save,
  Check,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react';
import {
  getStoredGitHubConfig,
  saveStoredGitHubConfig,
  testGitHubConnection,
  DEFAULT_GITHUB_OWNER,
  DEFAULT_GITHUB_REPO,
  DEFAULT_GITHUB_BRANCH,
  GitHubSyncConfig,
} from '@/lib/githubClient';

export const GitHubPatBar: React.FC = () => {
  const [config, setConfig] = useState<GitHubSyncConfig>(getStoredGitHubConfig());
  const [isOpen, setIsOpen] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const handleConfigChange = () => {
      setConfig(getStoredGitHubConfig());
    };
    window.addEventListener('bharatcalc_github_config_changed', handleConfigChange);
    return () => {
      window.removeEventListener('bharatcalc_github_config_changed', handleConfigChange);
    };
  }, []);

  const hasToken = Boolean(config.token && config.token.trim().length > 0);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    saveStoredGitHubConfig(config);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testGitHubConnection(config);
      setTestResult(res);
      if (res.success) {
        saveStoredGitHubConfig(config);
      }
    } finally {
      setIsTesting(false);
    }
  };

  const handleClear = () => {
    saveStoredGitHubConfig({ token: '' });
    setConfig((prev) => ({ ...prev, token: '' }));
    setTestResult(null);
  };

  return (
    <div className="border-b border-slate-800 bg-slate-900/90 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status summary */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
              <Github className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-bold text-slate-200">GitHub Persistent Database:</span>
              {hasToken ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Token Active ({config.owner}/{config.repo}@{config.branch})</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span>Not Configured (Changes stay in local preview only)</span>
                </span>
              )}
            </div>
          </div>

          {/* Action toggle */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isOpen ? 'Hide Settings' : hasToken ? 'Edit GitHub PAT' : 'Configure GitHub PAT'}</span>
              {isOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Settings Form */}
        {isOpen && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 animate-fade-in text-xs">
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* PAT Input */}
                <div className="sm:col-span-6">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                      <KeyRound className="w-3 h-3 text-emerald-400" />
                      GitHub Access Token (PAT)
                    </label>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=BharatCalc+Admin+Sync"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-0.5"
                    >
                      <span>Get token</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showToken ? 'text' : 'password'}
                      value={config.token}
                      onChange={(e) => setConfig({ ...config, token: e.target.value })}
                      placeholder="ghp_... or github_pat_..."
                      className="w-full pl-3 pr-16 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-600"
                    />
                    <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowToken(!showToken)}
                        className="p-1 text-slate-400 hover:text-slate-200"
                        title={showToken ? 'Hide token' : 'Show token'}
                      >
                        {showToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                      {config.token && (
                        <button
                          type="button"
                          onClick={handleClear}
                          className="text-[10px] text-red-400 hover:text-red-300 px-1 py-0.5"
                          title="Clear token"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Owner */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Owner / Org
                  </label>
                  <input
                    type="text"
                    value={config.owner}
                    onChange={(e) => setConfig({ ...config, owner: e.target.value })}
                    placeholder={DEFAULT_GITHUB_OWNER}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Repo */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Repository
                  </label>
                  <input
                    type="text"
                    value={config.repo}
                    onChange={(e) => setConfig({ ...config, repo: e.target.value })}
                    placeholder={DEFAULT_GITHUB_REPO}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Branch */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    Branch
                  </label>
                  <input
                    type="text"
                    value={config.branch}
                    onChange={(e) => setConfig({ ...config, branch: e.target.value })}
                    placeholder={DEFAULT_GITHUB_BRANCH}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-slate-100 font-mono text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Action buttons & result notification */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                <p className="text-[11px] text-slate-400">
                  Shared across all Admin tabs: Bullion, Fuel, Loans, Tax, Solar, Ticker &amp; Explainers.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTest}
                    disabled={isTesting || !config.token.trim()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all cursor-pointer border border-slate-700 disabled:opacity-40"
                  >
                    {isTesting ? (
                      <RefreshCw className="w-3 h-3 text-emerald-400 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    )}
                    <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-sm cursor-pointer"
                  >
                    {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    <span>{isSaved ? 'Saved to Browser!' : 'Save PAT'}</span>
                  </button>
                </div>
              </div>

              {/* Test status banner */}
              {testResult && (
                <div
                  className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                    testResult.success
                      ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
                      : 'bg-red-950/60 border-red-700 text-red-200'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <span className="flex-1">{testResult.message}</span>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
