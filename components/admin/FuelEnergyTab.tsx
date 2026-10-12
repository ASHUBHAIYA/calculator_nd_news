import React, { useState } from 'react';
import { Fuel, Check, Zap } from 'lucide-react';
import { SiteFinancialConfig } from '@/lib/siteConfig';

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
    await onSave({
      petrolPricePerLitre: Number(petrol),
      dieselPricePerLitre: Number(diesel),
      cngPricePerKg: Number(cng),
      evHomeKwhRate: Number(evHome),
      evCommercialKwhRate: Number(evCommercial),
      petrolAvgMileageKmpl: Number(petrolMileage),
      dieselAvgMileageKmpl: Number(dieselMileage),
      evAvgEfficiencyKmPerKwh: Number(evEfficiency),
    });
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
              <span>Saved Fuel Tariffs!</span>
            </span>
          )}
        </div>

        {/* Rates */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Petrol (₹/Litre) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                value={petrol}
                onChange={(e) => setPetrol(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Diesel (₹/Litre) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                value={diesel}
                onChange={(e) => setDiesel(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              CNG (₹/Kg) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                value={cng}
                onChange={(e) => setCng(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              EV Home (₹/kWh) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                value={evHome}
                onChange={(e) => setEvHome(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              EV Fast Charge (₹/kWh)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                ₹
              </span>
              <input
                type="number"
                step="0.01"
                value={evCommercial}
                onChange={(e) => setEvCommercial(Number(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs font-bold focus:ring-2 focus:ring-slate-900"
                required
              />
            </div>
          </div>
        </div>

        {/* Default Mileage Benchmarks */}
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pt-2">
          Vehicle Fuel Economy Defaults
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Petrol Car Mileage (km/L)
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
              Diesel Car Mileage (km/L)
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
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isSaving ? (
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
