import React, { useState } from 'react';
import { Fuel, Check, Zap } from 'lucide-react';
import { SiteFinancialConfig } from '@/lib/siteConfig';
import { syncConfigToGithub } from '@/lib/githubSiteConfigSync';
import { getStoredGitHubConfig } from '@/lib/githubClient';
import { GitHubSyncBanner } from './GitHubSyncBanner';

interface FuelEnergyTabProps {
  config: SiteFinancialConfig;
  onSave: (newFuelConfig: SiteFinancialConfig['fuelAndEv']) => Promise<void>;
  isSaving: boolean;
}

export const FuelEnergyTab: React.FC<FuelEnergyTabProps> = ({ config, onSave, isSaving }) => {
  const [petrol, setPetrol] = useState(config.fuelAndEv.petrolPricePerLitre);
  const [diesel, setDiesel] = useState(config.fuelAndEv.dieselPricePerLitre);
  const [cng, setCng] = useState(config.fuelAndEv.cngPricePerKg);
  const [evHome, setEvHome] = useState(config.fuelAndEv.evHomeKwhRate);
  const [evCommercial, setEvCommercial] = useState(config.fuelAndEv.evCommercialKwhRate);
  const [petrolMileage, setPetrolMileage] = useState(config.fuelAndEv.petrolAvgMileageKmpl);
  const [dieselMileage, setDieselMileage] = useState(config.fuelAndEv.dieselAvgMileageKmpl);
  const [evEfficiency, setEvEfficiency] = useState(config.fuelAndEv.evAvgEfficiencyKmPerKwh);
  const [successMsg, setSuccessMsg] = useState(false);

  const [ghStatus, setGhStatus] = useState<{
    state: 'idle' | 'saving' | 'success' | 'error' | 'fallback';
    message?: string;
    commitSha?: string;
    commitUrl?: string;
  }>({ state: 'idle' });

  React.useEffect(() => {
    if (config.fuelAndEv) {
      setPetrol(config.fuelAndEv.petrolPricePerLitre);
      setDiesel(config.fuelAndEv.dieselPricePerLitre);
      setCng(config.fuelAndEv.cngPricePerKg);
      setEvHome(config.fuelAndEv.evHomeKwhRate);
      setEvCommercial(config.fuelAndEv.evCommercialKwhRate);
      setPetrolMileage(config.fuelAndEv.petrolAvgMileageKmpl);
      setDieselMileage(config.fuelAndEv.dieselAvgMileageKmpl);
      setEvEfficiency(config.fuelAndEv.evAvgEfficiencyKmPerKwh);
    }
  }, [config.fuelAndEv]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newFuelData = {
      petrolPricePerLitre: Number(petrol),
      dieselPricePerLitre: Number(diesel),
      cngPricePerKg: Number(cng),
      evHomeKwhRate: Number(evHome),
      evCommercialKwhRate: Number(evCommercial),
      petrolAvgMileageKmpl: Number(petrolMileage),
      dieselAvgMileageKmpl: Number(dieselMileage),
      evAvgEfficiencyKmPerKwh: Number(evEfficiency),
    };

    // 1. Save locally to preview / localStorage
    await onSave(newFuelData);
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
      message: 'Committing fuel rates and EV tariffs directly to GitHub (data/site-config.json)...',
    });

    try {
      const commitRes = await syncConfigToGithub({
        updates: { fuelAndEv: newFuelData },
        commitMessage: `chore(rates): update fuel & EV benchmarks [admin] (${new Date().toLocaleDateString('en-IN')})`,
      });

      if (commitRes.success) {
        setGhStatus({
          state: 'success',
          message: 'Fuel rates committed to GitHub! Cloudflare deployment started (~60s).',
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
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 flex items-center justify-center">
              <Fuel className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Fuel &amp; EV Tariff Benchmarks</h2>
              <p className="text-[11px] text-slate-500">
                City fuel averages and state DISCOM electricity tariffs for daily commute and EV cost comparisons.
              </p>
            </div>
          </div>
          {successMsg && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 animate-fade-in flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Saved Energy Rates!</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Petrol Price (₹ / Litre) *
            </label>
            <input
              type="number"
              step="0.01"
              value={petrol}
              onChange={(e) => setPetrol(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Diesel Price (₹ / Litre) *
            </label>
            <input
              type="number"
              step="0.01"
              value={diesel}
              onChange={(e) => setDiesel(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              CNG Price (₹ / kg) *
            </label>
            <input
              type="number"
              step="0.01"
              value={cng}
              onChange={(e) => setCng(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
              required
            />
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-900">Electric Vehicle (EV) Tariffs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Home Charging Tariff (₹ / kWh) *
              </label>
              <input
                type="number"
                step="0.1"
                value={evHome}
                onChange={(e) => setEvHome(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Domestic DISCOM slab benchmark (₹6-₹9)</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Public Commercial Fast Charging (₹ / kWh) *
              </label>
              <input
                type="number"
                step="0.1"
                value={evCommercial}
                onChange={(e) => setEvCommercial(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Highway &amp; commercial hub charging rates (₹14-₹19)</span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Petrol Avg Mileage (km/L)
            </label>
            <input
              type="number"
              step="0.1"
              value={petrolMileage}
              onChange={(e) => setPetrolMileage(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Diesel Avg Mileage (km/L)
            </label>
            <input
              type="number"
              step="0.1"
              value={dieselMileage}
              onChange={(e) => setDieselMileage(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              EV Efficiency (km/kWh)
            </label>
            <input
              type="number"
              step="0.1"
              value={evEfficiency}
              onChange={(e) => setEvEfficiency(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
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
              <span>Saving Energy Rates...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Save Fuel &amp; EV Rates</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
