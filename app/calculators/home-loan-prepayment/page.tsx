import React, { useState, useId } from 'react';
import {
  Home,
  TrendingDown,
  Clock,
  Calendar,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  CheckCircle2,
} from 'lucide-react';
import {
  calculateLoanPrepayment,
  LoanPrepaymentResult,
  LoanInput,
} from '@/lib/calculators/loan';
import { formatINR, formatCompactINR } from '@/lib/formatters';
import { AdBanner } from '@/components/AdBanner';
import { SeoHead } from '@/components/SeoHead';

export const HomeLoanPrepaymentPage: React.FC = () => {
  const principalId = useId();
  const rateId = useId();
  const tenureId = useId();
  const strategyId = useId();

  // State
  const [principal, setPrincipal] = useState<number>(5000000); // ₹50 Lakhs
  const [annualRate, setAnnualRate] = useState<number>(8.5); // 8.5%
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 years

  const [strategy, setStrategy] = useState<LoanInput['prepaymentStrategy']>('extra_emi_yearly');
  const [recurringExtra, setRecurringExtra] = useState<number>(5000);
  const [stepUpPct, setStepUpPct] = useState<number>(5);
  const [lumpSumAmt, setLumpSumAmt] = useState<number>(200000);
  const [lumpSumMonth, setLumpSumMonth] = useState<number>(12);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  const result: LoanPrepaymentResult = calculateLoanPrepayment({
    principal,
    annualInterestRate: annualRate,
    tenureYears,
    prepaymentStrategy: strategy,
    recurringMonthlyPrepayment: recurringExtra,
    annualStepUpPercentage: stepUpPct,
    extraEmisPerYear: 1,
    lumpSumAmount: lumpSumAmt,
    lumpSumMonth,
  });

  const FAQS = [
    {
      q: 'Are there any prepayment penalties on home loans in India?',
      a: 'No. As per the Reserve Bank of India (RBI) master directives, scheduled commercial banks and Housing Finance Companies (HFCs like LIC HFL, HDFC, etc.) are strictly prohibited from charging any prepayment penalty or foreclosure charges on floating-rate housing loans sanctioned to individual borrowers.',
    },
    {
      q: 'How does paying just 1 extra EMI each year reduce loan tenure drastically?',
      a: 'In the initial 5–8 years of a long-term home loan, 75% to 85% of each regular EMI goes toward paying interest, and only a tiny slice reduces the loan principal. When you make an extra payment (such as 1 extra EMI per year), 100% of that extra payment goes directly to reducing the principal balance. This prevents years of compounded interest from ever accruing.',
    },
    {
      q: 'Should I opt for tenure reduction or EMI reduction when prepaying?',
      a: 'Always opt for Tenure Reduction unless you face acute monthly cash-flow distress. Keeping your EMI constant and cutting the number of remaining months maximizes your total interest savings. If you reduce your EMI instead, you save substantially less interest over the life of the loan.',
    },
    {
      q: 'What is the 5% Annual Step-up EMI strategy?',
      a: 'As your career progresses, your salary typically increases by 7% to 15% annually through raises and promotions. Under the step-up strategy, you instruct your bank to increase your monthly EMI by just 5% or 10% each year. For a 20-year loan, a simple 5% annual step-up typically closes the entire loan in just 11 to 12 years, saving over 45% of total interest.',
    },
    {
      q: 'When is the best time during the loan lifecycle to prepay?',
      a: 'The earlier you prepay, the higher your financial savings. Because bank amortization schedules are front-loaded with interest, prepaying ₹1 Lakh in Year 2 of a 20-year loan saves far more money than prepaying ₹1 Lakh in Year 15. Every rupee paid early directly erodes the principal balance that generates future compound interest.',
    },
    {
      q: 'Does prepaying a home loan affect tax deductions under Section 24(b) and Section 80C?',
      a: 'While home loan interest offers tax deductions up to ₹2 Lakhs under Section 24(b) in the Old Tax Regime, paying 8.5%–9.0% interest to save 30% tax is a net loss of ~6% on your capital. Furthermore, under the New Tax Regime (Section 115BAC), Section 24(b) and 80C deductions are not available, making debt freedom via aggressive prepayment the mathematically optimal strategy for most salaried individuals.',
    },
    {
      q: 'Can I do online part-prepayment through bank netbanking or mobile app?',
      a: 'Yes, most major Indian lenders (SBI, HDFC Bank, ICICI Bank, Axis Bank, Kotak) now allow instant home loan part-prepayment directly through their mobile banking apps or internet banking portals under "Home Loan Self-Service". Always select "Tenure Reduction" rather than "EMI Reduction" during the online transaction.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Home Loan Prepayment Saver & Tenure Reducer Calculator | Save Bank Interest"
        description="Calculate how paying 1 extra EMI per year or a 5% annual step-up cuts your 20-year home loan down to 11–12 years and saves ₹15+ Lakhs in compounding bank interest."
        canonicalPath="/calculators/home-loan-prepayment"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/' },
          { name: 'Home Loan Prepayment Calculator', path: '/calculators/home-loan-prepayment' },
        ]}
        faqs={FAQS}
      />
      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
                <span>Calculators</span>
                <span>/</span>
                <span className="text-slate-500">Mortgage & Debt Optimization</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
                Home Loan Prepayment Saver & Tenure Reducer
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                Discover how paying 1 extra EMI a year or a 5% annual step-up cuts your 20-year home loan down to 12 years and saves ₹15+ Lakhs in compounding bank interest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Banner Advertisement */}
      <div className="max-w-7xl mx-auto px-4">
        <AdBanner format="leaderboard" slotId="loan-top-leaderboard" />
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Loan Inputs */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Home className="w-4 h-4 text-blue-600" />
                <span>Loan Parameters</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-500">
                Regular EMI: {formatINR(result.baseMonthlyEMI)}/mo
              </span>
            </div>

            {/* Principal */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor={principalId} className="text-xs font-bold text-slate-700">
                  Loan Amount (Principal)
                </label>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {formatCompactINR(principal)} ({formatINR(principal)})
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                <input
                  id={principalId}
                  type="number"
                  step="50000"
                  min="100000"
                  max="100000000"
                  value={principal || ''}
                  onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                  placeholder="e.g. 5000000"
                />
              </div>
              <div className="flex gap-2 pt-1">
                {[3000000, 5000000, 7500000, 10000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setPrincipal(amt)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                  >
                    {formatCompactINR(amt)}
                  </button>
                ))}
              </div>
            </div>

            {/* Interest Rate & Tenure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor={rateId} className="text-xs font-bold text-slate-700">
                    Interest Rate (% p.a.)
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-800">{annualRate}%</span>
                </div>
                <input
                  id={rateId}
                  type="number"
                  step="0.05"
                  min="5"
                  max="20"
                  value={annualRate || ''}
                  onChange={(e) => setAnnualRate(Math.max(0.1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono text-sm bg-slate-50/50"
                  placeholder="e.g. 8.5"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor={tenureId} className="text-xs font-bold text-slate-700">
                    Tenure (Years)
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-800">{tenureYears} Years</span>
                </div>
                <input
                  id={tenureId}
                  type="number"
                  step="1"
                  min="1"
                  max="30"
                  value={tenureYears || ''}
                  onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono text-sm bg-slate-50/50"
                  placeholder="e.g. 20"
                />
              </div>
            </div>

            {/* Prepayment Strategy Selection */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>Select Prepayment Strategy</span>
                <span className="text-[10px] text-blue-600 font-semibold">Accelerated Payoff</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStrategy('extra_emi_yearly')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    strategy === 'extra_emi_yearly'
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs font-bold">1 Extra EMI / Year</span>
                  <span className="block text-[10px] font-normal text-slate-500">Pay 13 EMIs annually</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStrategy('annual_stepup')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    strategy === 'annual_stepup'
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs font-bold">Annual EMI Step-Up</span>
                  <span className="block text-[10px] font-normal text-slate-500">Hike EMI with salary</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStrategy('recurring_monthly')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    strategy === 'recurring_monthly'
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs font-bold">Monthly Top-Up</span>
                  <span className="block text-[10px] font-normal text-slate-500">Extra ₹ per month</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStrategy('lump_sum')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    strategy === 'lump_sum'
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs font-bold">Lump-Sum Prepay</span>
                  <span className="block text-[10px] font-normal text-slate-500">Bonus / ESOP paydown</span>
                </button>
              </div>

              {/* Dynamic inputs based on strategy */}
              {strategy === 'annual_stepup' && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 mt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Annual EMI Increase:</span>
                    <span className="font-mono text-blue-700">{stepUpPct}% each year</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="15"
                    step="1"
                    value={stepUpPct}
                    onChange={(e) => setStepUpPct(Number(e.target.value))}
                    className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>3% (Conservative)</span>
                    <span>5% (Balanced)</span>
                    <span>10% (Aggressive)</span>
                  </div>
                </div>
              )}

              {strategy === 'recurring_monthly' && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 mt-2">
                  <label className="text-xs font-bold text-slate-700 flex justify-between">
                    <span>Additional Monthly Prepayment:</span>
                    <span className="font-mono text-blue-700">{formatINR(recurringExtra)}</span>
                  </label>
                  <input
                    type="number"
                    step="1000"
                    min="1000"
                    value={recurringExtra || ''}
                    onChange={(e) => setRecurringExtra(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-white"
                    placeholder="e.g. 5000"
                  />
                </div>
              )}

              {strategy === 'lump_sum' && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block">Lump Sum Amount (₹)</label>
                    <input
                      type="number"
                      step="25000"
                      value={lumpSumAmt || ''}
                      onChange={(e) => setLumpSumAmt(Math.max(0, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-white mt-1"
                      placeholder="e.g. 200000"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block">At Month (e.g. 12)</label>
                    <input
                      type="number"
                      min="1"
                      max={tenureYears * 12}
                      value={lumpSumMonth || ''}
                      onChange={(e) => setLumpSumMonth(Math.max(1, Number(e.target.value)))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono bg-white mt-1"
                      placeholder="e.g. 12"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Prepayment Results & Savings */}
          <div className="lg:col-span-6 space-y-6">
            {/* Savings Highlight Hero Card */}
            <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Total Compounding Interest Saved
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400">
                    {formatINR(result.interestSaved)}
                  </span>
                  <span className="text-xs text-slate-300 font-semibold">
                    ({result.interestSavedPercentage}% saved)
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Equivalent to {formatCompactINR(result.interestSaved)} kept in your family wealth
                </p>
              </div>

              {/* Tenure Reduction */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800">
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-blue-300 text-[11px] font-semibold mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Tenure Reduced By</span>
                  </div>
                  <span className="text-xl font-black font-mono text-white">
                    {result.tenureSavedYears} Yrs {result.tenureSavedRemainderMonths} Mos
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    ({result.tenureSavedMonths} months early payoff)
                  </span>
                </div>

                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-emerald-300 text-[11px] font-semibold mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>New Loan Duration</span>
                  </div>
                  <span className="text-xl font-black font-mono text-white">
                    {Math.floor(result.prepayActualTenureMonths / 12)} Yrs {result.prepayActualTenureMonths % 12} Mos
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    vs original {tenureYears} Years
                  </span>
                </div>
              </div>
            </div>

            {/* Side-by-Side Comparison Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Without Prepayment vs With Prepayment
              </h3>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-600">Base Monthly EMI</span>
                  <span className="font-mono font-bold text-slate-900">{formatINR(result.baseMonthlyEMI)}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-600">Total Interest (Without prepay)</span>
                  <span className="font-mono font-semibold text-red-600">{formatINR(result.baseTotalInterest)}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-600">Total Interest (With prepay)</span>
                  <span className="font-mono font-bold text-emerald-700">{formatINR(result.prepayTotalInterest)}</span>
                </div>
                <div className="py-2.5 flex justify-between items-center bg-slate-50 px-2 rounded-lg font-bold">
                  <span className="text-slate-800">Total Payment (Principal + Interest)</span>
                  <span className="font-mono text-slate-900">{formatINR(result.prepayTotalPayment)}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowAmortization(!showAmortization)}
                  className="w-full py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>{showAmortization ? 'Hide' : 'View'} Year-by-Year Amortization Schedule</span>
                  {showAmortization ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Year-by-year Amortization Table */}
              {showAmortization && (
                <div className="overflow-x-auto max-h-72 mt-2 border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 font-semibold sticky top-0 border-b border-slate-200">
                      <tr>
                        <th className="p-2">Year</th>
                        <th className="p-2">Base Balance</th>
                        <th className="p-2">Prepay Balance</th>
                        <th className="p-2 text-right">Interest Saved</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {result.yearlyAmortization.map((row) => (
                        <tr key={row.year} className="hover:bg-slate-50/70">
                          <td className="p-2 font-bold text-slate-800">Yr {row.year}</td>
                          <td className="p-2 text-slate-600">{formatINR(row.baseClosingBalance)}</td>
                          <td className="p-2 text-blue-700 font-bold">
                            {row.prepayClosingBalance <= 0 ? 'PAID OFF' : formatINR(row.prepayClosingBalance)}
                          </td>
                          <td className="p-2 text-right text-emerald-700 font-bold">
                            +{formatINR(row.cumulativeInterestSaved)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Middle Advertisement */}
      <div className="max-w-4xl mx-auto px-4">
        <AdBanner format="in-feed" slotId="loan-middle-in-feed" />
      </div>

      {/* SEO Explanatory Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 space-y-8 text-slate-700 text-sm leading-relaxed">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
            The Mathematics of Home Loan Prepayment: How Small Actions Save Millions in Interest
          </h2>

          <p>
            A 20-year or 30-year home loan is typically the largest financial liability in an Indian family&apos;s lifetime. Due to the nature of <strong>reducing-balance monthly amortization</strong>, bank interest is heavily front-loaded. On a ₹50 Lakh loan at 8.5% over 20 years, total interest paid exceeds <strong>₹54 Lakhs</strong>—meaning you pay the bank more in interest than the entire original property cost!
          </p>

          <h3 className="text-lg font-bold text-slate-900">
            Why Standard Prepayment Beats Any Fixed Deposit
          </h3>

          <p>
            When you prepay home loan principal, you generate a guaranteed, tax-free return equal to your lending interest rate (e.g. 8.5% or 9.0%). Because standard bank fixed deposits are taxable at your marginal slab rate (up to 30% + cess), an 8.5% loan prepayment is mathematically equivalent to earning <strong>over 12.3% pre-tax</strong> on a risk-free investment.
          </p>

          <h3 className="text-lg font-bold text-slate-900">
            The Power of the &quot;1 Extra EMI Every Year&quot; Rule
          </h3>

          <p>
            By channeling just one bonus paycheck or Diwali allowance into paying a 13th EMI each December, the entire loan duration shrinks by more than 4 to 5 full years. The earlier in the loan life cycle you commence this habit, the greater the compounding savings.
          </p>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <span>Home Loan Prepayment Frequently Asked Questions</span>
          </h3>

          <div className="divide-y divide-slate-200/70">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="py-3.5">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-blue-700 transition-colors focus:outline-hidden"
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" />
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
        <AdBanner format="leaderboard" slotId="loan-bottom-leaderboard" />
      </div>
    </div>
  );
};

export default HomeLoanPrepaymentPage;
