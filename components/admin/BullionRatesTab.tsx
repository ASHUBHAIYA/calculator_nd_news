import React, { useState } from 'react';
import { Coins, Check, RotateCcw, MapPin, Plus, Trash2, Search } from 'lucide-react';
import { SiteFinancialConfig, CityBullionRateConfig } from '@/lib/siteConfig';
import { computeAllIndianCityRates, ALL_INDIAN_STATE_CITIES } from '@/lib/indianCitiesBullion';
import { formatINR } from '@/lib/formatters';

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

  // Synchronize form states whenever config updates from server/storage
  React.useEffect(() => {
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
    // Auto sync all Indian cities automatically!
    setCities(computeAllIndianCityRates(val, silver999));
  };

  const handleSilver999Change = (val: number) => {
    setSilver999(val);
    setSilver925(Math.round((val / 100) * 0.925));
    // Auto sync all Indian cities automatically!
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
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
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              <span>Saved Successfully!</span>
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
      </div>

      {/* Statutory Rules: Making Charges, BIS Hallmarking & GST */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Invoice Statutory Fees &amp; Defaults
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Default Making Charge (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={makingPct}
                onChange={(e) => setMakingPct(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                %
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Default Making Charge (₹/gram)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                value={makingPerGram}
                onChange={(e) => setMakingPerGram(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Statutory GST Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={gstPct}
                onChange={(e) => setGstPct(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                %
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              1.5% CGST + 1.5% SGST on Bullion + Making
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              BIS Gold Hallmarking Fee (₹/piece)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                value={goldHallmarking}
                onChange={(e) => setGoldHallmarking(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">₹45 + 18% GST = ₹53.10</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              BIS Silver Hallmarking Fee (₹/piece)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                value={silverHallmarking}
                onChange={(e) => setSilverHallmarking(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">₹35 + 18% GST = ₹41.30</span>
          </div>
        </div>
      </div>

      {/* City Overrides & Auto-Sync All India */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>All-India City Bullion Rates ({cities.length} Cities across 28 States &amp; 8 UTs)</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              ✨ <strong>Auto-Calculated:</strong> Setting your single base 24K and Silver 999 price automatically updates all cities across India with standard state spreads.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncAllIndianCities}
              className="text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Recalculate All Indian Cities</span>
            </button>
            <button
              type="button"
              onClick={handleAddCity}
              className="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Custom City</span>
            </button>
          </div>
        </div>

        {/* City Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            placeholder="Search any city or state across India (e.g. Pune, Jaipur, Lucknow, Kochi, Patna, Guwahati)..."
            className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50/70 focus:bg-white focus:ring-2 focus:ring-slate-900"
          />
        </div>

        {/* Cities List */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {cities
            .filter(
              (c) =>
                !citySearch ||
                c.city.toLowerCase().includes(citySearch.toLowerCase()) ||
                c.state.toLowerCase().includes(citySearch.toLowerCase())
            )
            .map((c, idx) => (
              <div
                key={`${c.city}-${idx}`}
                className="grid grid-cols-1 sm:grid-cols-5 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 items-center text-xs"
              >
                <div>
                  <input
                    type="text"
                    value={c.city}
                    onChange={(e) => handleCityChange(idx, 'city', e.target.value)}
                    placeholder="City Name"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-bold bg-white text-xs"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={c.state}
                    onChange={(e) => handleCityChange(idx, 'state', e.target.value)}
                    placeholder="State"
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-600"
                  />
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

      {/* Submit Button */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Broadcasting Rates...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Save &amp; Broadcast Bullion Rates</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
