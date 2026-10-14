import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '@/components/SeoHead';
import {
  Landmark,
  RotateCcw,
  Info,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Percent,
  ShieldCheck,
  Calendar,
  AlertCircle,
  PiggyBank,
} from 'lucide-react';
import {
  calculateDeposit,
  DepositType,
  CompoundingFrequency,
} from '@/lib/calculators/deposit';
import { formatINR } from '@/lib/formatters';

export const FdRdCalculatorPage: React.FC = () => {
  const [depositType, setDepositType] = useState<DepositType>('fixed');
  const [amount, setAmount] = useState<number>(200000);
  const [interestRate, setInterestRate] = useState<number>(7.25);
  const [tenureMonths, setTenureMonths] = useState<number>(36);
  const [compoundingFreq, setCompoundingFreq] = useState<CompoundingFrequency>('quarterly');
  const [isSeniorCitizen, setIsSeniorCitizen] = useState<boolean>(false);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const result = calculateDeposit({
    depositType,
    amount,
    interestRate,
    tenureMonths,
    compoundingFrequency: compoundingFreq,
    isSeniorCitizen,
  });

  const handleReset = () => {
    setDepositType('fixed');
    setAmount(200000);
    setInterestRate(7.25);
    setTenureMonths(36);
    setCompoundingFreq('quarterly');
    setIsSeniorCitizen(false);
  };

  const FAQS = [
    {
      q: 'How does quarterly compounding work for Indian bank Fixed Deposits?',
      a: 'In Indian commercial banks and post offices, interest on fixed deposits with tenures of 6 months or longer is compounded on a quarterly basis (every 3 months) in accordance with Reserve Bank of India (RBI) guidelines. The interest earned in each quarter is added to the principal, and subsequent interest is computed on that augmented balance.',
    },
    {
      q: 'What is the Senior Citizen interest benefit in India?',
      a: 'Most Indian public and private scheduled banks offer an additional 0.50% (50 basis points) annual interest rate to resident individuals aged 60 years or older on domestic term deposits across standard tenures.',
    },
    {
      q: 'How is TDS deducted on Bank FD and RD interest?',
      a: 'Under Section 194A of the Income Tax Act, banks deduct 10% TDS if the total interest earned across all your FD/RD accounts in a financial year exceeds ₹40,000 for regular individuals or ₹50,000 for senior citizens. If your total income is below the taxable threshold, you can submit Form 15G (or Form 15H for seniors) to avoid TDS deductions.',
    },
    {
      q: 'Why can actual bank maturity amounts differ slightly?',
      a: 'Banks may calculate exact days rather than calendar months, especially across leap years or fractional tenures. Also, cumulative deposits vs non-cumulative monthly/quarterly payout deposits use different payout schedules.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="FD & RD Calculator | Fixed & Recurring Deposit Maturity India"
        description="Calculate Fixed Deposit (FD) and Recurring Deposit (RD) maturity amounts, quarterly compounding interest, and senior citizen rates for Indian banks and post offices."
        canonicalPath="/calculators/fd-rd-calculator"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/' },
          { name: 'FD & RD Calculator', path: '/calculators/fd-rd-calculator' },
        ]}
        faqs={FAQS}
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
                <Landmark className="w-3.5 h-3.5 text-blue-600" />
                <span>Banking &amp; Fixed Income Suite</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
                FD &amp; RD Calculator (Fixed &amp; Recurring Deposits)
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Compute maturity amounts and compounding interest for Fixed Deposits and Recurring Deposits using official RBI quarterly compounding formulations and senior citizen benefits.
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
              {/* Deposit Type Switcher */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex p-1 bg-slate-100 rounded-xl w-full">
                  <button
                    type="button"
                    onClick={() => {
                      setDepositType('fixed');
                      if (amount < 10000) setAmount(200000);
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      depositType === 'fixed'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Fixed Deposit (FD)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDepositType('recurring');
                      if (amount > 50000) setAmount(10000);
                    }}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      depositType === 'recurring'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Recurring Deposit (RD)
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>
                    {depositType === 'fixed' ? 'Total Deposit Amount (₹)' : 'Monthly Installment (₹)'}
                  </span>
                  <span className="text-[11px] font-semibold text-blue-700">{formatINR(amount)}</span>
                </label>
                <input
                  type="number"
                  min="500"
                  step="5000"
                  value={amount || ''}
                  onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
                  placeholder={depositType === 'fixed' ? 'e.g. 200000' : 'e.g. 10000'}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="flex flex-wrap gap-2">
                {(depositType === 'fixed'
                  ? [50000, 100000, 200000, 500000, 1000000]
                  : [2000, 5000, 10000, 20000, 50000]
                ).map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      amount === amt
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {formatINR(amt)}
                  </button>
                ))}
              </div>

              {/* Annual Interest Rate */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Annual Interest Rate (%)</span>
                  <span className="text-[11px] font-semibold text-blue-700">
                    {result.effectiveInterestRate}% p.a.
                    {isSeniorCitizen && ' (Senior Citizen +0.5%)'}
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  step="0.05"
                  value={interestRate || ''}
                  onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="e.g. 7.25"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>

              {/* Tenure in Months */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Tenure (Months)</span>
                  <span className="text-[11px] font-semibold text-blue-700">
                    {tenureMonths} Months ({(tenureMonths / 12).toFixed(1)} Years)
                  </span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="120"
                  step="3"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>3 Mo</span>
                  <span>12 Mo (1Y)</span>
                  <span>36 Mo (3Y)</span>
                  <span>60 Mo (5Y)</span>
                  <span>120 Mo (10Y)</span>
                </div>
              </div>

              {/* Senior Citizen Checkbox & Frequency */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSeniorCitizen}
                    onChange={(e) => setIsSeniorCitizen(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <div className="text-xs font-bold text-slate-800">
                    <span>Senior Citizen (60+ Years)</span>
                    <span className="ml-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      +0.50% p.a. Bonus
                    </span>
                  </div>
                </label>

                {depositType === 'fixed' && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-slate-700">Compounding Frequency</label>
                    <select
                      value={compoundingFreq}
                      onChange={(e) => setCompoundingFreq(e.target.value as CompoundingFrequency)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50/50"
                    >
                      <option value="quarterly">Quarterly (Standard Indian Banking)</option>
                      <option value="monthly">Monthly Compounding</option>
                      <option value="half_yearly">Half-Yearly Compounding</option>
                      <option value="yearly">Yearly Compounding</option>
                      <option value="simple">Simple Interest (No Compounding)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  {depositType === 'fixed' ? 'Fixed Deposit Maturity' : 'Recurring Deposit Maturity'}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
                  {result.effectiveInterestRate}% p.a.
                </span>
              </div>

              {/* Big Maturity Number */}
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">Estimated Maturity Amount</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight">
                    {formatINR(result.maturityAmount)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Effective Annualized Yield: <strong className="text-blue-300 font-bold">{result.effectiveAnnualYield}%</strong>
                </p>
              </div>

              {/* Principal vs Interest Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[11px] text-slate-400">Total Deposited</div>
                  <div className="text-xl font-bold text-white font-display">
                    {formatINR(result.totalDepositAmount)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {depositType === 'fixed' ? 'Lump sum deposit' : `${tenureMonths} monthly deposits`}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[11px] text-slate-400">Total Interest Earned</div>
                  <div className="text-xl font-bold text-emerald-400 font-display">
                    {formatINR(result.totalInterestEarned)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Quarterly compounding gain
                  </div>
                </div>
              </div>

              {/* TDS Compliance Card */}
              <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/20 text-xs text-blue-200/90 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-blue-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Statutory TDS &amp; Banking Norms</span>
                </div>
                <p className="text-[11px] leading-relaxed text-blue-200/80">
                  Under Section 194A, banks deduct 10% TDS if interest earned across term deposits exceeds ₹40,000/yr (₹50,000 for seniors). Actual maturity amounts may vary by a few rupees across individual bank systems depending on leap-year day count conventions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Worked Example Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-blue-600" />
            <span>Worked Numerical Example</span>
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              Suppose you open a <strong>3-Year Fixed Deposit of ₹2,00,000 at 7.25% p.a.</strong> in a scheduled Indian bank with quarterly compounding:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1.5 text-slate-800">
              <div>• Principal (P): ₹2,00,000 | Interest Rate (r): 7.25% | Tenure (t): 3 Years (12 Quarters)</div>
              <div>• Quarterly Rate = 7.25% ÷ 4 = 1.8125% per quarter</div>
              <div>• Formula: $A = 2,00,000 \times (1 + 0.018125)^{12}$</div>
              <div>• Maturity Amount = <strong>₹2,47,978</strong></div>
              <div>• Total Compounded Interest Earned = <strong>₹47,978</strong> (Effective annual yield: 7.99%)</div>
            </div>
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
              to="/calculators/sip-investment"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">SIP Investment Calculator</div>
              <p className="text-[11px] text-slate-500">Mutual fund wealth compounding &amp; step-up</p>
            </Link>
            <Link
              to="/calculators/inflation-calculator"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">Inflation Impact Calculator</div>
              <p className="text-[11px] text-slate-500">Purchasing power erosion &amp; future cost</p>
            </Link>
            <Link
              to="/calculators/in-hand-salary"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">In-Hand Salary Calculator</div>
              <p className="text-[11px] text-slate-500">FY 2026-27 New Tax Regime &amp; standard deduction</p>
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
                  className="w-full flex items-center justify-between text-left gap-4 font-bold text-sm text-slate-900 hover:text-blue-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-180 text-blue-600' : 'text-slate-400'}`}
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
