import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  HelpCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Percent,
  CheckCircle2,
  Info,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { SeoHead } from '@/components/SeoHead';
import { formatINR, formatNumberIN } from '@/lib/formatters';
import {
  calculateMarginVsMarkup,
  MarginMarkupMode,
  MarginVsMarkupResult,
} from '@/lib/calculators/business';

export const MarginVsMarkupPage: React.FC = () => {
  const [costPrice, setCostPrice] = useState(800);
  const [mode, setMode] = useState<MarginMarkupMode>('by_selling_price');
  const [sellingPrice, setSellingPrice] = useState(1000);
  const [desiredMarginPct, setDesiredMarginPct] = useState(25);
  const [desiredMarkupPct, setDesiredMarkupPct] = useState(33.33);
  const [additionalCosts, setAdditionalCosts] = useState(50);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const results: MarginVsMarkupResult = calculateMarginVsMarkup({
    costPrice,
    mode,
    sellingPrice,
    desiredMarginPct,
    desiredMarkupPct,
    additionalCosts,
  });

  const handleReset = () => {
    setCostPrice(800);
    setMode('by_selling_price');
    setSellingPrice(1000);
    setDesiredMarginPct(25);
    setDesiredMarkupPct(33.33);
    setAdditionalCosts(50);
  };

  const FAQS = [
    {
      q: 'What is the fundamental mathematical difference between margin and markup?',
      a: 'Margin is calculated relative to sales revenue: Margin = (Profit ÷ Selling Price) × 100. Markup is calculated relative to cost price: Markup = (Profit ÷ Cost Price) × 100. Margin can never exceed 100%, whereas markup can easily be 200%, 500%, or more. To achieve a 50% margin, you need a 100% markup (doubling your cost).',
    },
    {
      q: 'Can you show a simple numerical example explaining the difference?',
      a: 'Consider a garment that costs you ₹100 to produce, and you sell it for ₹150. Your profit is ₹50. Your Markup is (₹50 ÷ ₹100) × 100 = 50%. However, your Profit Margin is (₹50 ÷ ₹150) × 100 = 33.33%. If a retailer gives a customer a 40% discount assuming they had a 50% "margin", they actually sell at a steep loss!',
    },
    {
      q: 'How do I convert between Margin and Markup?',
      a: 'Margin to Markup: Markup = Margin ÷ (1 - Margin). For example, 20% margin is 0.20 ÷ 0.80 = 25% markup. Markup to Margin: Margin = Markup ÷ (1 + Markup). For example, 25% markup is 0.25 ÷ 1.25 = 20% margin.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Margin vs Markup Calculator | Formula & Numerical Examples"
        description="Convert easily between profit margin and markup percentage. Determine required retail selling prices with worked numerical examples."
        canonicalPath="/business-calculators/margin-vs-markup-calculator"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Business Calculators', path: '/business-calculators' },
          { name: 'Margin vs Markup', path: '/business-calculators/margin-vs-markup-calculator' },
        ]}
        faqs={FAQS}
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold">
                <Scale className="w-3.5 h-3.5 text-purple-600" />
                <span>Retail Pricing &amp; Margin Calibration</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
                Margin vs Markup Calculator
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Understand the crucial commercial difference between profit margin and cost markup to protect your bottom line and set accurate retail prices.
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
                <h2 className="text-base font-bold text-slate-900">Pricing Parameters</h2>
                <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  Instant Conversion
                </span>
              </div>

              {/* Mode Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Calculation Method</label>
                <div className="grid grid-cols-3 gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setMode('by_selling_price')}
                    className={`py-2 px-2 rounded-xl font-bold transition-all cursor-pointer text-center ${
                      mode === 'by_selling_price'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Known Price
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('by_desired_margin')}
                    className={`py-2 px-2 rounded-xl font-bold transition-all cursor-pointer text-center ${
                      mode === 'by_desired_margin'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Target Margin
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('by_desired_markup')}
                    className={`py-2 px-2 rounded-xl font-bold transition-all cursor-pointer text-center ${
                      mode === 'by_desired_markup'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Target Markup
                  </button>
                </div>
              </div>

              {/* Cost Price */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Cost Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={costPrice || ''}
                    onChange={(e) => setCostPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Dynamic input depending on mode */}
              {mode === 'by_selling_price' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Actual Selling Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={sellingPrice || ''}
                      onChange={(e) => setSellingPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {mode === 'by_desired_margin' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Desired Profit Margin (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="99.9"
                      step="0.5"
                      value={desiredMarginPct || ''}
                      onChange={(e) => setDesiredMarginPct(Math.min(99.9, Math.max(0, parseFloat(e.target.value) || 0)))}
                      className="w-full px-4 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50 focus:bg-white"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                  </div>
                </div>
              )}

              {mode === 'by_desired_markup' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Desired Cost Markup (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={desiredMarkupPct || ''}
                      onChange={(e) => setDesiredMarkupPct(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-4 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50 focus:bg-white"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">%</span>
                  </div>
                </div>
              )}

              {/* Optional Additional Costs */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Additional Overhead / Unit Costs (₹)</span>
                  <span className="text-[11px] font-normal text-slate-500">Packaging, commission</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={additionalCosts || ''}
                    onChange={(e) => setAdditionalCosts(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Margin vs Markup Comparison
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                  Calculated
                </span>
              </div>

              {/* Headline Final Selling Price */}
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">Resulting Selling Price</span>
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                  {formatINR(results.sellingPrice, true)}
                </div>
                <span className="text-xs text-slate-400 block pt-1">
                  Profit: <span className="text-emerald-400 font-bold font-mono">{formatINR(results.profitAmount, true)}</span> per unit
                </span>
              </div>

              {/* Parallel Comparison Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-xs text-purple-300 font-bold block">Profit Margin</span>
                  <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                    {results.profitMarginPct.toFixed(2)}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Formula: Profit ÷ Selling Price
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                  <span className="text-xs text-amber-300 font-bold block">Cost Markup</span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono block">
                    {results.markupPct.toFixed(2)}%
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Formula: Profit ÷ Cost Price
                  </span>
                </div>
              </div>

              {/* Price Benchmarks Table */}
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 space-y-3 text-xs">
                <span className="font-bold text-slate-300 block">
                  Quick Benchmark Comparison (Base Cost: {formatINR(results.totalCost)})
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Required for a <strong>20% Margin</strong>:</span>
                    <span className="font-mono font-bold text-purple-300">
                      {formatINR(results.sellingPriceFor20Margin, true)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Required for a <strong>20% Markup</strong>:</span>
                    <span className="font-mono font-bold text-amber-300">
                      {formatINR(results.sellingPriceFor20Markup, true)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Numerical Example Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 text-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Info className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Simple Numerical Example</span>
              </div>
              <div className="space-y-2 text-slate-600 leading-relaxed">
                <p>
                  Imagine buying an item for <strong>₹100</strong> and selling it for <strong>₹125</strong>:
                </p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] space-y-1">
                  <div>Profit = ₹125 - ₹100 = <strong>₹25</strong></div>
                  <div>Markup = (₹25 ÷ ₹100) × 100 = <strong className="text-amber-700">25.0%</strong></div>
                  <div>Margin = (₹25 ÷ ₹125) × 100 = <strong className="text-purple-700">20.0%</strong></div>
                </div>
                <p>
                  Because the selling price (₹125) is higher than the cost price (₹100), the denominator for margin is larger. Thus, <strong>Margin will always be smaller than Markup</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <section className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Frequently Asked Questions on Margin &amp; Markup
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
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-slate-900 hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-purple-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
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
