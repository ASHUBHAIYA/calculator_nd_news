import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '@/components/SeoHead';
import {
  TrendingDown,
  RotateCcw,
  Info,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Percent,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Clock,
} from 'lucide-react';
import {
  calculateInflation,
  InflationMode,
} from '@/lib/calculators/inflation';
import { formatINR } from '@/lib/formatters';

export const InflationCalculatorPage: React.FC = () => {
  const [amount, setAmount] = useState<number>(50000);
  const [inflationRate, setInflationRate] = useState<number>(6.5);
  const [tenureYears, setTenureYears] = useState<number>(10);
  const [mode, setMode] = useState<InflationMode>('future_cost');

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const result = calculateInflation({
    amount,
    annualInflationRate: inflationRate,
    tenureYears,
    mode,
  });

  const handleReset = () => {
    setAmount(50000);
    setInflationRate(6.5);
    setTenureYears(10);
    setMode('future_cost');
  };

  const FAQS = [
    {
      q: 'How does inflation erode purchasing power in India?',
      a: 'Inflation is the rate at which general prices for goods and services rise over time. As prices increase, every rupee purchases fewer goods. At a 6.5% annual inflation rate, prices double in approximately 11 years (Rule of 72), meaning an expense that costs ₹50,000 today will require over ₹94,000 in a decade.',
    },
    {
      q: 'What is headline CPI vs Sectoral Inflation (Education, Healthcare)?',
      a: 'The official Consumer Price Index (CPI) tracks an average basket of consumer goods (food, fuel, clothing, housing). However, lifestyle costs such as higher education and private healthcare in urban India have historically inflated at 10% to 12% annually, outpacing the general CPI.',
    },
    {
      q: 'Is this calculation a forecast of official RBI inflation?',
      a: 'No. This calculator is a constant-compounding mathematical projection. Real inflation fluctuates annually based on monsoon rainfall, global crude oil prices, supply chain dynamics, and Reserve Bank of India monetary policy.',
    },
    {
      q: 'How can households beat inflation?',
      a: 'To beat inflation, your investments must generate a post-tax return higher than the prevailing inflation rate. Fixed assets or equities (such as mutual fund SIPs) historically offer inflation-beating real returns over long investment horizons.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Inflation Calculator | Future Cost & Purchasing Power India"
        description="Calculate the future cost of today's expenses and purchasing power erosion under annual inflation rates. Plan retirement corpus and lifestyle goals."
        canonicalPath="/calculators/inflation-calculator"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/' },
          { name: 'Inflation Calculator', path: '/calculators/inflation-calculator' },
        ]}
        faqs={FAQS}
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
                <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                <span>Financial Planning &amp; Purchasing Power Suite</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
                Inflation &amp; Purchasing Power Calculator
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Estimate how annual inflation affects living expenses, household budgets, and retirement corpus needs over time. Project future item costs or examine purchasing power decay.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold shadow-xs transition-all cursor-pointer self-start md:self-auto"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
              {/* Mode Switcher */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex p-1 bg-slate-100 rounded-xl w-full">
                  <button
                    type="button"
                    onClick={() => setMode('future_cost')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      mode === 'future_cost'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Future Cost of Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('purchasing_power')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      mode === 'purchasing_power'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Purchasing Power of Cash
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>
                    {mode === 'future_cost' ? 'Current Monthly Expense / Item Cost (₹)' : 'Current Cash Balance (₹)'}
                  </span>
                  <span className="text-[11px] font-semibold text-rose-700">{formatINR(amount)}</span>
                </label>
                <input
                  type="number"
                  min="1000"
                  step="5000"
                  value={amount || ''}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="e.g. 50000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="flex flex-wrap gap-2">
                {[25000, 50000, 100000, 500000, 1000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      amount === amt
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {formatINR(amt)}
                  </button>
                ))}
              </div>

              {/* Assumed Annual Inflation Rate */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Assumed Annual Inflation Rate (%)</span>
                  <span className="text-[11px] font-semibold text-rose-700">{inflationRate}% per year</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  step="0.25"
                  value={inflationRate || ''}
                  onChange={(e) => setInflationRate(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="e.g. 6.5"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                />
                <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-500 pt-1">
                  <span>Common benchmarks:</span>
                  <button type="button" onClick={() => setInflationRate(5.0)} className="underline hover:text-rose-700">General CPI (5%)</button>
                  <span>•</span>
                  <button type="button" onClick={() => setInflationRate(6.5)} className="underline hover:text-rose-700">Urban Lifestyle (6.5%)</button>
                  <span>•</span>
                  <button type="button" onClick={() => setInflationRate(10.0)} className="underline hover:text-rose-700">Higher Education (10%)</button>
                  <span>•</span>
                  <button type="button" onClick={() => setInflationRate(12.0)} className="underline hover:text-rose-700">Healthcare (12%)</button>
                </div>
              </div>

              {/* Tenure in Years */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Time Horizon (Years)</span>
                  <span className="text-[11px] font-semibold text-rose-700">{tenureYears} Years</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="35"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-rose-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>1 Yr</span>
                  <span>5 Yrs</span>
                  <span>10 Yrs</span>
                  <span>15 Yrs</span>
                  <span>20 Yrs</span>
                  <span>30 Yrs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  {mode === 'future_cost' ? 'Projected Future Cost' : 'Purchasing Power Decay'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/30">
                  {tenureYears} Years @ {inflationRate}%
                </span>
              </div>

              {/* Big Number */}
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">
                  {mode === 'future_cost'
                    ? `Cost in ${tenureYears} Years for ${formatINR(amount)} Today`
                    : `Real Value in ${tenureYears} Years of ${formatINR(amount)}`}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight">
                    {formatINR(mode === 'future_cost' ? result.projectedFutureCost : result.futurePurchasingPower)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  {mode === 'future_cost'
                    ? `Total price surge: +${result.totalPercentageIncrease}% (+${formatINR(result.absoluteCostIncrease)})`
                    : `Purchasing value diminishes by ${((1 - result.futurePurchasingPower / amount) * 100).toFixed(0)}% in real terms`}
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[11px] text-slate-400">Today&apos;s Baseline</div>
                  <div className="text-xl font-bold text-white font-display">
                    {formatINR(amount)}
                  </div>
                  <div className="text-[10px] text-slate-400">Current purchasing value</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[11px] text-slate-400">Inflation Multiplier</div>
                  <div className="text-xl font-bold text-rose-400 font-display">
                    {(result.projectedFutureCost / amount).toFixed(2)}x
                  </div>
                  <div className="text-[10px] text-slate-400">Compounded expansion</div>
                </div>
              </div>

              {/* Projection Caution */}
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/20 text-xs text-rose-200/90 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-rose-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Important Modeling Note</span>
                </div>
                <p className="text-[11px] leading-relaxed text-rose-200/80">
                  This calculator demonstrates constant compounding projections based on your input rate. It does not predict future macroeconomic outcomes or monetary decisions by the Reserve Bank of India.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Yearly Trajectory Table */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-rose-600" />
            <span>Inflation Progression Timeline</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Projected Expense Cost</th>
                  <th className="py-2.5 px-3">Equivalent Purchasing Power</th>
                  <th className="py-2.5 px-3 text-right">Cumulative Inflation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.yearlySchedule.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Year {row.year}</td>
                    <td className="py-2.5 px-3 font-mono text-rose-700 font-semibold">{formatINR(row.projectedCost)}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{formatINR(row.purchasingPowerEquivalent)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">+{row.cumulativeInflationPct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Worked Example Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Percent className="w-5 h-5 text-rose-600" />
            <span>Worked Numerical Example</span>
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              Suppose your family&apos;s current monthly household grocery and utility budget is <strong>₹50,000</strong>. Assuming an annual inflation rate of <strong>6.5%</strong> over <strong>10 years</strong>:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1.5 text-slate-800">
              <div>• Base Expense: ₹50,000 | Rate: 6.5% | Horizon: 10 Years</div>
              <div>• Compounding Multiplier: $(1 + 0.065)^{10} \approx 1.877$</div>
              <div>• Projected Monthly Cost in 10 Years = ₹50,000 × 1.877 = <strong>₹93,857 / month</strong></div>
              <div>• Extra Monthly Income Needed: <strong>+₹43,857</strong> just to maintain the same standard of living!</div>
            </div>
          </div>
        </section>

        {/* Cross Links to Other Tools */}
        <section className="border-t border-slate-200 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Related Financial Planning Tools
            </h3>
            <Link
              to="/"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Explore All Engines</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/calculators/sip-investment"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">SIP Investment Calculator</div>
              <p className="text-[11px] text-slate-500">Compound mutual fund returns to beat inflation</p>
            </Link>
            <Link
              to="/calculators/fd-rd-calculator"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">FD &amp; RD Calculator</div>
              <p className="text-[11px] text-slate-500">Fixed deposit &amp; recurring deposit returns</p>
            </Link>
            <Link
              to="/calculators/in-hand-salary"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-rose-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">In-Hand Salary Calculator</div>
              <p className="text-[11px] text-slate-500">FY 2026-27 New Tax Regime salary breakdown</p>
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="divide-y divide-slate-100">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0">
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left gap-4 font-bold text-sm text-slate-900 hover:text-rose-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-180 text-rose-600' : 'text-slate-400'}`}
                  />
                </button>
                {activeFaq === idx && (
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in-50">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
