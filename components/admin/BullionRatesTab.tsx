import React, { useState, useEffect } from 'react';
import {
  Coins,
  Check,
  RotateCcw,
  MapPin,
  Plus,
  Trash2,
  Search,
  Github,
  GitBranch,
  GitCommit,
  Eye,
  EyeOff,
  ExternalLink,
  AlertTriangle,
  AlertCircle,
  Info,
  Clock,
  KeyRound,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { SiteFinancialConfig, CityBullionRateConfig } from '@/lib/siteConfig';
import { computeAllIndianCityRates, ALL_INDIAN_STATE_CITIES } from '@/lib/indianCitiesBullion';
import { formatINR } from '@/lib/formatters';
import {
  getStoredGitHubConfig,
  saveStoredGitHubConfig,
  saveRatesToGitHub,
  testGitHubConnection,
  GitHubSyncConfig,
  DEFAULT_GITHUB_OWNER,
  DEFAULT_GITHUB_REPO,
  DEFAULT_GITHUB_BRANCH,
} from '@/lib/githubBullionSync';

interface BullionRatesTabProps {
  config: SiteFinancialConfig;
  onSave: (newBullionConfig: SiteFinancialConfig['bullion']) => Promise<void>;
  isSaving: boolean;
}

export const BullionRatesTab: React.FC<BullionRatesTabProps> = ({ config, onSave, isSaving }) => {
  const [gold24K, setGold24K] = useState(config.bullion.gold24KPer10g);
  const [gold22K, setGold22K] = useState(config.bullion.gold22KPer10g);
  const [gold18K, setGold18K] = useState(config.bullion.gold18KPer10g);
  const [silver999, setSilver999] = useState(config.bullion.silver999PerKg);
  const [silver925, setSilver925] = useState(config.bullion.silver925Per10g);
  const [makingPct, setMakingPct] = useState(config.bullion.makingChargeDefaultPercent);
  const [makingPerGram, setMakingPerGram] = useState(config.bullion.makingChargeDefaultPerGram);
  const [goldHallmarking, setGoldHallmarking] = useState(config.bullion.goldHallmarkingFee);
  const [silverHallmarking, setSilverHallmarking] = useState(config.bullion.silverHallmarkingFee);
  const [gstPct, setGstPct] = useState(config.bullion.gstPercentage);
  const [cities, setCities] = useState<CityBullionRateConfig[]>(
    config.bullion.cities && config.bullion.cities.length > 0
      ? config.bullion.cities
      : computeAllIndianCityRates(config.bullion.gold24KPer10g, config.bullion.silver999PerKg)
  );
  const [citySearch, setCitySearch] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  // GitHub Persistent Data Store Configuration State
  const [gitHubConfig, setGitHubConfig] = useState<GitHubSyncConfig>(getStoredGitHubConfig());
  const [isGitHubDrawerOpen, setIsGitHubDrawerOpen] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [isTestingGitHub, setIsTestingGitHub] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // GitHub Save State
  const [gitHubSyncStatus, setGitHubSyncStatus] = useState<{
    state: 'idle' | 'saving' | 'success' | 'error' | 'fallback';
    message?: string;
    commitSha?: string;
    commitUrl?: string;
    lastUpdatedIso?: string;
  }>({ state: 'idle' });

  // Synchronize form states whenever config updates from server/storage
  useEffect(() => {
    if (config.bullion) {
      setGold24K(config.bullion.gold24KPer10g);
      setGold22K(config.bullion.gold22KPer10g);
      setGold18K(config.bullion.gold18KPer10g);
      setSilver999(config.bullion.silver999PerKg);
      setSilver925(config.bullion.silver925Per10g);
      setMakingPct(config.bullion.makingChargeDefaultPercent);
      setMakingPerGram(config.bullion.makingChargeDefaultPerGram);
      setGoldHallmarking(config.bullion.goldHallmarkingFee);
      setSilverHallmarking(config.bullion.silverHallmarkingFee);
      setGstPct(config.bullion.gstPercentage);
      if (config.bullion.cities && config.bullion.cities.length > 0) {
        setCities(config.bullion.cities);
      }
    }
  }, [config.bullion]);

  const handle24KChange = (val: number) => {
    setGold24K(val);
    setGold22K(Math.round((val / 24) * 22));
    setGold18K(Math.round((val / 24) * 18));
    setCities(computeAllIndianCityRates(val, silver999));
  };

  const handleSilver999Change = (val: number) => {
    setSilver999(val);
    setSilver925(Math.round((val / 100) * 0.925));
    setCities(computeAllIndianCityRates(gold24K, val));
  };

  const handleSyncAllIndianCities = () => {
    const updatedCities = computeAllIndianCityRates(gold24K, silver999);
    setCities(updatedCities);
  };

  const handleCityChange = (
    index: number,
    field: keyof CityBullionRateConfig,
    value: string | number
  ) => {
    const next = [...cities];
    next[index] = { ...next[index], [field]: value };
    setCities(next);
  };

  const handleAddCity = () => {
    setCities([
      ...cities,
      {
        city: 'New City',
        state: 'State',
        gold24K: gold24K,
        gold22K: gold22K,
        silver1Kg: silver999,
      },
    ]);
  };

  const handleRemoveCity = (index: number) => {
    setCities(cities.filter((_, i) => i !== index));
  };

  const handleGitHubConfigChange = (key: keyof GitHubSyncConfig, value: string) => {
    const updated = { ...gitHubConfig, [key]: value };
    setGitHubConfig(updated);
    saveStoredGitHubConfig(updated);
    if (testResult) setTestResult(null);
  };

  const handleClearGitHubToken = () => {
    const updated = { ...gitHubConfig, token: '' };
    setGitHubConfig(updated);
    saveStoredGitHubConfig({ token: '' });
    setTestResult(null);
  };

  const handleTestGitHubConnection = async () => {
    setIsTestingGitHub(true);
    setTestResult(null);
    try {
      const res = await testGitHubConnection(gitHubConfig);
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Connection test failed. Check network.',
      });
    } finally {
      setIsTestingGitHub(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newBullionConfig = {
      gold24KPer10g: Number(gold24K),
      gold22KPer10g: Number(gold22K),
      gold18KPer10g: Number(gold18K),
      silver999PerKg: Number(silver999),
      silver925Per10g: Number(silver925),
      makingChargeDefaultPercent: Number(makingPct),
      makingChargeDefaultPerGram: Number(makingPerGram),
      goldHallmarkingFee: Number(goldHallmarking),
      silverHallmarkingFee: Number(silverHallmarking),
      gstPercentage: Number(gstPct),
      cities,
    };

    // 1. Perform local save (LocalStorage + Express server data/site-config.json)
    await onSave(newBullionConfig);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3500);

    // 2. Perform GitHub API save (Persistent data store for Cloudflare Pages)
    saveStoredGitHubConfig(gitHubConfig);

    if (gitHubConfig.token && gitHubConfig.token.trim()) {
      setGitHubSyncStatus({
        state: 'saving',
        message: 'Committing updated bullion rates directly to GitHub (data/site-config.json)...',
      });

      try {
        const ghResult = await saveRatesToGitHub(newBullionConfig, gitHubConfig);
        if (ghResult.success) {
          setGitHubSyncStatus({
            state: 'success',
            message: ghResult.message,
            commitSha: ghResult.commitSha,
            commitUrl: ghResult.commitUrl,
            lastUpdatedIso: new Date().toISOString(),
          });
        } else {
          setGitHubSyncStatus({
            state: 'error',
            message: ghResult.message || ghResult.error || 'Failed to commit rates to GitHub.',
          });
        }
      } catch (err: any) {
        setGitHubSyncStatus({
          state: 'error',
          message: `GitHub sync error: ${err.message || 'Network request failed.'}`,
        });
      }
    } else {
      // Fallback: No GitHub token configured
      setGitHubSyncStatus({
        state: 'fallback',
        message:
          'Rates saved to local preview. To persist rates permanently across Cloudflare Pages deployments without Supabase, configure your GitHub Personal Access Token in the settings drawer above.',
      });
    }
  };

  const isTokenConfigured = Boolean(gitHubConfig.token && gitHubConfig.token.trim().length > 8);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* GitHub Persistent Storage Drawer Card */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md overflow-hidden transition-all">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-white flex items-center justify-center shrink-0">
              <Github className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-black text-white font-display">
                  GitHub Persistent Data Store
                </h3>
                {isTokenConfigured ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <Check className="w-3 h-3 text-emerald-400" />
                    Auto-Deploy Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Info className="w-3 h-3 text-amber-400" />
                    Local Preview Only (Token Not Set)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Commit bullion rates directly to <code className="text-slate-200 font-mono text-[11px] bg-slate-800 px-1 py-0.5 rounded">data/site-config.json</code> in your repository. Cloudflare Pages auto-deploys within ~60s without Supabase or Cloudflare KV.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setIsGitHubDrawerOpen(!isGitHubDrawerOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-700"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isGitHubDrawerOpen ? 'Close Settings' : 'Configure GitHub Token'}</span>
              {isGitHubDrawerOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Settings Drawer */}
        {isGitHubDrawerOpen && (
          <div className="border-t border-slate-800 bg-slate-950/70 p-5 space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* GitHub Personal Access Token */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                    GitHub Personal Access Token (PAT)
                  </label>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo&description=BharatCalc+Bullion+Rate+Updater"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium inline-flex items-center gap-1"
                  >
                    <span>Generate token on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={gitHubConfig.token}
                    onChange={(e) => handleGitHubConfigChange('token', e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full pl-3.5 pr-20 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder:text-slate-500"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {gitHubConfig.token && (
                      <button
                        type="button"
                        onClick={handleClearGitHubToken}
                        className="text-[10px] text-slate-400 hover:text-red-400 px-1.5 py-0.5 rounded"
                        title="Clear token"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="p-1 text-slate-400 hover:text-slate-200"
                      aria-label="Toggle token visibility"
                    >
                      {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Required permission: <span className="text-slate-300 font-semibold">repo</span> (classic token) or <span className="text-slate-300 font-semibold">Contents: Read and write</span> (fine-grained token). Stored safely in your browser&apos;s localStorage only.
                </p>
              </div>

              {/* Repository Owner */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Repository Owner / Username
                </label>
                <input
                  type="text"
                  value={gitHubConfig.owner}
                  onChange={(e) => handleGitHubConfigChange('owner', e.target.value)}
                  placeholder={DEFAULT_GITHUB_OWNER}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Default: {DEFAULT_GITHUB_OWNER}</span>
              </div>

              {/* Repository Name */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5">
                  Repository Name
                </label>
                <input
                  type="text"
                  value={gitHubConfig.repo}
                  onChange={(e) => handleGitHubConfigChange('repo', e.target.value)}
                  placeholder={DEFAULT_GITHUB_REPO}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Default: {DEFAULT_GITHUB_REPO}</span>
              </div>

              {/* Target Branch */}
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                  Target Branch
                </label>
                <input
                  type="text"
                  value={gitHubConfig.branch}
                  onChange={(e) => handleGitHubConfigChange('branch', e.target.value)}
                  placeholder={DEFAULT_GITHUB_BRANCH}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Branch that Cloudflare Pages builds from (default: main)</span>
              </div>

              {/* Test Connection Button */}
              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={handleTestGitHubConnection}
                  disabled={isTestingGitHub || !gitHubConfig.token}
                  className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isTestingGitHub ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing GitHub Connection...</span>
                    </>
                  ) : (
                    <>
                      <GitCommit className="w-3.5 h-3.5" />
                      <span>Test GitHub Connection</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Test Connection Feedback */}
            {testResult && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 animate-fade-in ${
                  testResult.success
                    ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300'
                    : 'bg-red-950/40 border-red-700/50 text-red-300'
                }`}
              >
                {testResult.success ? (
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{testResult.success ? 'Connection Successful!' : 'Connection Error'}</div>
                  <div className="text-[11px] mt-0.5 opacity-90">{testResult.message}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* GitHub Sync Status Alerts */}
      {gitHubSyncStatus.state === 'saving' && (
        <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-center gap-3 animate-fade-in shadow-2xs">
          <RefreshCw className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
          <div className="flex-1">
            <span className="font-bold">Syncing to GitHub:</span> {gitHubSyncStatus.message}
          </div>
        </div>
      )}

      {gitHubSyncStatus.state === 'success' && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-3 animate-fade-in shadow-2xs">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700 mt-0.5">
            <Check className="w-4 h-4" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="font-bold text-emerald-950 text-sm flex items-center gap-2">
              <span>{gitHubSyncStatus.message}</span>
              {gitHubSyncStatus.commitSha && (
                <span className="font-mono text-[11px] bg-emerald-100/80 px-2 py-0.5 rounded text-emerald-800 border border-emerald-200 font-semibold">
                  Commit: {gitHubSyncStatus.commitSha}
                </span>
              )}
            </div>
            <p className="text-[11px] text-emerald-800">
              The updated bullion rates have been committed to <code className="font-mono font-semibold">data/site-config.json</code> on GitHub. Cloudflare Pages is now running an automated static deployment.
            </p>
            {gitHubSyncStatus.commitUrl && (
              <div className="pt-1">
                <a
                  href={gitHubSyncStatus.commitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-900 underline text-[11px]"
                >
                  <span>View Commit on GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {gitHubSyncStatus.state === 'error' && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-3 animate-fade-in shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <div className="font-bold text-red-950">GitHub Commit Failed</div>
            <p className="text-[11px] text-red-800">{gitHubSyncStatus.message}</p>
            <p className="text-[10px] text-red-700/80">
              Note: Local preview was updated, but the GitHub repository was not changed. Verify your GitHub Personal Access Token permissions and repository branch in the settings above.
            </p>
          </div>
        </div>
      )}

      {gitHubSyncStatus.state === 'fallback' && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 animate-fade-in shadow-2xs">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">Local Preview Saved:</span> {gitHubSyncStatus.message}
          </div>
        </div>
      )}

      {/* Overview Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">National Bullion Spot Benchmarks</h2>
              <p className="text-[11px] text-slate-500">
                These rates feed the live ticker and default invoice calculator calculations across the entire website.
              </p>
            </div>
          </div>
          {successMsg && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fade-in flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Saved Locally!</span>
            </span>
          )}
        </div>

        {/* Gold Benchmark Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Gold 24K Pure (per 10g) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={gold24K}
                onChange={(e) => handle24KChange(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              ₹{(gold24K / 10).toFixed(0)}/gram
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Gold 22K 916 Hallmark (per 10g) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={gold22K}
                onChange={(e) => setGold22K(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              ₹{(gold22K / 10).toFixed(0)}/gram
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Gold 18K 750 (per 10g) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={gold18K}
                onChange={(e) => setGold18K(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              ₹{(gold18K / 10).toFixed(0)}/gram
            </span>
          </div>
        </div>

        {/* Silver Benchmark Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Silver 999 Pure (per 1 kg) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={silver999}
                onChange={(e) => handleSilver999Change(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              ₹{(silver999 / 1000).toFixed(1)}/gram
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Silver 925 Sterling (per 10g) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={silver925}
                onChange={(e) => setSilver925(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              ₹{(silver925 / 10).toFixed(1)}/gram
            </span>
          </div>
        </div>

        {/* Statutory & Default Fees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Making Charge (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={makingPct}
              onChange={(e) => setMakingPct(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Making Charge (₹/g)
            </label>
            <input
              type="number"
              value={makingPerGram}
              onChange={(e) => setMakingPerGram(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Gold Hallmark (₹/pc)
            </label>
            <input
              type="number"
              step="0.1"
              value={goldHallmarking}
              onChange={(e) => setGoldHallmarking(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Silver Hallmark (₹/pc)
            </label>
            <input
              type="number"
              step="0.1"
              value={silverHallmarking}
              onChange={(e) => setSilverHallmarking(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Jewelry GST (%)
            </label>
            <input
              type="number"
              step="0.5"
              value={gstPct}
              onChange={(e) => setGstPct(Number(e.target.value))}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold"
            />
          </div>
        </div>
      </div>

      {/* City Overrides Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Indian State &amp; City Spot Rates ({cities.length} Cities)
              </h3>
            </div>
            <p className="text-[11px] text-slate-500">
              Auto-calibrated from national base price. You can customize individual city rates or re-sync all at once.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncAllIndianCities}
              className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Auto-Recalibrate All Cities</span>
            </button>
            <button
              type="button"
              onClick={handleAddCity}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom City</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            placeholder="Search city or state (e.g., Mumbai, Delhi, Jaipur, Chennai)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* City Rows */}
        <div className="max-h-96 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
          {cities
            .filter(
              (c) =>
                c.city.toLowerCase().includes(citySearch.toLowerCase()) ||
                c.state.toLowerCase().includes(citySearch.toLowerCase())
            )
            .map((c, idx) => (
              <div
                key={idx}
                className="pt-2 grid grid-cols-1 sm:grid-cols-6 gap-2 items-center text-xs"
              >
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={c.city}
                    onChange={(e) => handleCityChange(idx, 'city', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold text-xs"
                    placeholder="City Name"
                  />
                  <span className="text-[10px] text-slate-400 pl-1">{c.state}</span>
                </div>
                <div>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                      24K: ₹
                    </span>
                    <input
                      type="number"
                      value={c.gold24K}
                      onChange={(e) => handleCityChange(idx, 'gold24K', Number(e.target.value))}
                      className="w-full pl-11 pr-2 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-xs font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                      22K: ₹
                    </span>
                    <input
                      type="number"
                      value={c.gold22K}
                      onChange={(e) => handleCityChange(idx, 'gold22K', Number(e.target.value))}
                      className="w-full pl-11 pr-2 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-xs font-semibold"
                    />
                  </div>
                </div>
                <div>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                      Ag 1Kg: ₹
                    </span>
                    <input
                      type="number"
                      value={c.silver1Kg}
                      onChange={(e) => handleCityChange(idx, 'silver1Kg', Number(e.target.value))}
                      className="w-full pl-14 pr-2 py-1.5 rounded-lg border border-slate-300 bg-white font-mono text-xs font-semibold"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveCity(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-md"
                    title="Remove City"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Save Button & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>
            {isTokenConfigured
              ? 'GitHub Auto-Deploy enabled: Saving will commit to repo and trigger Cloudflare Pages rebuild (~60s).'
              : 'Local preview mode: Configure GitHub Token in the drawer above to enable permanent Cloudflare Pages auto-deploys.'}
          </span>
        </div>

        <button
          type="submit"
          disabled={isSaving || gitHubSyncStatus.state === 'saving'}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving || gitHubSyncStatus.state === 'saving' ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>
                {gitHubSyncStatus.state === 'saving'
                  ? 'Committing to GitHub...'
                  : 'Broadcasting Rates...'}
              </span>
            </>
          ) : (
            <>
              {isTokenConfigured ? (
                <Github className="w-4 h-4 text-emerald-400" />
              ) : (
                <Check className="w-4 h-4 text-emerald-400" />
              )}
              <span>
                {isTokenConfigured
                  ? 'Save & Commit to GitHub (Auto-Deploy)'
                  : 'Save Bullion Rates (Local Preview)'}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
