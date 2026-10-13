import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  HelpCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Package,
  ShieldCheck,
  FileText,
  Info,
} from 'lucide-react';
import { SeoHead } from '@/components/SeoHead';
import { formatINR, formatNumberIN } from '@/lib/formatters';
import {
  calculateLandedCost,
  LandedCostResult,
} from '@/lib/calculators/business';

export const LandedCostPage: React.FC = () => {
  // Inputs
  const [purchasePrice, setPurchasePrice] = useState(450);
  const [quantity, setQuantity] = useState(500);
  const [freightCharges, setFreightCharges] = useState(6500);
  const [loadingUnloading, setLoadingUnloading] = useState(1500);
  const [packagingExpenses, setPackagingExpenses] = useState(2000);
  const [otherExpenses, setOtherExpenses] = useState(1000);
  const [nonRecoverableTaxes, setNonRecoverableTaxes] = useState(2500);
  const [recoverableGstRate, setRecoverableGstRate] = useState(18);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const results: LandedCostResult = calculateLandedCost({
    purchasePricePerUnit: purchasePrice,
    quantity,
    freightCharges,
    loadingUnloadingCharges: loadingUnloading,
    packagingExpenses,
    otherAttributableExpenses: otherExpenses,
    nonRecoverableDutiesTaxes: nonRecoverableTaxes,
    recoverableGstRatePct: recoverableGstRate,
  });

  const handleReset = () => {
    setPurchasePrice(450);
    setQuantity(500);
    setFreightCharges(6500);
    setLoadingUnloading(1500);
    setPackagingExpenses(2000);
    setOtherExpenses(1000);
    setNonRecoverableTaxes(2500);
    setRecoverableGstRate(18);
  };

  const FAQS = [
    {
      q: 'Why must recoverable GST be kept separate from the landed product cost?',
      a: 'Under Indian GST provisions, registered businesses claim an Input Tax Credit (ITC) on the GST paid for purchased commercial goods. Because this GST amount is refunded or offset against your outward tax liability, it is not an expense and must not be loaded into inventory valuation or Cost of Goods Sold (COGS). Only non-recoverable local duties (mandi cess, entry levies, non-ITC taxes) should be capitalized.',
    },
    {
      q: 'What attributable expenses should Indian importers and distributors include?',
      a: 'Per Indian Accounting Standards (Ind AS 2 / AS 2 - Valuation of Inventories), all costs directly incurred in bringing inventory to its present location and condition must be capitalized into landed cost. This includes inter-state freight, transit insurance, hamali (unloading), port handling charges, and secondary protective packaging.',
    },
    {
      q: 'How does this landed cost per unit safeguard wholesale pricing margins?',
      a: 'Calculating landed cost prevents the common mistake of pricing retail goods against invoice purchase cost alone. If an item was invoiced at ₹450 but has ₹27 in attributable freight and handling, setting a 10% markup on ₹450 (₹495) leaves you with an actual margin of under 3%.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Landed Cost Calculator | Import & Domestic Procurement Engine"
        description="Compute true inventory landed costs per unit: freight, loading/unloading (Hamali), packaging, non-recoverable taxes, and separate recoverable GST input credits."
        canonicalPath="/business-calculators/landed-cost-calculator"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Business Calculators', path: '/business-calculators' },
          { name: 'Landed Cost Calculator', path: '/business-calculators/landed-cost-calculator' },
        ]}
        faqs={FAQS}
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                <Truck className="w-3.5 h-3.5 text-amber-600" />
                <span>Inventory Accounting &amp; Logistics Valuation</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
                Landed Cost Calculator
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Calculate the real per-unit inventory landed cost by aggregating freight, Hamali, packaging, and non-creditable taxes while treating recoverable GST separately.
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
          {/* Inputs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Procurement &amp; Expense Breakdown</h2>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Ind AS 2 Compliant
                </span>
              </div>

              {/* Purchase Base */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Purchase Price Per Unit (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={purchasePrice || ''}
                      onChange={(e) => setPurchasePrice(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Procurement Quantity (Units)</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity || ''}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Attributable Logistical Expenses */}
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Attributable Handling &amp; Transit Expenses
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Freight &amp; Transport Charges (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={freightCharges || ''}
                      onChange={(e) => setFreightCharges(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Loading &amp; Hamali Charges (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={loadingUnloading || ''}
                      onChange={(e) => setLoadingUnloading(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Packaging Materials (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={packagingExpenses || ''}
                      onChange={(e) => setPackagingExpenses(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Other Attributable Expenses (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={otherExpenses || ''}
                      onChange={(e) => setOtherExpenses(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Taxes Section */}
              <div className="pt-2 border-t border-slate-100 space-y-4">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Taxes &amp; Statutory Levies
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Non-Recoverable Taxes &amp; Duties (₹)
                    </label>
                    <p className="text-[11px] text-slate-500">Mandi fees, octroi, entry cess (added to cost)</p>
                    <input
                      type="number"
                      min="0"
                      value={nonRecoverableTaxes || ''}
                      onChange={(e) => setNonRecoverableTaxes(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Recoverable GST Input Tax Credit (%)
                    </label>
                    <p className="text-[11px] text-slate-500">Credited back via GSTR-2B (not in cost)</p>
                    <select
                      value={recoverableGstRate}
                      onChange={(e) => setRecoverableGstRate(parseFloat(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50 focus:bg-white cursor-pointer"
                    >
                      <option value="0">0% (Nil / Exempted)</option>
                      <option value="5">5% GST Rate</option>
                      <option value="12">12% GST Rate</option>
                      <option value="18">18% Standard GST Rate</option>
                      <option value="28">28% Luxury/Higher GST Rate</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Landed Inventory Cost
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono">
                  {quantity} Units
                </span>
              </div>

              {/* Headline Per-Unit Landed Cost */}
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">True Landed Cost Per Unit</span>
                <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-amber-400">
                  {formatINR(results.landedCostPerUnit, true)}
                </div>
                <span className="text-xs text-slate-400 block pt-1">
                  Base Purchase: {formatINR(purchasePrice, true)} + Overheads: {formatINR(results.landedCostPerUnit - purchasePrice, true)} / unit
                </span>
              </div>

              {/* Total Lot Landed Cost */}
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                <span className="text-[11px] text-slate-400 block font-medium">Total Lot Landed Cost</span>
                <span className="text-2xl font-black text-white font-mono block">
                  {formatINR(results.totalLandedCost)}
                </span>
                <span className="text-[10px] text-amber-300 mt-0.5 block">
                  +{results.additionalCostPercentage.toFixed(1)}% logistics &amp; handling overhead on purchase
                </span>
              </div>

              {/* Detailed Itemization */}
              <div className="divide-y divide-slate-800/80 text-xs pt-1">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Total Purchase Value:</span>
                  <span className="font-mono text-slate-200">{formatINR(results.totalPurchaseCost)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Freight &amp; Cargo:</span>
                  <span className="font-mono text-slate-200">{formatINR(results.freightCharges)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Hamali / Labor:</span>
                  <span className="font-mono text-slate-200">{formatINR(results.loadingUnloadingCharges)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Packaging Materials:</span>
                  <span className="font-mono text-slate-200">{formatINR(results.packagingExpenses)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-400">Non-Recoverable Duties:</span>
                  <span className="font-mono text-slate-200">{formatINR(results.nonRecoverableDutiesTaxes)}</span>
                </div>
                <div className="py-2.5 flex justify-between font-bold text-amber-400">
                  <span>Total Additional Expenses:</span>
                  <span className="font-mono">{formatINR(results.totalAdditionalExpenses)}</span>
                </div>
              </div>

              {/* Separate Recoverable GST Note */}
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>Recoverable GST (Input Credit):</span>
                  <span className="font-mono text-sm text-emerald-400">
                    {formatINR(results.recoverableGstAmount)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Excluded from landed cost per Ind AS 2. Claimable as Input Tax Credit (ITC) against your monthly GST return.
                </p>
                <div className="pt-2 border-t border-emerald-900/60 flex items-center justify-between text-[11px] text-slate-300">
                  <span>Gross Cash Outflow (incl. GST):</span>
                  <span className="font-mono font-bold text-white">
                    {formatINR(results.grossAmountIncludingRecoverableGst)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <section className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Frequently Asked Questions on Landed Cost Accounting
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
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-slate-900 hover:text-amber-700 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-amber-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
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
