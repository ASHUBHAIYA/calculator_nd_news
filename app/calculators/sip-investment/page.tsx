import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '@/components/SeoHead';
import {
  TrendingUp,
  RotateCcw,
  Info,
  ChevronDown,
  ArrowRight,
  PieChart,
  ShieldCheck,
  Percent,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { calculateSipGrowth } from '@/lib/calculators/investment';
import { formatINR } from '@/lib/formatters';

export const SipInvestmentPage: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [annualReturnRate, setAnnualReturnRate] = useState<number>(12);
  const [tenureYears, setTenureYears] = useState<number>(15);
  const [stepUpPct, setStepUpPct] = useState<number>(0);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const result = calculateSipGrowth({
    monthlyInvestment,
    annualReturnRate,
    tenureYears,
    annualStepUpPct: stepUpPct,
  });

  const handleReset = () => {
    setMonthlyInvestment(10000);
    setAnnualReturnRate(12);
    setTenureYears(15);
    setStepUpPct(0);
  };

  const FAQS = [
    {
      q: 'How does an SIP calculate compounding returns?',
      a: 'A Systematic Investment Plan (SIP) compounds monthly using the annuity-due method, where each installment is invested at the beginning of the calendar month and compounds for the remaining tenure. Early monthly contributions compound over the entire 15–20 years, creating substantial exponential wealth expansion.',
    },
    {
      q: 'What is a Step-Up SIP (Top-Up SIP)?',
      a: 'A Step-Up SIP automatically increases your monthly installment once every year (e.g., by 5% or 10%) in line with annual salary increments. This dramatically accelerates wealth accumulation compared to a static SIP without straining your monthly budget.',
    },
    {
      q: 'Are returns guaranteed in Mutual Fund SIPs?',
      a: 'No. Mutual fund investments are subject to market risks. Equity returns fluctuate based on macroeconomic cycles, corporate earnings, and global market events. The assumed return rate (e.g., 12% or 14%) is a hypothetical model based on historical broad-market averages (Nifty 50 / Sensex) and is not a forecast of future performance.',
    },
    {
      q: 'How are capital gains taxed on mutual fund investments in India?',
      a: 'Under Indian income tax laws (revised Union Budget 2024), Long-Term Capital Gains (LTCG) on equity mutual funds held for more than 12 months are exempt up to ₹1.25 Lakh per financial year, with gains above ₹1.25 Lakh taxed at 12.5%. Short-Term Capital Gains (STCG) on units held under 12 months are taxed at 20%.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="SIP & Investment Growth Calculator | Mutual Fund Wealth Compounding India"
        description="Calculate estimated returns, total invested corpus, and maturity values for monthly mutual fund SIPs with optional annual step-up top-up in India."
        canonicalPath="/calculators/sip-investment"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/' },
          { name: 'SIP & Investment Growth Calculator', path: '/calculators/sip-investment' },
        ]}
        faqs={FAQS}
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Wealth Planning &amp; Compounding Suite</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
                SIP &amp; Investment Growth Calculator
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Estimate the future value of your recurring monthly investments. Discover how consistent rupee-cost averaging and monthly compounding multiply your wealth over 5, 10, 15, or 25 years.
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
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Investment Parameters</h2>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Monthly Compounding
                </span>
              </div>

              {/* Monthly Installment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Monthly Investment Amount (₹)</span>
                  <span className="text-[11px] font-semibold text-emerald-700">{formatINR(monthlyInvestment)}</span>
                </label>
                <input
                  type="number"
                  min="500"
                  step="500"
                  value={monthlyInvestment || ''}
                  onChange={(e) => setMonthlyInvestment(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="e.g. 10000"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              {/* Quick Monthly Chips */}
              <div className="flex flex-wrap gap-2">
                {[2000, 5000, 10000, 15000, 25000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setMonthlyInvestment(amt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      monthlyInvestment === amt
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {formatINR(amt)}
                  </button>
                ))}
              </div>

              {/* Expected Return Rate */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Expected Annual Return Rate (%)</span>
                  <span className="text-[11px] font-semibold text-emerald-700">{annualReturnRate}% p.a.</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="35"
                  step="0.5"
                  value={annualReturnRate || ''}
                  onChange={(e) => setAnnualReturnRate(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="e.g. 12"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
                <div className="flex gap-2 text-[10px] text-slate-500 pt-1">
                  <span>Common benchmarks:</span>
                  <button type="button" onClick={() => setAnnualReturnRate(10)} className="underline hover:text-emerald-700">Conservative 10%</button>
                  <span>•</span>
                  <button type="button" onClick={() => setAnnualReturnRate(12)} className="underline hover:text-emerald-700">Balanced 12%</button>
                  <span>•</span>
                  <button type="button" onClick={() => setAnnualReturnRate(14)} className="underline hover:text-emerald-700">Aggressive 14%</button>
                </div>
              </div>

              {/* Investment Tenure */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Investment Tenure (Years)</span>
                  <span className="text-[11px] font-semibold text-emerald-700">{tenureYears} Years ({tenureYears * 12} Months)</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="35"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-emerald-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>1 Yr</span>
                  <span>5 Yrs</span>
                  <span>10 Yrs</span>
                  <span>15 Yrs</span>
                  <span>20 Yrs</span>
                  <span>25 Yrs</span>
                  <span>35 Yrs</span>
                </div>
              </div>

              {/* Optional Step-Up */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Annual Step-Up Top-Up (%)</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    {stepUpPct > 0 ? `+${stepUpPct}% each year` : 'No step-up (fixed)'}
                  </span>
                </label>
                <div className="flex gap-2">
                  {[0, 5, 10, 15].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setStepUpPct(pct)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        stepUpPct === pct
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {pct === 0 ? 'None (0%)' : `+${pct}% / yr`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Estimated Corpus
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  {tenureYears} Year Horizon
                </span>
              </div>

              {/* Maturity Value */}
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">Estimated Future Maturity Value</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight">
                    {formatINR(result.maturityValue)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Wealth Multiplier: <strong className="text-emerald-400 font-bold">{result.wealthMultiplier}x</strong> of your total invested capital
                </p>
              </div>

              {/* Invested vs Wealth Gain Matrix */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[11px] text-slate-400">Total Invested</div>
                  <div className="text-xl font-bold text-white font-display">
                    {formatINR(result.totalInvested)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {((result.totalInvested / (result.maturityValue || 1)) * 100).toFixed(0)}% of total corpus
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[11px] text-slate-400">Estimated Wealth Gain</div>
                  <div className="text-xl font-bold text-emerald-400 font-display">
                    {formatINR(result.estimatedReturns)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {((result.estimatedReturns / (result.maturityValue || 1)) * 100).toFixed(0)}% from compounding
                  </div>
                </div>
              </div>

              {/* Progress Bar of Invested vs Returns */}
              <div className="space-y-1.5 pt-1">
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${(result.totalInvested / (result.maturityValue || 1)) * 100}%` }}
                    className="bg-blue-500 h-full"
                    title="Invested Capital"
                  />
                  <div
                    style={{ width: `${(result.estimatedReturns / (result.maturityValue || 1)) * 100}%` }}
                    className="bg-emerald-500 h-full"
                    title="Compounded Wealth Gain"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                    Invested: {formatINR(result.totalInvested)}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    Est. Gain: {formatINR(result.estimatedReturns)}
                  </span>
                </div>
              </div>

              {/* Caution Banner */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-200/90 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Assumptions &amp; Market Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed text-emerald-200/80">
                  Returns are compounded on a monthly cycle assuming investment at the beginning of each calendar month. Actual mutual fund returns vary by market conditions and are neither guaranteed nor insured.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Schedule Table */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            <span>Year-by-Year Growth Trajectory</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3">Monthly SIP</th>
                  <th className="py-2.5 px-3">Cumulative Invested</th>
                  <th className="py-2.5 px-3">Compounded Wealth</th>
                  <th className="py-2.5 px-3 text-right">Wealth Gain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.yearlyBreakdown.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900">Year {row.year}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono">{formatINR(row.monthlyDeposit)}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-mono">{formatINR(row.cumulativeInvested)}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-700 font-mono">{formatINR(row.portfolioValue)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">+{formatINR(row.cumulativeReturns)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Worked Example Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-600" />
            <span>Worked Numerical Example</span>
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              Suppose an investor in Hyderabad starts an SIP of <strong>₹10,000 per month</strong> with an expected return of <strong>12% per annum</strong> over <strong>15 years</strong>:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1.5 text-slate-800">
              <div>• Monthly Contribution: ₹10,000</div>
              <div>• Total Tenure: 15 Years (180 Monthly Installments)</div>
              <div>• Total Invested Principal = 180 × ₹10,000 = <strong>₹18,00,000</strong></div>
              <div>• Compounded Growth Yield = <strong>~₹32,45,760</strong></div>
              <div>• Total Future Maturity Corpus = <strong>~₹50,45,760</strong> (2.80x your total investment!)</div>
            </div>
            <p>
              Notice how the interest earned (₹32.45 Lakhs) is almost double the original amount invested (₹18 Lakhs) purely due to the exponential compounding effect over the last 5 years.
            </p>
          </div>
        </section>

        {/* Cross Links to Other Tools */}
        <section className="border-t border-slate-200 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Related Personal Finance Calculators
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
              to="/calculators/in-hand-salary"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">In-Hand Salary Calculator</div>
              <p className="text-[11px] text-slate-500">FY 2026-27 New Tax Regime &amp; take-home pay</p>
            </Link>
            <Link
              to="/calculators/home-loan-prepayment"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">Home Loan Prepayment Saver</div>
              <p className="text-[11px] text-slate-500">Save ₹15+ Lakhs by paying 1 extra EMI</p>
            </Link>
            <Link
              to="/calculators/inflation-calculator"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">Inflation Impact Calculator</div>
              <p className="text-[11px] text-slate-500">Future cost projections &amp; purchasing power</p>
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
                  className="w-full flex items-center justify-between text-left gap-4 font-bold text-sm text-slate-900 hover:text-emerald-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-180 text-emerald-600' : 'text-slate-400'}`}
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
