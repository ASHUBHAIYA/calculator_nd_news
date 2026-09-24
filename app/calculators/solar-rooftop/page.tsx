import React, { useState, useId } from 'react';
import {
  Sun,
  Zap,
  TrendingUp,
  Leaf,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TreePine,
} from 'lucide-react';
import {
  calculateSolarSubsidy,
  SolarSubsidyBreakdown,
  CENTRAL_SUBSIDY_MAX,
} from '@/lib/calculators/solar';
import { formatINR, formatNumberIN, formatCompactINR } from '@/lib/formatters';
import { AdBanner } from '@/components/AdBanner';
import { SeoHead } from '@/components/SeoHead';

export const SolarRooftopPage: React.FC = () => {
  const billId = useId();
  const tariffId = useId();
  const capId = useId();
  const stateSubId = useId();

  // State
  const [monthlyBill, setMonthlyBill] = useState<number>(3200); // ₹3,200/mo
  const [tariff, setTariff] = useState<number>(7.5); // ₹7.50/unit
  const [customKw, setCustomKw] = useState<number>(0); // 0 means auto-recommend
  const [stateSubsidy, setStateSubsidy] = useState<number>(0);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const solar: SolarSubsidyBreakdown = calculateSolarSubsidy({
    monthlyElectricityBill: monthlyBill,
    electricityTariffPerUnit: tariff,
    customCapacityKw: customKw > 0 ? customKw : undefined,
    stateSubsidyAmount: stateSubsidy,
  });

  const FAQS = [
    {
      q: 'What are the subsidy slabs under the PM Surya Ghar: Muft Bijli Yojana?',
      a: 'Under the official Ministry of New and Renewable Energy (MNRE) guidelines launched in 2024: (1) Systems up to 1 kW receive ₹30,000, (2) Systems of 2 kW receive ₹60,000, and (3) Systems of 3 kW or higher receive the maximum central financial assistance of ₹78,000. The subsidy is deposited directly into your bank account via DBT (Direct Benefit Transfer) post-commissioning.',
    },
    {
      q: 'How much shadow-free rooftop space is needed per kW of solar panels?',
      a: 'Modern mono-crystalline PERC or TOPCon solar panels require approximately 80 to 100 square feet of shadow-free rooftop area per 1 kW of installed capacity. A standard 3 kW residential setup requires roughly 250 to 300 square feet.',
    },
    {
      q: 'What is Net Metering in India?',
      a: 'Net metering is a bi-directional electricity billing mechanism. During daytime peak sunlight, your solar panels often generate more electricity than your household consumes. This excess clean electricity is exported back into the DISCOM power grid, spinning your meter backward. At night, you draw power from the grid. You are only billed for the net difference.',
    },
    {
      q: 'What is the standard warranty and degradation rate on rooftop solar panels?',
      a: 'Reputable MNRE-empanelled Tier-1 manufacturers provide a 10-year product warranty and a 25-year linear performance warranty. Standard solar panels degrade at less than 0.5% to 0.7% annually, guaranteeing at least 80% to 84% power generation efficiency even at year 25.',
    },
    {
      q: 'Can I get low-interest collateral-free bank loans for rooftop solar under PM Surya Ghar?',
      a: 'Yes, public sector banks (such as State Bank of India, Canara Bank, PNB) offer special collateral-free rooftop solar loans under the PM Surya Ghar scheme at a concessional interest rate of approximately 7.00% p.a. for residential installations up to 3 kW.',
    },
    {
      q: 'What is the typical payback period (ROI) for residential rooftop solar in India?',
      a: 'With central DBT subsidies covering up to ₹78,000 and domestic electricity tariffs averaging ₹6.50 to ₹9.00 per unit in urban DISCOMs, most 3 kW residential installations achieve complete capital payback within 3.5 to 4.5 years. For the remaining 20+ years of the system lifecycle, electricity is virtually 100% free.',
    },
    {
      q: 'Do additional state government subsidies stack on top of the central PM Surya Ghar scheme?',
      a: 'Yes! Several state governments (including Uttar Pradesh, Madhya Pradesh, Maharashtra, and Delhi) offer supplementary state-level subsidies that stack on top of the ₹78,000 central subsidy. Our calculator includes a dedicated State Subsidy field so you can compute your exact out-of-pocket net cost.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="PM Surya Ghar Solar Subsidy & ROI Calculator | Central Financial Assistance"
        description="Calculate central financial assistance up to ₹78,000, recommended rooftop capacity in kW, net project cost, and 25-year cumulative savings under PM Surya Ghar Muft Bijli Yojana."
        canonicalPath="/calculators/solar-rooftop"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/' },
          { name: 'PM Surya Ghar Solar Calculator', path: '/calculators/solar-rooftop' },
        ]}
        faqs={FAQS}
      />
      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-yellow-700">
                <span>Calculators</span>
                <span>/</span>
                <span className="text-slate-500">Renewable Energy & MNRE Schemes</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
                PM Surya Ghar Solar Subsidy & ROI Calculator
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                Compute central financial assistance up to ₹78,000, recommended rooftop capacity, net project investment, and 25-year cumulative savings under PM Surya Ghar Muft Bijli Yojana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-4">
        <AdBanner format="leaderboard" slotId="solar-top-leaderboard" />
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sun className="w-4 h-4 text-yellow-600" />
                <span>Rooftop Solar Parameters</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-500">
                Recommended: {solar.recommendedCapacityKw} kW
              </span>
            </div>

            {/* Monthly Bill Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor={billId} className="text-xs font-bold text-slate-700">
                  Average Monthly Electricity Bill (₹)
                </label>
                <span className="text-xs font-mono font-bold text-yellow-800 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100">
                  {formatINR(monthlyBill)} / month (~{solar.monthlyUnitsConsumed} units)
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  id={billId}
                  type="number"
                  step="200"
                  min="500"
                  max="50000"
                  value={monthlyBill || ''}
                  onChange={(e) => setMonthlyBill(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-yellow-500 bg-slate-50/50"
                  placeholder="e.g. 3200"
                />
              </div>
              <div className="flex gap-2 pt-1">
                {[1500, 2500, 3500, 5000, 8000].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setMonthlyBill(b)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                  >
                    ₹{b}
                  </button>
                ))}
              </div>
            </div>

            {/* Tariff & Custom kW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor={tariffId} className="text-xs font-bold text-slate-700 block">
                  Grid Tariff (₹ / unit kWh)
                </label>
                <input
                  id={tariffId}
                  type="number"
                  step="0.25"
                  min="3"
                  max="15"
                  value={tariff || ''}
                  onChange={(e) => setTariff(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono text-xs bg-slate-50/50"
                  placeholder="e.g. 7.50"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={capId} className="text-xs font-bold text-slate-700 block">
                  System Capacity (kW)
                </label>
                <select
                  id={capId}
                  value={customKw}
                  onChange={(e) => setCustomKw(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 text-xs bg-slate-50/50 font-medium"
                >
                  <option value="0">Auto-Recommend ({solar.recommendedCapacityKw} kW)</option>
                  <option value="1">1 kW System (₹30,000 Subsidy)</option>
                  <option value="2">2 kW System (₹60,000 Subsidy)</option>
                  <option value="3">3 kW System (₹78,000 Max Subsidy)</option>
                  <option value="4">4 kW System</option>
                  <option value="5">5 kW System</option>
                </select>
              </div>
            </div>

            {/* State Subsidy Optional */}
            <div className="space-y-1.5 pt-1">
              <label htmlFor={stateSubId} className="text-xs font-bold text-slate-700 flex justify-between">
                <span>Additional State Subsidy (UP/Gujarat/Delhi top-up)</span>
                <span className="text-xs font-mono font-bold text-slate-700">{formatINR(stateSubsidy)}</span>
              </label>
              <input
                id={stateSubId}
                type="number"
                step="5000"
                min="0"
                value={stateSubsidy || ''}
                onChange={(e) => setStateSubsidy(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono text-xs bg-slate-50/50"
                placeholder="₹0 if none"
              />
            </div>
          </div>

          {/* Outputs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Subsidy Highlight Hero Card */}
            <div className="bg-gradient-to-br from-slate-900 via-stone-900 to-amber-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-yellow-400">
                  PM Surya Ghar Central Subsidy
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">
                    {formatINR(solar.centralSubsidy)}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">Direct DBT to Bank</span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Gross Cost: {formatINR(solar.grossSystemCost)} | Net Investment: <strong className="text-white">{formatINR(solar.netInvestmentCost)}</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Annual Bill Savings</span>
                  <span className="text-xl font-black font-mono text-white">
                    {formatINR(solar.annualSavings)}
                  </span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">
                    ~{formatINR(solar.monthlyElectricityBillSaved)} / mo
                  </span>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Full Payback Period</span>
                  <span className="text-xl font-black font-mono text-yellow-400">
                    {solar.paybackPeriodYears} Years
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Then 20+ yrs of free power
                  </span>
                </div>
              </div>
            </div>

            {/* 25-Year Lifetime Wealth & Ecological Impact */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                25-Year Performance & Environmental Return
              </h3>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-600">Rooftop Space Required</span>
                  <span className="font-mono font-bold text-slate-900">
                    ~{solar.rooftopAreaRequiredSqFt} sq.ft shadow-free
                  </span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-600">Clean Units Generated</span>
                  <span className="font-mono font-semibold text-slate-900">
                    ~{formatNumberIN(solar.annualSolarUnitsGenerated)} kWh / year
                  </span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-600">25-Year Net Profit (Post-Capex)</span>
                  <span className="font-mono font-bold text-emerald-700">
                    {formatINR(solar.lifetimeNetProfit)}
                  </span>
                </div>
                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-600">Annual CO₂ Offset</span>
                  <span className="font-mono font-bold text-slate-900">
                    {solar.annualCO2OffsetTons} Metric Tons
                  </span>
                </div>
                <div className="py-2 flex justify-between items-center text-emerald-800 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <TreePine className="w-4 h-4 text-emerald-600" />
                    <span>Trees Planted Equivalent</span>
                  </span>
                  <span className="font-mono">{solar.equivalentTreesPlanted} Trees / Year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Advertisement */}
      <div className="max-w-4xl mx-auto px-4">
        <AdBanner format="in-feed" slotId="solar-middle-in-feed" />
      </div>

      {/* FAQs */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-yellow-600" />
            <span>PM Surya Ghar Solar Subsidy FAQs</span>
          </h3>

          <div className="divide-y divide-slate-200/70">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="py-3.5">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-yellow-800 transition-colors focus:outline-hidden"
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-yellow-600 shrink-0" />
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
        <AdBanner format="leaderboard" slotId="solar-bottom-leaderboard" />
      </div>
    </div>
  );
};

export default SolarRooftopPage;
