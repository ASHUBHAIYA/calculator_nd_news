import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Percent,
  Calculator,
  HelpCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Info,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { SeoHead } from '@/components/SeoHead';
import { formatINR, formatNumberIN } from '@/lib/formatters';
import {
  calculateWholesaleMargin,
  WholesaleMarginResult,
} from '@/lib/calculators/business';

export const WholesaleProfitMarginPage: React.FC = () => {
  // Inputs
  const [purchaseCost, setPurchaseCost] = useState<number>(350);
  const [sellingPrice, setSellingPrice] = useState<number>(500);
  const [quantity, setQuantity] = useState<number>(100);
  const [additionalExpenses, setAdditionalExpenses] = useState<number>(2500);
  const [sellingDiscountPct, setSellingDiscountPct] = useState<number>(5);
  const [targetMarginPct, setTargetMarginPct] = useState<number>(25);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const results: WholesaleMarginResult = calculateWholesaleMargin({
    purchaseCostPerUnit: purchaseCost,
    sellingPricePerUnit: sellingPrice,
    quantity,
    additionalExpenses,
    sellingDiscountPct,
    targetMarginPct,
  });

  const handleReset = () => {
    setPurchaseCost(350);
    setSellingPrice(500);
    setQuantity(100);
    setAdditionalExpenses(2500);
    setSellingDiscountPct(5);
    setTargetMarginPct(25);
  };

  const FAQS = [
    {
      q: 'What is the critical difference between profit margin and markup in wholesale trade?',
      a: 'Profit Margin is the percentage of total sales revenue that is profit [Margin = (Profit / Selling Price) × 100]. Markup is the percentage added on top of total cost [Markup = (Profit / Cost) × 100]. A 25% margin requires a 33.33% markup. Confusing the two often causes wholesalers to underprice goods and incur cash-flow losses.',
    },
    {
      q: 'How does this calculator account for trade discounts and overheads?',
      a: 'In Indian wholesale distribution, sellers frequently offer a bill discount (e.g. 5% trade discount) to incentivize bulk buyers or cash payments. Our engine subtracts the discount from the unit selling price first and adds your batch handling/transport overheads to determine real net profitability.',
    },
    {
      q: 'What is the break-even selling price?',
      a: 'The break-even selling price is the exact unit price you must charge so that total revenue precisely covers your purchase costs plus all attributable expenses (handling, Hamali, packaging, transportation) with zero profit and zero loss.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Wholesale Profit Margin Calculator | Margin vs Markup for Indian Traders"
        description="Calculate wholesale profit margins, markups, break-even unit selling prices, and target margins with bulk quantities and trade discounts."
        canonicalPath="/business-calculators/wholesale-profit-margin-calculator"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Business Calculators', path: '/business-calculators' },
          { name: 'Wholesale Profit Margin', path: '/business-calculators/wholesale-profit-margin-calculator' },
        ]}
        faqs={FAQS}
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <Percent className="w-3.5 h-3.5 text-emerald-600" />
                <span>Wholesale &amp; Distribution Suite</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
                Wholesale Profit Margin Calculator
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Determine batch revenue, operational expenses, profit margins, markups, and break-even selling prices for B2B bulk orders and distributor contracts.
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

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inputs Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Batch Order Inputs</h2>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Real-Time Engine
                </span>
              </div>

              {/* Purchase Cost */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Purchase Cost Per Unit (₹)</span>
                  <span className="text-[11px] font-normal text-slate-500">Net supplier price</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={purchaseCost || ''}
                    onChange={(e) => setPurchaseCost(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Selling Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Selling Price Per Unit (₹)</span>
                  <span className="text-[11px] font-normal text-slate-500">Listed wholesale rate</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={sellingPrice || ''}
                    onChange={(e) => setSellingPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Order Quantity (Units)</span>
                  <span className="text-[11px] font-normal text-slate-500">Total units in lot</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity || ''}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                />
              </div>

              {/* Additional Expenses */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Additional Lot Expenses (₹)</span>
                  <span className="text-[11px] font-normal text-slate-500">Packaging, transport, labor</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={additionalExpenses || ''}
                    onChange={(e) => setAdditionalExpenses(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Selling Discount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Optional Trade / Cash Discount (%)</span>
                  <span className="text-[11px] font-semibold text-slate-600">{sellingDiscountPct}%</span>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="0.5"
                    value={sellingDiscountPct}
                    onChange={(e) => setSellingDiscountPct(parseFloat(e.target.value))}
                    className="flex-1 accent-emerald-600 cursor-pointer"
                  />
                  <div className="relative w-24 shrink-0">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={sellingDiscountPct}
                      onChange={(e) => setSellingDiscountPct(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className="w-full pl-3 pr-7 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-900 text-right"
                    />
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                  </div>
                </div>
              </div>

              {/* Target Margin Goal */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Target Profit Margin (%)</span>
                  <span className="text-[11px] font-normal text-slate-500">Desired threshold</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    step="1"
                    value={targetMarginPct}
                    onChange={(e) => setTargetMarginPct(Math.min(99, Math.max(1, parseFloat(e.target.value) || 1)))}
                    className="w-full px-4 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 focus:bg-white"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Profitability Summary
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                  {quantity} Units Lot
                </span>
              </div>

              {/* Headline Net Profit */}
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">Total Net Profit</span>
                <div className="flex items-baseline gap-3">
                  <span
                    className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${
                      results.isLoss ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {formatINR(results.totalProfit)}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    ({formatINR(results.profitPerUnit, true)} / unit)
                  </span>
                </div>
                {results.isLoss && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-rose-300 bg-rose-950/60 border border-rose-800 px-2.5 py-1 rounded-lg mt-2">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Selling price is below total landed cost. You are operating at a loss.</span>
                  </div>
                )}
              </div>

              {/* Profit Margin vs Markup Highlight Cards */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block font-medium">Profit Margin</span>
                  <span className="text-2xl font-black text-white font-mono mt-0.5 block">
                    {results.profitMarginPct.toFixed(2)}%
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Profit ÷ Revenue
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                  <span className="text-[11px] text-slate-400 block font-medium">Markup Percentage</span>
                  <span className="text-2xl font-black text-amber-400 font-mono mt-0.5 block">
                    {results.markupPct.toFixed(2)}%
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Profit ÷ Total Cost
                  </span>
                </div>
              </div>

              {/* Breakdown List */}
              <div className="divide-y divide-slate-800/80 text-xs pt-2">
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-400">Total Purchase Cost:</span>
                  <span className="font-mono font-bold text-slate-200">{formatINR(results.totalPurchaseCost)}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-400">Additional Expenses:</span>
                  <span className="font-mono font-bold text-slate-200">{formatINR(results.totalExpenses)}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-400">Total Landed Batch Cost:</span>
                  <span className="font-mono font-bold text-slate-200">{formatINR(results.totalCostOfGoodsAndOps)}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-400">Total Net Revenue (Post Discount):</span>
                  <span className="font-mono font-bold text-emerald-400">{formatINR(results.totalRevenue)}</span>
                </div>
                <div className="py-2.5 flex items-center justify-between">
                  <span className="text-slate-400">Effective Unit Selling Price:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {formatINR(results.effectiveSellingPricePerUnit, true)}
                  </span>
                </div>
              </div>

              {/* Critical Benchmarks Box */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-2 text-xs">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>Break-Even Selling Price:</span>
                  <span className="font-mono text-sm text-white">
                    {formatINR(results.breakEvenSellingPrice, true)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>Price for {targetMarginPct}% Margin:</span>
                  <span className="font-mono text-sm text-emerald-400">
                    {formatINR(results.sellingPriceForTargetMargin, true)}
                  </span>
                </div>
              </div>
            </div>

            {/* Margin vs Markup Quick Guide Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold">
                <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Why Margin and Markup Are Not Equal</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                If you buy an item for <strong>₹100</strong> and sell it for <strong>₹125</strong>, your profit is ₹25. Your <strong>Markup</strong> is 25% (₹25 ÷ ₹100), but your <strong>Profit Margin</strong> is only 20% (₹25 ÷ ₹125). Margin is always lower than Markup for positive profits.
              </p>
            </div>
          </div>
        </div>

        {/* Educational Content & Statutory Formula */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              Commercial Formulas for Indian Wholesale &amp; Retail Pricing
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Wholesalers in APMC mandis, textile hubs (Surat, Tirupur), electronics bazaars (Nehru Place, Lamington Road), and industrial distribution centers must protect margins against rising logistics and hamali costs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1.5">
              <span className="font-bold text-slate-900 font-sans block">Profit Margin Formula</span>
              <p className="text-emerald-700 font-semibold">
                Margin (%) = [(Net Revenue - Total Costs) ÷ Net Revenue] × 100
              </p>
              <p className="text-[11px] text-slate-500 font-sans">
                Shows the percentage of gross sales that converts into operating cash profit.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1.5">
              <span className="font-bold text-slate-900 font-sans block">Markup Formula</span>
              <p className="text-blue-700 font-semibold">
                Markup (%) = [(Net Revenue - Total Costs) ÷ Total Costs] × 100
              </p>
              <p className="text-[11px] text-slate-500 font-sans">
                Shows the percentage rate added on top of your procurement expenditure.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Frequently Asked Questions on Wholesale Pricing
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
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
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
