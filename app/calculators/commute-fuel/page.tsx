import React, { useState, useId } from 'react';
import {
  Fuel,
  TrendingDown,
  Leaf,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';
import {
  calculateFuelSpend,
  FuelType,
  DEFAULT_FUEL_PRICES,
  FuelSpendBreakdown,
} from '@/lib/calculators/fuel';
import { formatINR, formatNumberIN } from '@/lib/formatters';
import { AdBanner } from '@/components/AdBanner';
import { SeoHead } from '@/components/SeoHead';

export const CommuteFuelPage: React.FC = () => {
  const distId = useId();
  const fuelTypeId = useId();
  const priceId = useId();
  const mileageId = useId();
  const daysId = useId();

  // State
  const [dailyDistance, setDailyDistance] = useState<number>(35); // km round trip
  const [fuelType, setFuelType] = useState<FuelType>('petrol');
  const [price, setPrice] = useState<number>(DEFAULT_FUEL_PRICES.petrol.defaultPrice);
  const [mileage, setMileage] = useState<number>(DEFAULT_FUEL_PRICES.petrol.defaultMileage);
  const [workingDays, setWorkingDays] = useState<number>(26);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleFuelTypeChange = (newType: FuelType) => {
    setFuelType(newType);
    setPrice(DEFAULT_FUEL_PRICES[newType].defaultPrice);
    setMileage(DEFAULT_FUEL_PRICES[newType].defaultMileage);
  };

  const spend: FuelSpendBreakdown = calculateFuelSpend({
    dailyDistanceKm: dailyDistance,
    fuelType,
    fuelPricePerUnit: price,
    mileage,
    workingDaysPerMonth: workingDays,
  });

  const FAQS = [
    {
      q: 'Why calculate commute fuel cost based on 26 working days?',
      a: 'The 26-day working month is the standard Indian industrial and corporate benchmark (excluding 4 or 5 weekly Sunday offs and alternate Saturday schedules). It reflects true out-of-pocket vehicular commute expenditures compared to arbitrary 30-day calculations.',
    },
    {
      q: 'How much money can an Electric Vehicle (EV) save compared to Petrol in India?',
      a: 'A typical petrol compact car costs approximately ₹6.00 to ₹7.50 per kilometer driven in Indian city traffic (at ₹97/L and 14–16 km/L). An equivalent 4-wheeler EV consumes roughly 1 unit (kWh) per 7 to 8 km, costing about ₹1.10 to ₹1.25 per km on domestic home charging tariffs. For a 35 km daily commute, transitioning to an EV saves approximately ₹4,500 to ₹5,500 every month.',
    },
    {
      q: 'How is the carbon footprint (CO2) calculated for commute travel?',
      a: 'Standard emission factors from the Bureau of Energy Efficiency (BEE) and IPCC indicate that burning 1 Litre of petrol emits approximately 2.31 kg of CO2, while diesel emits 2.68 kg CO2 per Litre. Compressed Natural Gas (CNG) emits approximately 2.75 kg CO2 per kg consumed.',
    },
    {
      q: 'How do AC usage and bumper-to-bumper traffic affect real-world fuel mileage?',
      a: 'In congested Indian metropolitan traffic (Bengaluru, Mumbai, Delhi-NCR, Hyderabad), continuous low-gear idling and full air conditioning decrease nominal manufacturer ARAI mileage by 25% to 35%. Using our calculator with realistic city mileage (e.g. 12–14 km/L for petrol cars instead of ARAI 20 km/L) gives an exact reflection of actual monthly bank debits.',
    },
    {
      q: 'Is CNG economically superior to petrol for high-mileage daily commutes?',
      a: 'Yes, CNG delivers exceptional operating economy for daily running exceeding 40–50 km. With CNG priced around ₹75–₹85 per kg and delivering 22–26 km/kg in city conditions, running costs drop to ~₹3.00 to ₹3.50 per km, cutting your monthly fuel bill by approximately 50% compared to petrol.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Commute Fuel Spend & EV Savings Calculator | Petrol, Diesel, CNG, EV India"
        description="Calculate daily, monthly (26 working days), and annual commute fuel expenses across Petrol, Diesel, CNG, and Electric Vehicles with CO2 emissions and EV payback."
        canonicalPath="/calculators/commute-fuel"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/' },
          { name: 'Commute Fuel Spend Calculator', path: '/calculators/commute-fuel' },
        ]}
        faqs={FAQS}
      />
      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-orange-700">
                <span>Calculators</span>
                <span>/</span>
                <span className="text-slate-500">Commute & Daily Utilities</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
                Commute Fuel Spend & EV Savings Calculator
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                Calculate your exact daily, 26-day monthly, and annual office commute fuel budget across Petrol, Diesel, CNG, and Electric Vehicles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Banner Advertisement */}
      <div className="max-w-7xl mx-auto px-4">
        <AdBanner format="leaderboard" slotId="fuel-top-leaderboard" />
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Fuel className="w-4 h-4 text-orange-600" />
                <span>Commute Inputs</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-500">
                Cost: {formatINR(spend.costPerKm, true)} / km
              </span>
            </div>

            {/* Fuel Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Select Fuel / Powertrain</label>
              <div className="grid grid-cols-4 gap-2">
                {(['petrol', 'diesel', 'cng', 'electric'] as FuelType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => handleFuelTypeChange(t)}
                    className={`py-2 px-1.5 rounded-xl border text-center transition-all ${
                      fuelType === t
                        ? 'bg-orange-50 border-orange-500 text-orange-950 font-bold shadow-xs'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="block text-xs font-bold capitalize">{t}</span>
                    <span className="block text-[9px] text-slate-400">
                      {DEFAULT_FUEL_PRICES[t].unitLabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Distance */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor={distId} className="text-xs font-bold text-slate-700">
                  Daily Round-Trip Distance (km)
                </label>
                <span className="text-xs font-mono font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">
                  {dailyDistance} km/day
                </span>
              </div>
              <input
                id={distId}
                type="number"
                min="1"
                max="500"
                value={dailyDistance || ''}
                onChange={(e) => setDailyDistance(Math.max(1, Number(e.target.value)))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500 bg-slate-50/50"
              />
              <div className="flex gap-2 pt-1">
                {[15, 25, 35, 50, 75].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDailyDistance(d)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                  >
                    {d} km
                  </button>
                ))}
              </div>
            </div>

            {/* Fuel Price & Mileage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor={priceId} className="text-xs font-bold text-slate-700 block">
                  Fuel Price (₹ / {DEFAULT_FUEL_PRICES[fuelType].unitLabel})
                </label>
                <input
                  id={priceId}
                  type="number"
                  step="0.5"
                  value={price || ''}
                  onChange={(e) => setPrice(Math.max(0.1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono text-xs bg-slate-50/50"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={mileageId} className="text-xs font-bold text-slate-700 block">
                  Mileage (km per {DEFAULT_FUEL_PRICES[fuelType].unitLabel})
                </label>
                <input
                  id={mileageId}
                  type="number"
                  step="0.5"
                  value={mileage || ''}
                  onChange={(e) => setMileage(Math.max(0.1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono text-xs bg-slate-50/50"
                />
              </div>
            </div>

            {/* Working Days */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor={daysId} className="text-xs font-bold text-slate-700">
                  Working Days per Month
                </label>
                <span className="text-xs font-mono font-bold text-slate-800">{workingDays} days</span>
              </div>
              <input
                id={daysId}
                type="range"
                min="15"
                max="30"
                step="1"
                value={workingDays}
                onChange={(e) => setWorkingDays(Number(e.target.value))}
                className="w-full accent-orange-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>20 days (5-day week)</span>
                <span>26 days (Standard)</span>
                <span>30 days (Daily)</span>
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Primary Monthly Spend Card */}
            <div className="bg-gradient-to-br from-slate-900 via-stone-900 to-orange-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                  Monthly Commute Spend ({workingDays} Days)
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
                    {formatINR(spend.monthlyCost)}
                  </span>
                  <span className="text-xs text-slate-400">/ month</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Daily Cost: <strong className="text-white">{formatINR(spend.dailyCost)}</strong> | Annual Cost: <strong className="text-orange-300">{formatINR(spend.yearlyCost)}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Monthly Fuel Volume</span>
                  <span className="text-lg font-bold font-mono text-white">
                    {spend.monthlyConsumptionUnits} {DEFAULT_FUEL_PRICES[fuelType].unitLabel}s
                  </span>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Running Cost</span>
                  <span className="text-lg font-bold font-mono text-orange-400">
                    {formatINR(spend.costPerKm, true)} / km
                  </span>
                </div>
              </div>
            </div>

            {/* EV Comparison Box */}
            {fuelType !== 'electric' && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-emerald-700" />
                  <h3 className="font-bold text-sm text-emerald-950">Electric Vehicle (EV) Savings Potential</h3>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Switching this exact commute to a standard EV would cost just ~{formatINR(spend.evCostPerKm, true)}/km:
                </p>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block">Monthly EV Savings</span>
                    <span className="text-lg font-black text-emerald-700 font-mono">
                      +{formatINR(spend.potentialMonthlyEvSavings)}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs">
                    <span className="text-[10px] text-slate-500 block">Annual EV Savings</span>
                    <span className="text-lg font-black text-emerald-700 font-mono">
                      +{formatINR(spend.potentialYearlyEvSavings)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* CO2 Emissions */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">Annual Carbon Footprint</span>
                  <span className="text-slate-500 text-[11px]">Estimated vehicle tailpipe emissions</span>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {formatNumberIN(spend.annualCO2Kg)} kg CO₂
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Advertisement */}
      <div className="max-w-4xl mx-auto px-4">
        <AdBanner format="in-feed" slotId="fuel-middle-in-feed" />
      </div>

      {/* FAQs */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-orange-600" />
            <span>Commute Fuel FAQs</span>
          </h3>

          <div className="divide-y divide-slate-200/70">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="py-3.5">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-orange-700 transition-colors focus:outline-hidden"
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-orange-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="mt-2.5 text-xs text-slate-600 leading-relaxed pl-1 pr-4 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </article>

      {/* Bottom Ad */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <AdBanner format="leaderboard" slotId="fuel-bottom-leaderboard" />
      </div>
    </div>
  );
};

export default CommuteFuelPage;
