import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  HelpCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SeoHead } from '@/components/SeoHead';
import { formatINR, formatNumberIN } from '@/lib/formatters';
import {
  compareSupplierOffers,
  SupplierOfferInput,
  OfferComparisonResult,
  SchemeType,
} from '@/lib/calculators/business';

export const SupplierSchemePage: React.FC = () => {
  // Offer A (Default: Buy 10 Get 1 Free)
  const [nameA, setNameA] = useState('Supplier A (Quantity Free Scheme)');
  const [schemeTypeA, setSchemeTypeA] = useState<SchemeType>('buy_x_get_y');
  const [basePriceA, setBasePriceA] = useState(100);
  const [orderQtyA, setOrderQtyA] = useState(10);
  const [freeQtyA, setFreeQtyA] = useState(1);
  const [discountPctA, setDiscountPctA] = useState(0);
  const [fixedDiscA, setFixedDiscA] = useState(0);
  const [expensesA, setExpensesA] = useState(50);

  // Offer B (Default: 10% Cash/Trade Discount)
  const [nameB, setNameB] = useState('Supplier B (Cash Discount Offer)');
  const [schemeTypeB, setSchemeTypeB] = useState<SchemeType>('percentage_discount');
  const [basePriceB, setBasePriceB] = useState(100);
  const [orderQtyB, setOrderQtyB] = useState(11);
  const [freeQtyB, setFreeQtyB] = useState(0);
  const [discountPctB, setDiscountPctB] = useState(10);
  const [fixedDiscB, setFixedDiscB] = useState(0);
  const [expensesB, setExpensesB] = useState(50);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const offerInputA: SupplierOfferInput = {
    name: nameA,
    schemeType: schemeTypeA,
    basePricePerUnit: basePriceA,
    orderQuantity: orderQtyA,
    freeQuantity: freeQtyA,
    discountPercentage: discountPctA,
    fixedDiscountPerUnit: fixedDiscA,
    additionalExpenses: expensesA,
  };

  const offerInputB: SupplierOfferInput = {
    name: nameB,
    schemeType: schemeTypeB,
    basePricePerUnit: basePriceB,
    orderQuantity: orderQtyB,
    freeQuantity: freeQtyB,
    discountPercentage: discountPctB,
    fixedDiscountPerUnit: fixedDiscB,
    additionalExpenses: expensesB,
  };

  const comparison: OfferComparisonResult = compareSupplierOffers(offerInputA, offerInputB);

  const handleReset = () => {
    setNameA('Supplier A (Quantity Free Scheme)');
    setSchemeTypeA('buy_x_get_y');
    setBasePriceA(100);
    setOrderQtyA(10);
    setFreeQtyA(1);
    setDiscountPctA(0);
    setFixedDiscA(0);
    setExpensesA(50);

    setNameB('Supplier B (Cash Discount Offer)');
    setSchemeTypeB('percentage_discount');
    setBasePriceB(100);
    setOrderQtyB(11);
    setFreeQtyB(0);
    setDiscountPctB(10);
    setFixedDiscB(0);
    setExpensesB(50);
  };

  const FAQS = [
    {
      q: 'Why is "Buy 10, Get 1 Free" often confused with a 10% discount?',
      a: 'In a "Buy 10, Get 1 Free" scheme, you receive 11 units while paying for 10. Your effective discount is 1 ÷ 11 = 9.09%, not 10%. Conversely, a true 10% discount gives you 10% off the total bill. Over large wholesale volumes (e.g. ₹5,00,000 procurement), that 0.91% discrepancy represents ₹4,550 in pure profit.',
    },
    {
      q: 'How does this tool handle "Buy 100, Get 10 Free" and FMCG trade promotions?',
      a: 'You can input any lot size (e.g., 100 paid units + 10 free units) and immediately view the effective cost per unit received. You can also benchmark this directly against a competing distributor offering an upfront percentage discount (CD) or fixed rupee cash back per unit.',
    },
    {
      q: 'Should I factor in freight charges when comparing supplier offers?',
      a: 'Yes. Often one supplier quotes free delivery while another offers a cheaper unit rate but charges ₹1,500 for freight and Hamali. Our calculator incorporates additional expenses into both offers to reveal the genuine net landed cost per unit.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Supplier Scheme Calculator | Compare Buy X Get Y vs Cash Discount"
        description="Compare supplier trade offers: Buy 10 Get 1 free, Buy 100 Get 10 free, percentage trade discounts, and fixed rupee discounts with side-by-side analysis."
        canonicalPath="/business-calculators/supplier-scheme-calculator"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Business Calculators', path: '/business-calculators' },
          { name: 'Supplier Scheme Calculator', path: '/business-calculators/supplier-scheme-calculator' },
        ]}
        faqs={FAQS}
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Trade Procurement &amp; Vendor Comparison</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
                Supplier Scheme Calculator
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Compare FMCG, pharma, and retail vendor offers side-by-side: evaluate &quot;Buy 10, Get 1 Free&quot; schemes against upfront percentage or fixed cash discounts.
              </p>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 text-xs font-bold shadow-xs transition-all cursor-pointer self-start md:self-auto"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Reset Offers</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        {/* Comparison Banner */}
        <div
          className={`p-6 rounded-3xl border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            comparison.betterOffer === 'A'
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
              : comparison.betterOffer === 'B'
              ? 'bg-blue-50/80 border-blue-200 text-blue-950'
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Best Vendor Offer Result</span>
            </div>
            <div className="text-xl sm:text-2xl font-black font-display">
              {comparison.betterOffer === 'TIE'
                ? 'Both Offers Are Mathematically Equal'
                : `${comparison.betterOffer === 'A' ? offerInputA.name : offerInputB.name} is More Economical`}
            </div>
            <p className="text-xs sm:text-sm text-slate-600">{comparison.summaryText}</p>
          </div>

          <div className="shrink-0 flex items-center gap-4 bg-white/90 px-5 py-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-semibold uppercase">Cost Delta</span>
              <span className="text-lg font-black text-slate-900 font-mono">
                ₹{comparison.costDifferencePerUnit.toFixed(2)} / unit
              </span>
            </div>
          </div>
        </div>

        {/* Side-by-Side Offer Inputs & Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Offer A Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Offer A Configuration
              </span>
              {comparison.betterOffer === 'A' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cheapest Option</span>
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Offer Label</label>
                <input
                  type="text"
                  value={nameA}
                  onChange={(e) => setNameA(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Scheme Promotion Type</label>
                <select
                  value={schemeTypeA}
                  onChange={(e) => setSchemeTypeA(e.target.value as SchemeType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50/50 cursor-pointer"
                >
                  <option value="buy_x_get_y">Buy X Get Y Free (e.g. Buy 10 Get 1)</option>
                  <option value="percentage_discount">Percentage Trade Discount (%)</option>
                  <option value="fixed_discount_per_unit">Fixed Discount Per Unit (₹)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Base Price / Unit (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={basePriceA || ''}
                    onChange={(e) => setBasePriceA(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-900 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Paid Order Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={orderQtyA || ''}
                    onChange={(e) => setOrderQtyA(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-900 bg-slate-50/50"
                  />
                </div>
              </div>

              {schemeTypeA === 'buy_x_get_y' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Free Quantity Provided</label>
                  <input
                    type="number"
                    min="0"
                    value={freeQtyA || ''}
                    onChange={(e) => setFreeQtyA(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-900 bg-slate-50/50"
                  />
                </div>
              )}

              {schemeTypeA === 'percentage_discount' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={discountPctA || ''}
                    onChange={(e) => setDiscountPctA(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-900 bg-slate-50/50"
                  />
                </div>
              )}

              {schemeTypeA === 'fixed_discount_per_unit' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fixed Discount / Unit (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={fixedDiscA || ''}
                    onChange={(e) => setFixedDiscA(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-900 bg-slate-50/50"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Freight / Other Expenses (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={expensesA || ''}
                  onChange={(e) => setExpensesA(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-900 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Offer A Results Box */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-950 text-white space-y-2">
                <span className="text-[11px] text-emerald-400 block font-medium">Effective Cost Per Unit</span>
                <div className="text-3xl font-black font-mono">
                  {formatINR(comparison.offerA.effectiveCostPerUnit, true)}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-slate-800">
                  <span>Effective Discount Rate:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {comparison.offerA.effectiveDiscountPct.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 divide-y divide-slate-100">
                <div className="pt-1.5 flex justify-between">
                  <span>Total Units Received:</span>
                  <span className="font-bold text-slate-900">{comparison.offerA.totalQuantityReceived} units</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span>Gross Cost:</span>
                  <span className="font-mono text-slate-900">{formatINR(comparison.offerA.grossAmount)}</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span>Scheme Discount:</span>
                  <span className="font-mono text-emerald-700 font-bold">-{formatINR(comparison.offerA.schemeDiscountAmount)}</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span>Net Payable to Vendor:</span>
                  <span className="font-mono font-bold text-slate-900">{formatINR(comparison.offerA.netTotalCost)}</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span>Total Calculated Savings:</span>
                  <span className="font-mono font-bold text-emerald-700">{formatINR(comparison.offerA.totalSavings)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Offer B Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Offer B Configuration
              </span>
              {comparison.betterOffer === 'B' && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cheapest Option</span>
                </span>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Offer Label</label>
                <input
                  type="text"
                  value={nameB}
                  onChange={(e) => setNameB(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50/50"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Scheme Promotion Type</label>
                <select
                  value={schemeTypeB}
                  onChange={(e) => setSchemeTypeB(e.target.value as SchemeType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50/50 cursor-pointer"
                >
                  <option value="buy_x_get_y">Buy X Get Y Free (e.g. Buy 10 Get 1)</option>
                  <option value="percentage_discount">Percentage Trade Discount (%)</option>
                  <option value="fixed_discount_per_unit">Fixed Discount Per Unit (₹)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Base Price / Unit (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={basePriceB || ''}
                    onChange={(e) => setBasePriceB(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-900 bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Paid Order Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={orderQtyB || ''}
                    onChange={(e) => setOrderQtyB(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-900 bg-slate-50/50"
                  />
                </div>
              </div>

              {schemeTypeB === 'buy_x_get_y' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Free Quantity Provided</label>
                  <input
                    type="number"
                    min="0"
                    value={freeQtyB || ''}
                    onChange={(e) => setFreeQtyB(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-900 bg-slate-50/50"
                  />
                </div>
              )}

              {schemeTypeB === 'percentage_discount' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={discountPctB || ''}
                    onChange={(e) => setDiscountPctB(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-900 bg-slate-50/50"
                  />
                </div>
              )}

              {schemeTypeB === 'fixed_discount_per_unit' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fixed Discount / Unit (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={fixedDiscB || ''}
                    onChange={(e) => setFixedDiscB(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-900 bg-slate-50/50"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-slate-700 block mb-1">Freight / Other Expenses (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={expensesB || ''}
                  onChange={(e) => setExpensesB(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-900 bg-slate-50/50"
                />
              </div>
            </div>

            {/* Offer B Results Box */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="p-4 rounded-2xl bg-blue-950 text-white space-y-2">
                <span className="text-[11px] text-blue-400 block font-medium">Effective Cost Per Unit</span>
                <div className="text-3xl font-black font-mono">
                  {formatINR(comparison.offerB.effectiveCostPerUnit, true)}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 pt-1 border-t border-slate-800">
                  <span>Effective Discount Rate:</span>
                  <span className="font-mono font-bold text-blue-400">
                    {comparison.offerB.effectiveDiscountPct.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 divide-y divide-slate-100">
                <div className="pt-1.5 flex justify-between">
                  <span>Total Units Received:</span>
                  <span className="font-bold text-slate-900">{comparison.offerB.totalQuantityReceived} units</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span>Gross Cost:</span>
                  <span className="font-mono text-slate-900">{formatINR(comparison.offerB.grossAmount)}</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span>Scheme Discount:</span>
                  <span className="font-mono text-blue-700 font-bold">-{formatINR(comparison.offerB.schemeDiscountAmount)}</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span>Net Payable to Vendor:</span>
                  <span className="font-mono font-bold text-slate-900">{formatINR(comparison.offerB.netTotalCost)}</span>
                </div>
                <div className="pt-1.5 flex justify-between">
                  <span>Total Calculated Savings:</span>
                  <span className="font-mono font-bold text-blue-700">{formatINR(comparison.offerB.totalSavings)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <section className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Frequently Asked Questions on Supplier Schemes
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
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-slate-900 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
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
