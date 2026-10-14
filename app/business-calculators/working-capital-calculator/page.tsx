import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '@/components/SeoHead';
import {
  Wallet,
  RotateCcw,
  Info,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Building2,
  ShieldCheck,
  Scale,
} from 'lucide-react';
import { calculateWorkingCapital } from '@/lib/calculators/workingCapital';
import { formatINR } from '@/lib/formatters';

export const WorkingCapitalPage: React.FC = () => {
  // Current Assets state
  const [cashAndBank, setCashAndBank] = useState<number>(350000);
  const [accountsReceivable, setAccountsReceivable] = useState<number>(650000);
  const [inventory, setInventory] = useState<number>(500000);
  const [otherAssets, setOtherAssets] = useState<number>(100000);

  // Current Liabilities state
  const [accountsPayable, setAccountsPayable] = useState<number>(450000);
  const [shortTermDebt, setShortTermDebt] = useState<number>(300000);
  const [accruedExpenses, setAccruedExpenses] = useState<number>(150000);
  const [otherLiab, setOtherLiab] = useState<number>(50000);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const result = calculateWorkingCapital({
    cashAndBank,
    accountsReceivable,
    inventory,
    otherCurrentAssets: otherAssets,
    accountsPayable,
    shortTermDebt,
    accruedExpenses,
    otherCurrentLiabilities: otherLiab,
  });

  const handleReset = () => {
    setCashAndBank(350000);
    setAccountsReceivable(650000);
    setInventory(500000);
    setOtherAssets(100000);
    setAccountsPayable(450000);
    setShortTermDebt(300000);
    setAccruedExpenses(150000);
    setOtherLiab(50000);
  };

  const FAQS = [
    {
      q: 'What is Working Capital versus the Current Ratio?',
      a: 'Net Working Capital is an absolute rupee amount (Current Assets minus Current Liabilities) representing your business’s liquid operating buffer. The Current Ratio is a relative proportion (Current Assets divided by Current Liabilities) measuring how many rupees of short-term assets you hold for every ₹1 of upcoming liabilities. While working capital shows scale, the ratio shows financial leverage and liquidity health regardless of company size.',
    },
    {
      q: 'What is considered a healthy Current Ratio for Indian businesses?',
      a: 'In Indian commercial lending and bank appraisal guidelines, a Current Ratio of 1.33 to 2.0 is considered the standard benchmark for trading, manufacturing, and distribution firms. A ratio below 1.0 indicates working capital deficit, where short-term dues exceed realizable short-term assets.',
    },
    {
      q: 'What is the Quick Ratio (Acid-Test Ratio)?',
      a: 'The Quick Ratio excludes unsold inventory from current assets because stock takes time to liquidate into cash without price discounts. It is calculated as (Cash + Accounts Receivable) ÷ Current Liabilities. A quick ratio of 1.0 or higher means you can settle all immediate liabilities without needing to sell another piece of inventory.',
    },
    {
      q: 'Does this calculator constitute certified financial or accounting advice?',
      a: 'No. This calculator is strictly an educational and operational modeling tool. Statutory accounting statements, bank loan proposals, and audit assessments should be prepared in consultation with a qualified Chartered Accountant (CA).',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Working Capital Calculator | Current Ratio & Liquidity Analysis India"
        description="Calculate Net Working Capital (NWC), Current Ratio, and Quick Ratio for Indian MSMEs, proprietary firms, and traders. Benchmark operational liquidity."
        canonicalPath="/business-calculators/working-capital-calculator"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Business Calculators', path: '/business-calculators' },
          { name: 'Working Capital Calculator', path: '/business-calculators/working-capital-calculator' },
        ]}
        faqs={FAQS}
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Corporate Finance &amp; Liquidity Suite</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
                Working Capital &amp; Current Ratio Calculator
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Assess your enterprise liquidity buffer: evaluate current assets versus current liabilities, determine your current and quick ratios, and identify potential cash flow bottlenecks.
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
          <div className="lg:col-span-7 space-y-6">
            {/* Current Assets Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Current Assets (Convertible within 12 Months)</span>
                </h2>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Total: {formatINR(result.totalCurrentAssets)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Cash &amp; Bank Balances (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={cashAndBank || ''}
                    onChange={(e) => setCashAndBank(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="e.g. 350000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Accounts Receivable / Debtors (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={accountsReceivable || ''}
                    onChange={(e) => setAccountsReceivable(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="e.g. 650000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Inventory &amp; Stock on Hand (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={inventory || ''}
                    onChange={(e) => setInventory(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="e.g. 500000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Other Current Assets / Advances (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={otherAssets || ''}
                    onChange={(e) => setOtherAssets(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="e.g. 100000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* Current Liabilities Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-sm font-bold uppercase tracking-wider text-rose-800 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Current Liabilities (Due within 12 Months)</span>
                </h2>
                <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                  Total: {formatINR(result.totalCurrentLiabilities)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Accounts Payable / Creditors (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={accountsPayable || ''}
                    onChange={(e) => setAccountsPayable(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="e.g. 450000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Bank CC / OD / Short Debt (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={shortTermDebt || ''}
                    onChange={(e) => setShortTermDebt(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="e.g. 300000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Accrued Expenses &amp; GST/TDS (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={accruedExpenses || ''}
                    onChange={(e) => setAccruedExpenses(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="e.g. 150000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Other Current Liabilities (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={otherLiab || ''}
                    onChange={(e) => setOtherLiab(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="e.g. 50000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  Liquidity Assessment
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    result.workingCapitalStatus === 'healthy'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : result.workingCapitalStatus === 'adequate'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                  }`}
                >
                  {result.workingCapitalStatus === 'healthy'
                    ? 'Healthy Buffer'
                    : result.workingCapitalStatus === 'adequate'
                      ? 'Adequate Liquidity'
                      : 'Working Capital Drag'}
                </span>
              </div>

              {/* Net Working Capital Big Stat */}
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">Net Working Capital (NWC)</div>
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl sm:text-5xl font-black font-display tracking-tight ${
                      result.netWorkingCapital >= 0 ? 'text-white' : 'text-rose-400'
                    }`}
                  >
                    {formatINR(result.netWorkingCapital)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Current Assets ({formatINR(result.totalCurrentAssets)}) minus Current Liabilities ({formatINR(result.totalCurrentLiabilities)})
                </p>
              </div>

              {/* Ratios Matrix */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[11px] text-slate-400">Current Ratio</div>
                  <div className="text-2xl font-black text-teal-300 font-display">
                    {result.currentRatio !== null ? `${result.currentRatio}:1` : 'N/A'}
                  </div>
                  <div className="text-[10px] text-slate-400">Benchmark: 1.33 – 2.00</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[11px] text-slate-400">Quick Ratio (Acid-Test)</div>
                  <div className="text-2xl font-black text-emerald-300 font-display">
                    {result.quickRatio !== null ? `${result.quickRatio}:1` : 'N/A'}
                  </div>
                  <div className="text-[10px] text-slate-400">Benchmark: ≥ 1.00</div>
                </div>
              </div>

              {/* Status Explanation */}
              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/20 text-xs text-teal-200/90 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-teal-300">
                  <Info className="w-4 h-4" />
                  <span>Liquidity Status Note</span>
                </div>
                <p className="text-[11px] leading-relaxed text-teal-200/80">
                  {result.statusDescription}
                </p>
              </div>
            </div>

            {/* Disclaimer Callout */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed text-amber-800">
                <strong>Informational Notice:</strong> This calculator provides mathematical ratio modeling. It does not constitute formal banking assessment or certified investment advice. Consult a Chartered Accountant for statutory financial planning.
              </p>
            </div>
          </div>
        </div>

        {/* Worked Numerical Example */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <span>Worked Numerical Example</span>
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              Consider a textile manufacturer in Surat with the following balance sheet balances:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1 text-slate-800">
                <div className="font-bold text-emerald-800 pb-1">Current Assets:</div>
                <div>Cash in Bank: ₹3,00,000</div>
                <div>Trade Receivables: ₹7,00,000</div>
                <div>Finished Fabric Inventory: ₹6,00,000</div>
                <div>Total Assets = <strong>₹16,00,000</strong></div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1 text-slate-800">
                <div className="font-bold text-rose-800 pb-1">Current Liabilities:</div>
                <div>Yarn Suppliers Payable: ₹5,00,000</div>
                <div>Bank CC Limit Drawn: ₹4,00,000</div>
                <div>Accrued Wages &amp; GST: ₹1,00,000</div>
                <div>Total Liabilities = <strong>₹10,00,000</strong></div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-950 space-y-1">
              <div>• Net Working Capital = ₹16,00,000 - ₹10,00,000 = <strong>₹6,00,000</strong> (Positive liquid buffer)</div>
              <div>• Current Ratio = ₹16,00,000 ÷ ₹10,00,000 = <strong>1.60:1</strong> (Within the ideal 1.33–2.00 banking band)</div>
              <div>• Quick Ratio = (₹3,00,000 + ₹7,00,000) ÷ ₹10,00,000 = <strong>1.00:1</strong> (Healthy baseline without depending on inventory sales)</div>
            </div>
          </div>
        </section>

        {/* Cross Links to Other Business Tools */}
        <section className="border-t border-slate-200 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Related Financial &amp; Trade Calculators
            </h3>
            <Link
              to="/business-calculators"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Explore All Trade Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/business-calculators/credit-sale-cost-calculator"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">Credit Sale Cost Calculator</div>
              <p className="text-[11px] text-slate-500">Working capital carrying drag on trade credit</p>
            </Link>
            <Link
              to="/business-calculators/inventory-reorder-calculator"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">Inventory Reorder Calculator</div>
              <p className="text-[11px] text-slate-500">ROP, safety stock, and EOQ optimization</p>
            </Link>
            <Link
              to="/business-calculators/wholesale-profit-margin-calculator"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">Wholesale Margin Calculator</div>
              <p className="text-[11px] text-slate-500">Batch margins, markups &amp; break-even</p>
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
