import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  HelpCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Clock,
  TrendingDown,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';
import { SeoHead } from '@/components/SeoHead';
import { formatINR, formatNumberIN } from '@/lib/formatters';
import {
  calculateCreditSaleCost,
  CreditSaleCostResult,
} from '@/lib/calculators/business';

export const CreditSaleCostPage: React.FC = () => {
  const [invoiceAmount, setInvoiceAmount] = useState(250000);
  const [creditPeriodDays, setCreditPeriodDays] = useState(45);
  const [annualFinancingRate, setAnnualFinancingRate] = useState(13.5);
  const [adminCosts, setAdminCosts] = useState(1500);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const results: CreditSaleCostResult = calculateCreditSaleCost({
    invoiceAmount,
    creditPeriodDays,
    annualFinancingRatePct: annualFinancingRate,
    collectionAdminCosts: adminCosts,
  });

  const handleReset = () => {
    setInvoiceAmount(250000);
    setCreditPeriodDays(45);
    setAnnualFinancingRate(13.5);
    setAdminCosts(1500);
  };

  const FAQS = [
    {
      q: 'Why does offering credit terms (30/60/90 days) cost the seller money?',
      a: 'When you deliver goods on credit, your own capital is tied up in accounts receivable (debtors). If you borrow from a bank (Cash Credit / Overdraft facility at 11% to 14% p.a.) or face opportunity cost, financing that invoice directly drains your net profit. A ₹2,50,000 bill on 60 days credit at 13.5% costs over ₹5,500 in hidden interest alone.',
    },
    {
      q: 'Should I offer a Cash Discount (CD) instead of 45-day credit?',
      a: 'Frequently yes! If funding a 45-day invoice costs you 2% of total invoice value (including follow-up overhead and default risk), offering an immediate 1.5% or 2% Cash Discount for payment within 2 days accelerates cash flow, eliminates bad debts, and maintains similar net proceeds.',
    },
    {
      q: 'Are the figures calculated here binding legal or banking fees?',
      a: 'No. All calculations are mathematical estimates based on user-entered financing rates and administrative inputs. They illustrate the hidden economic carrying cost of trade credit to help Indian MSMEs negotiate better commercial payment terms.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Credit Sale Cost Calculator | Working Capital & Trade Debtors Cost"
        description="Calculate the true financing and administrative carrying costs of offering 30, 45, 60, or 90 days credit to buyers with net proceeds analysis."
        canonicalPath="/business-calculators/credit-sale-cost-calculator"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Business Calculators', path: '/business-calculators' },
          { name: 'Credit Sale Cost Calculator', path: '/business-calculators/credit-sale-cost-calculator' },
        ]}
        faqs={FAQS}
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
                <CreditCard className="w-3.5 h-3.5 text-rose-600" />
                <span>Working Capital &amp; Trade Credit Analysis</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
                Credit Sale Cost Calculator
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Estimate the hidden carrying and financing cost of extending 30, 45, 60, or 90 days payment terms to buyers against your bank CC/OD borrowing rates.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold shadow-xs transition-all cursor-pointer self-start md:self-auto"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Reset Values</span>
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
                <h2 className="text-base font-bold text-slate-900">Credit Term Parameters</h2>
                <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  Carrying Cost Model
                </span>
              </div>

              {/* Invoice Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Invoice / Bill Value (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="5000"
                    value={invoiceAmount || ''}
                    onChange={(e) => setInvoiceAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Credit Period Days */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Credit Period (Days)</span>
                  <span className="text-xs font-bold text-rose-700">{creditPeriodDays} Days</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="7"
                    max="180"
                    step="1"
                    value={creditPeriodDays}
                    onChange={(e) => setCreditPeriodDays(parseInt(e.target.value, 10))}
                    className="flex-1 accent-rose-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={creditPeriodDays || ''}
                    onChange={(e) => setCreditPeriodDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-20 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 text-right"
                  />
                </div>
                {/* Preset Chips */}
                <div className="flex items-center gap-2 pt-1">
                  {[15, 30, 45, 60, 90, 120].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setCreditPeriodDays(days)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                        creditPeriodDays === days
                          ? 'bg-rose-50 border-rose-300 text-rose-800'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Annual Financing Rate */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Annual Working Capital Borrowing Rate (% p.a.)</span>
                  <span className="text-[11px] font-normal text-slate-500">Bank CC/OD rate</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    step="0.25"
                    value={annualFinancingRate || ''}
                    onChange={(e) => setAnnualFinancingRate(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-4 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50/50 focus:bg-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                </div>
              </div>

              {/* Collection & Administrative Costs */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Collection &amp; Recovery Admin Costs (₹)</span>
                  <span className="text-[11px] font-normal text-slate-500">Optional follow-up fees</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={adminCosts || ''}
                    onChange={(e) => setAdminCosts(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-500 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Carrying Cost Analysis
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                  {creditPeriodDays} Days Credit
                </span>
              </div>

              {/* Headline Credit Cost */}
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">Total Estimated Credit Cost</span>
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-rose-400">
                  {formatINR(results.totalEstimatedCreditCost)}
                </div>
                <span className="text-xs text-slate-400 block pt-1">
                  Represents <strong className="text-white font-mono">{results.creditCostPercentage.toFixed(2)}%</strong> of your total invoice value
                </span>
              </div>

              {/* Net Proceeds */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Estimated Net Proceeds Realized</span>
                <span className="text-2xl font-black text-white font-mono block">
                  {formatINR(results.estimatedNetProceeds)}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Amount retained after factoring interest &amp; collection overhead
                </span>
              </div>

              {/* Itemization */}
              <div className="divide-y divide-slate-800/80 text-xs pt-1">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Gross Invoice Face Value:</span>
                  <span className="font-mono text-slate-200">{formatINR(results.invoiceAmount)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Estimated Working Capital Interest:</span>
                  <span className="font-mono text-rose-400 font-bold">-{formatINR(results.estimatedFinancingCost)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Collection &amp; Recovery Admin:</span>
                  <span className="font-mono text-rose-400 font-bold">-{formatINR(results.collectionAdminCosts)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Annualized Carrying Rate:</span>
                  <span className="font-mono text-amber-400 font-bold">{results.annualizedCostPct.toFixed(2)}% p.a.</span>
                </div>
              </div>

              {/* Statutory / Disclaimer Notice */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/80 flex items-start gap-2.5 text-xs text-slate-400">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px]">
                  <strong>Disclaimer:</strong> Results are mathematical estimates based on user inputs. Actual banking interest, compounding frequencies, and recovery costs vary by lender and agreement.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <section className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Frequently Asked Questions on Trade Credit
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-slate-900 hover:text-rose-700 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-rose-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
