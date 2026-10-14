import React, { useState, useId } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '@/components/SeoHead';
import {
  Boxes,
  RotateCcw,
  Info,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Truck,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { calculateInventoryReorder } from '@/lib/calculators/inventory';
import { formatINR } from '@/lib/formatters';

export const InventoryReorderPage: React.FC = () => {
  const [dailyDemand, setDailyDemand] = useState<number>(45);
  const [leadTimeDays, setLeadTimeDays] = useState<number>(10);
  const [safetyStock, setSafetyStock] = useState<number>(100);
  const [orderCost, setOrderCost] = useState<number>(750);
  const [holdingCost, setHoldingCost] = useState<number>(25);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const result = calculateInventoryReorder({
    averageDailyDemand: dailyDemand,
    leadTimeDays,
    safetyStock,
    orderCost,
    annualHoldingCost: holdingCost,
  });

  const handleReset = () => {
    setDailyDemand(45);
    setLeadTimeDays(10);
    setSafetyStock(100);
    setOrderCost(750);
    setHoldingCost(25);
  };

  const FAQS = [
    {
      q: 'What is an Inventory Reorder Point (ROP)?',
      a: 'The Reorder Point (ROP) is the predetermined inventory threshold that signals when a new purchase order must be placed with your supplier. It ensures you order new inventory before existing stock runs out, accounting for delivery lead times and safety buffer stock.',
    },
    {
      q: 'How does Safety Stock protect Indian businesses?',
      a: 'Safety stock acts as an insurance buffer against demand spikes and unexpected supplier delays (such as transporter strikes, monsoon freight slowdowns, or factory production halts). Without safety stock, any transit delay directly causes stockouts and lost revenue.',
    },
    {
      q: 'What is Economic Order Quantity (EOQ)?',
      a: 'Economic Order Quantity (EOQ) is the optimal order batch size that minimizes total annual inventory costs by finding the mathematical equilibrium between fixed purchase ordering costs (paperwork, freight, inspection) and unit holding costs (storage, insurance, spoilage, working capital interest).',
    },
    {
      q: 'Why do demand and lead-time variations affect reorder calculations?',
      a: 'Calculations rely on average consumption and typical supplier turnaround. If daily sales spike during festival seasons or if a supplier faces extended lead times, the reorder point must be adjusted upward by increasing safety stock.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Inventory Reorder Calculator | Safety Stock & Reorder Point (ROP) India"
        description="Calculate inventory reorder points (ROP), buffer safety stock, and suggested reorder quantities (EOQ) for Indian retailers, wholesalers, and distributors."
        canonicalPath="/business-calculators/inventory-reorder-calculator"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Business Calculators', path: '/business-calculators' },
          { name: 'Inventory Reorder Calculator', path: '/business-calculators/inventory-reorder-calculator' },
        ]}
        faqs={FAQS}
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <Boxes className="w-3.5 h-3.5 text-emerald-600" />
                <span>Supply Chain &amp; Inventory Suite</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
                Inventory Reorder &amp; Safety Stock Calculator
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Calculate your precise reorder point (ROP), buffer safety stock, and optimal order batch quantities to prevent stockouts while controlling inventory holding costs.
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
                <h2 className="text-base font-bold text-slate-900">Demand &amp; Supplier Inputs</h2>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Instant Recalculation
                </span>
              </div>

              {/* Daily Demand */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Average Daily Demand (Units/Day)</span>
                  <span className="text-[11px] font-normal text-slate-500">Sales velocity</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={dailyDemand || ''}
                  onChange={(e) => setDailyDemand(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="e.g. 45"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              {/* Supplier Lead Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Supplier Lead Time (Days)</span>
                  <span className="text-[11px] font-normal text-slate-500">Order to delivery</span>
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={leadTimeDays || ''}
                  onChange={(e) => setLeadTimeDays(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="e.g. 10"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              {/* Safety Stock */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Safety Stock Buffer (Units)</span>
                  <span className="text-[11px] font-normal text-slate-500">Protection against delays</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={safetyStock || ''}
                  onChange={(e) => setSafetyStock(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Optional Economic Order Quantity (EOQ) Parameters
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Ordering Cost Per PO (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={orderCost || ''}
                      onChange={(e) => setOrderCost(Math.max(0, Number(e.target.value) || 0))}
                      placeholder="e.g. 750"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Annual Holding Cost/Unit (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={holdingCost || ''}
                      onChange={(e) => setHoldingCost(Math.max(0, Number(e.target.value) || 0))}
                      placeholder="e.g. 25"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Reorder Recommendation
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Stockout Prevention
                </span>
              </div>

              {/* Big Hero Number: ROP */}
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">Reorder Point (ROP)</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight">
                    {result.reorderPoint.toLocaleString('en-IN')}
                  </span>
                  <span className="text-lg font-bold text-emerald-400">units</span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Place a replenishment order when inventory on hand falls to {result.reorderPoint} units.
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[11px] text-slate-400">Lead Time Demand</div>
                  <div className="text-lg font-bold text-white">
                    {result.leadTimeDemand.toLocaleString('en-IN')} units
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {dailyDemand} units × {leadTimeDays} days
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[11px] text-slate-400">Safety Buffer</div>
                  <div className="text-lg font-bold text-emerald-400">
                    {result.safetyStock.toLocaleString('en-IN')} units
                  </div>
                  <div className="text-[10px] text-slate-400">Protective cushion</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[11px] text-slate-400">Suggested Order Qty</div>
                  <div className="text-lg font-bold text-white">
                    {result.suggestedReorderQuantity.toLocaleString('en-IN')} units
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {result.economicOrderQuantity ? 'Wilson EOQ Optimal' : 'Cycle replenishment'}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-[11px] text-slate-400">Days of Supply</div>
                  <div className="text-lg font-bold text-white">
                    {result.daysOfSupplyAtReorderPoint} days
                  </div>
                  <div className="text-[10px] text-slate-400">At reorder trigger</div>
                </div>
              </div>

              {/* Assumptions & Notes */}
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-200/90 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Important Supply Chain Notes</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-emerald-200/80">
                  {result.assumptions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Worked Example Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span>Worked Numerical Example</span>
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              Suppose an FMCG distributor in Ahmedabad sells an average of <strong>40 crates of packaged tea daily</strong>. The factory replenishment lead time from Assam is <strong>12 days</strong>. To safeguard against unexpected road transport hold-ups, the manager maintains <strong>80 crates as safety stock</strong>.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1.5 text-slate-800">
              <div>1. Lead Time Demand = 40 units/day × 12 days = 480 crates</div>
              <div>2. Safety Buffer = 80 crates</div>
              <div>3. Reorder Point (ROP) = 480 + 80 = <strong>560 crates</strong></div>
            </div>
            <p>
              As soon as the warehouse stock count dips to 560 crates, a replenishment purchase order is placed. During the 12 days the shipment is on the road, roughly 480 crates will be sold, arriving right as stock touches the 80-crate buffer mark.
            </p>
          </div>
        </section>

        {/* Cross Links to Other Business Tools */}
        <section className="border-t border-slate-200 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Related Business &amp; Trade Calculators
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
              to="/business-calculators/landed-cost-calculator"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">Landed Cost Calculator</div>
              <p className="text-[11px] text-slate-500">Hamali, freight, packaging &amp; separate ITC GST</p>
            </Link>
            <Link
              to="/business-calculators/wholesale-profit-margin-calculator"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">Wholesale Margin Calculator</div>
              <p className="text-[11px] text-slate-500">Margin, markup, batch expenses &amp; break-even</p>
            </Link>
            <Link
              to="/business-calculators/working-capital-calculator"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">Working Capital Calculator</div>
              <p className="text-[11px] text-slate-500">Current ratio &amp; operational liquidity buffer</p>
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
