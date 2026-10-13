import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  HelpCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Percent,
  CheckCircle2,
  Info,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import { SeoHead } from '@/components/SeoHead';
import { formatINR, formatNumberIN } from '@/lib/formatters';
import {
  calculateGstPrice,
  GstCalculationMode,
  GstCalculationResult,
} from '@/lib/calculators/business';

const GST_RATES = [
  { rate: 0, label: '0% (Exempted / Nil)' },
  { rate: 3, label: '3% (Gold & Bullion)' },
  { rate: 5, label: '5% (Essential Goods & Transport)' },
  { rate: 12, label: '12% (Processed Food & Apparels)' },
  { rate: 18, label: '18% (Standard Services & Goods)' },
  { rate: 28, label: '28% (Luxury & Sin Goods)' },
];

export const GstInclusivePricePage: React.FC = () => {
  const [amount, setAmount] = useState(11800);
  const [gstRate, setGstRate] = useState(18);
  const [mode, setMode] = useState<GstCalculationMode>('inclusive');
  const [transactionType, setTransactionType] = useState<'intra_state' | 'inter_state'>('intra_state');

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const results: GstCalculationResult = calculateGstPrice({
    amount,
    gstRatePct: gstRate,
    mode,
    transactionType,
  });

  const handleReset = () => {
    setAmount(11800);
    setGstRate(18);
    setMode('inclusive');
    setTransactionType('intra_state');
  };

  const FAQS = [
    {
      q: 'How is the base taxable amount reverse-calculated from a GST-inclusive price?',
      a: 'When an MRP or customer price already includes GST (e.g. ₹11,800 at 18% GST), the taxable base is NOT calculated by subtracting 18% from ₹11,800. The correct statutory formula is: Taxable Value = Total Inclusive Price ÷ (1 + GST Rate / 100). Here, ₹11,800 ÷ 1.18 = ₹10,000, and the GST amount is ₹1,800.',
    },
    {
      q: 'What is the difference between Intra-State (CGST + SGST) and Inter-State (IGST)?',
      a: 'For sales within the same state (Intra-State), the total GST is split equally between Central GST (CGST) and State GST (SGST) — for example, 9% CGST + 9% SGST on an 18% item. For sales between two different Indian states (Inter-State), the entire 18% is billed as Integrated GST (IGST).',
    },
    {
      q: 'Which GST rate applies to my product or service?',
      a: 'GST rates in India depend on the 4, 6, or 8-digit HSN/SAC code assigned by the CBIC: 0% (unbranded food, healthcare), 3% (gold, silver, precious stones), 5% (packaged staples, economy dining), 12% (medicines, select textiles), 18% (commercial software, consulting, most electronics), and 28% (automobiles, air conditioners). Always verify your specific HSN code.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="GST-Inclusive Price Calculator | Reverse GST & Taxable Value Engine"
        description="Calculate taxable base value from GST-inclusive prices, or add GST to exclusive prices. Supports 3%, 5%, 12%, 18%, 28% slabs with CGST/SGST/IGST breakdown."
        canonicalPath="/business-calculators/gst-inclusive-price-calculator"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Business Calculators', path: '/business-calculators' },
          { name: 'GST-Inclusive Price Calculator', path: '/business-calculators/gst-inclusive-price-calculator' },
        ]}
        faqs={FAQS}
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold">
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>Statutory Goods &amp; Services Tax (GST) Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
                GST-Inclusive Price Calculator
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Reverse-calculate the net taxable value and GST split from MRP/inclusive bills, or add GST to wholesale prices across all CBIC statutory slabs.
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
                <h2 className="text-base font-bold text-slate-900">Tax Invoice Inputs</h2>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  CBIC Rules Compliant
                </span>
              </div>

              {/* Mode Toggle: Inclusive vs Exclusive */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Calculation Direction</label>
                <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setMode('inclusive')}
                    className={`py-2 px-3 rounded-xl font-bold transition-all cursor-pointer text-center ${
                      mode === 'inclusive'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    GST Inclusive (Extract Tax)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('exclusive')}
                    className={`py-2 px-3 rounded-xl font-bold transition-all cursor-pointer text-center ${
                      mode === 'exclusive'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    GST Exclusive (Add Tax)
                  </button>
                </div>
              </div>

              {/* Entered Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  {mode === 'inclusive' ? 'Total Amount (Including GST) (₹)' : 'Taxable Base Amount (Before GST) (₹)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={amount || ''}
                    onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Statutory GST Rate Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Applicable GST Slab Rate (%)</span>
                  <span className="text-xs font-bold text-teal-700">{gstRate}% Rate</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {GST_RATES.map((slab) => (
                    <button
                      key={slab.rate}
                      type="button"
                      onClick={() => setGstRate(slab.rate)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-center ${
                        gstRate === slab.rate
                          ? 'bg-teal-50 border-teal-300 text-teal-800 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {slab.rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction Type: Intra-State vs Inter-State */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 block">Transaction Territory</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setTransactionType('intra_state')}
                    className={`p-3 rounded-xl border font-bold text-left transition-colors cursor-pointer ${
                      transactionType === 'intra_state'
                        ? 'bg-teal-50 border-teal-300 text-teal-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div>Intra-State Sale</div>
                    <div className="text-[10px] font-normal text-slate-500 mt-0.5">CGST ({gstRate / 2}%) + SGST ({gstRate / 2}%)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTransactionType('inter_state')}
                    className={`p-3 rounded-xl border font-bold text-left transition-colors cursor-pointer ${
                      transactionType === 'inter_state'
                        ? 'bg-teal-50 border-teal-300 text-teal-900'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div>Inter-State Sale</div>
                    <div className="text-[10px] font-normal text-slate-500 mt-0.5">Integrated IGST ({gstRate}%)</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                  Tax Invoice Breakdown
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                  {gstRate}% Slab Rate
                </span>
              </div>

              {/* Headline Taxable Base */}
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">Net Taxable Value (Base)</span>
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                  {formatINR(results.taxableAmount, true)}
                </div>
                <span className="text-xs text-slate-400 block pt-1">
                  Excludes all GST levies
                </span>
              </div>

              {/* Total GST Card */}
              <div className="p-4 rounded-2xl bg-teal-950/60 border border-teal-800/80 space-y-1">
                <span className="text-[11px] text-teal-300 block font-medium">Total GST Payable / Charged</span>
                <span className="text-2xl font-black text-teal-300 font-mono block">
                  {formatINR(results.totalGstAmount, true)}
                </span>
              </div>

              {/* Tax Component Splitting */}
              <div className="divide-y divide-slate-800/80 text-xs pt-1">
                {transactionType === 'intra_state' ? (
                  <>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">Central GST (CGST @ {(gstRate / 2).toFixed(1)}%):</span>
                      <span className="font-mono text-slate-200 font-bold">{formatINR(results.cgstAmount, true)}</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-400">State GST (SGST @ {(gstRate / 2).toFixed(1)}%):</span>
                      <span className="font-mono text-slate-200 font-bold">{formatINR(results.sgstAmount, true)}</span>
                    </div>
                  </>
                ) : (
                  <div className="py-2.5 flex justify-between">
                    <span className="text-slate-400">Integrated GST (IGST @ {gstRate}%):</span>
                    <span className="font-mono text-teal-300 font-bold">{formatINR(results.igstAmount, true)}</span>
                  </div>
                )}
                <div className="py-2.5 flex justify-between font-bold text-white text-sm">
                  <span>Total Final Amount (incl. GST):</span>
                  <span className="font-mono text-teal-300">{formatINR(results.totalIncludingGst, true)}</span>
                </div>
              </div>
            </div>

            {/* Statutory Formula Explanation Box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Info className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Statutory GST Formula</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>Inclusive Reverse Math:</strong> Taxable Value = Total Inclusive Price ÷ (1 + GST Rate ÷ 100).<br />
                <strong>Exclusive Math:</strong> Total Amount = Taxable Base × (1 + GST Rate ÷ 100).
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <section className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Frequently Asked Questions on GST Billing
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
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-slate-900 hover:text-teal-700 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-teal-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
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
