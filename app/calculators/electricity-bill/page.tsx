import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '@/components/SeoHead';
import {
  Zap,
  RotateCcw,
  Info,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Sliders,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  calculateElectricityBill,
  DEFAULT_DOMESTIC_SLABS,
  TariffSlab,
} from '@/lib/calculators/electricity';
import { formatINR } from '@/lib/formatters';

export const ElectricityBillPage: React.FC = () => {
  const [consumptionKWh, setConsumptionKWh] = useState<number>(240);
  const [fixedCharges, setFixedCharges] = useState<number>(85);
  const [dutyPercentage, setDutyPercentage] = useState<number>(6);
  const [fppcaRate, setFppcaRate] = useState<number>(0.35);

  // Preset state or custom slabs
  const [useCustomSlabs, setUseCustomSlabs] = useState<boolean>(false);
  const [customSlabs, setCustomSlabs] = useState<TariffSlab[]>([
    { min: 0, max: 100, rate: 3.50 },
    { min: 100, max: 200, rate: 5.25 },
    { min: 200, max: 400, rate: 7.40 },
    { min: 400, max: Infinity, rate: 9.20 },
  ]);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const result = calculateElectricityBill({
    consumptionKWh,
    fixedCharges,
    dutyPercentage,
    fppcaRatePerUnit: fppcaRate,
    tariffSlabs: useCustomSlabs ? customSlabs : DEFAULT_DOMESTIC_SLABS,
  });

  const handleReset = () => {
    setConsumptionKWh(240);
    setFixedCharges(85);
    setDutyPercentage(6);
    setFppcaRate(0.35);
    setUseCustomSlabs(false);
  };

  const handleSlabRateChange = (idx: number, rate: number) => {
    const updated = [...customSlabs];
    updated[idx] = { ...updated[idx], rate: Math.max(0, rate) };
    setCustomSlabs(updated);
  };

  const FAQS = [
    {
      q: 'How does telescopic slab billing work in India?',
      a: 'Telescopic billing means you are charged progressively: your first 100 units are always billed at the lowest Tier-1 rate, units from 101 to 200 are billed at the Tier-2 rate, and only consumption exceeding 200 units enters the higher rate bracket. This encourages energy conservation while protecting lower-consumption consumers.',
    },
    {
      q: 'Why are electricity tariffs different in every Indian state?',
      a: 'Electricity distribution is regulated at the state level by State Electricity Regulatory Commissions (SERCs), such as MERC in Maharashtra, DERC in Delhi, GERC in Gujarat, and TNERC in Tamil Nadu. Power procurement contracts, distribution losses (AT&C), and state subsidy policies vary significantly.',
    },
    {
      q: 'What is FPPCA / FAC on an electricity bill?',
      a: 'Fuel and Power Purchase Cost Adjustment (FPPCA) is a variable surcharge levied per unit (typically ₹0.20 to ₹0.75/kWh) to reflect real-time changes in coal, natural gas, and market power purchase tariffs paid by DISCOMs.',
    },
    {
      q: 'How can rooftop solar offset these electricity charges?',
      a: 'Installing a rooftop solar photovoltaic system under the PM Surya Ghar scheme reduces your grid unit draw from the highest (most expensive) telescopic tariff slabs first, maximizing monthly bill savings.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Electricity Bill Calculator | Telescopic Slab Tariff Estimator India"
        description="Estimate monthly domestic electricity bills with configurable tiered telescopic slabs, fixed meter charges, state electricity duty, and fuel surcharges."
        canonicalPath="/calculators/electricity-bill"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/' },
          { name: 'Electricity Bill Calculator', path: '/calculators/electricity-bill' },
        ]}
        faqs={FAQS}
      />

      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Consumer Utility &amp; Energy Suite</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
                Electricity Bill &amp; Slab Tariff Calculator
              </h1>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Estimate your monthly electricity charges based on your consumption in units (kWh), configurable telescopic slab rates, fixed connection charges, state duty, and fuel adjustments.
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
                <h2 className="text-base font-bold text-slate-900">Consumption &amp; Connection Inputs</h2>
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  Telescopic Slabs
                </span>
              </div>

              {/* Monthly Units */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Monthly Consumption in kWh (Units)</span>
                  <span className="text-[11px] font-normal text-slate-500">From meter reading</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={consumptionKWh || ''}
                  onChange={(e) => setConsumptionKWh(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="e.g. 240"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
                />
              </div>

              {/* Quick unit chips */}
              <div className="flex flex-wrap gap-2">
                {[100, 150, 200, 250, 300, 450, 600].map((units) => (
                  <button
                    key={units}
                    type="button"
                    onClick={() => setConsumptionKWh(units)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      consumptionKWh === units
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {units} Units
                  </button>
                ))}
              </div>

              {/* Fixed Charges & State Duty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Fixed Meter Charge (₹/mo)</label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={fixedCharges || ''}
                    onChange={(e) => setFixedCharges(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="e.g. 85"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">State Electricity Duty (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    value={dutyPercentage || ''}
                    onChange={(e) => setDutyPercentage(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="e.g. 6"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Fuel Adjustment Surcharge FPPCA (₹/Unit)</span>
                  <span className="text-[11px] font-normal text-slate-500">Variable Discom cess</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.05"
                  value={fppcaRate || ''}
                  onChange={(e) => setFppcaRate(Math.max(0, Number(e.target.value) || 0))}
                  placeholder="e.g. 0.35"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
                />
              </div>

              {/* Configurable Slabs Toggle */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900">Customize Slab Rates for Your State DISCOM</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseCustomSlabs(!useCustomSlabs)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${
                      useCustomSlabs
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {useCustomSlabs ? 'Custom Active' : 'Use Standard'}
                  </button>
                </div>

                {useCustomSlabs && (
                  <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 animate-in fade-in-50">
                    <p className="text-[11px] text-slate-500">
                      Enter the per-unit rates (₹/kWh) applicable to your specific state electricity board:
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {customSlabs.map((slab, idx) => (
                        <div key={idx} className="space-y-1">
                          <span className="text-[10px] font-semibold text-slate-600">
                            {slab.min + 1}–{slab.max === Infinity ? 'Above' : slab.max} units
                          </span>
                          <input
                            type="number"
                            step="0.25"
                            value={slab.rate}
                            onChange={(e) => handleSlabRateChange(idx, Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Estimated Monthly Bill
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                  {consumptionKWh} kWh Consumed
                </span>
              </div>

              {/* Big Bill Number */}
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">Total Monthly Electricity Charges</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight">
                    {formatINR(result.totalEstimatedBill)}
                  </span>
                </div>
                <p className="text-xs text-slate-400 pt-1">
                  Effective average rate: ₹{result.effectiveCostPerUnit} / unit
                </p>
              </div>

              {/* Telescopic Slabs Breakdown Table */}
              <div className="space-y-2 pt-2">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Telescopic Slab Calculation
                </div>
                <div className="divide-y divide-white/10 rounded-2xl bg-white/5 border border-white/10 p-3.5 text-xs">
                  {result.slabBreakdown.map((item, idx) => (
                    <div key={idx} className="py-2 first:pt-0 last:pb-0 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-200">{item.slabLabel}</div>
                        <div className="text-[10px] text-slate-400">
                          {item.unitsInSlab} units × ₹{item.ratePerUnit.toFixed(2)}/unit
                        </div>
                      </div>
                      <div className="font-bold text-white font-mono">
                        {formatINR(item.slabCost)}
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 flex items-center justify-between text-slate-300 font-medium">
                    <span>Fixed Connection Charge:</span>
                    <span>{formatINR(result.fixedCharges)}</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-slate-300 font-medium">
                    <span>FPPCA Fuel Surcharge:</span>
                    <span>{formatINR(result.fppcaCharges)}</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between text-slate-300 font-medium">
                    <span>State Duty ({dutyPercentage}%):</span>
                    <span>{formatINR(result.dutyCharges)}</span>
                  </div>
                </div>
              </div>

              {/* Solar Cross-Promotion / Warning */}
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/20 text-xs text-amber-200/90 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-amber-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Important Estimation Notice</span>
                </div>
                <p className="text-[11px] leading-relaxed text-amber-200/80">
                  This calculation provides an estimate based on standard multi-tier slab formulas. Actual bills depend on your specific distribution licensee (DISCOM), sanctioned load, meter rent, and applicable government subsidies (e.g., Delhi, Punjab zero-bill schemes).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Worked Example Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-600" />
            <span>Worked Numerical Example</span>
          </h2>
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
            <p>
              Suppose a family in Bengaluru consumes <strong>240 units</strong> in May. Under standard domestic telescopic slabs:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-1.5 text-slate-800">
              <div>• Tier 1 (1 to 100 units): 100 × ₹3.50 = ₹350.00</div>
              <div>• Tier 2 (101 to 200 units): 100 × ₹5.25 = ₹525.00</div>
              <div>• Tier 3 (201 to 240 units): 40 × ₹7.40 = ₹296.00</div>
              <div>• Total Energy Charges = ₹350 + ₹525 + ₹296 = <strong>₹1,171.00</strong></div>
              <div>• Fixed Meter Charge: ₹85.00 | Fuel Adjustment (240 × ₹0.35): ₹84.00</div>
              <div>• State Electricity Duty (6% on ₹1,340): ₹80.40</div>
              <div>• Estimated Total Bill = <strong>₹1,420</strong> (Avg ₹5.92 / unit)</div>
            </div>
          </div>
        </section>

        {/* Cross Links to Other Tools */}
        <section className="border-t border-slate-200 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Related Energy &amp; Utility Calculators
            </h3>
            <Link
              to="/calculators/solar-rooftop"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Explore Rooftop Solar Savings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/calculators/solar-rooftop"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">PM Surya Ghar Solar Subsidy</div>
              <p className="text-[11px] text-slate-500">Calculate central assistance up to ₹78,000</p>
            </Link>
            <Link
              to="/calculators/commute-fuel"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">Commute Fuel Spend Calculator</div>
              <p className="text-[11px] text-slate-500">Compare Petrol, Diesel, CNG &amp; EV running costs</p>
            </Link>
            <Link
              to="/calculators/home-loan-prepayment"
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-xs transition-all space-y-1"
            >
              <div className="text-xs font-bold text-slate-900">Home Loan Prepayment Saver</div>
              <p className="text-[11px] text-slate-500">Cut mortgage tenures by paying 1 extra EMI</p>
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
                  className="w-full flex items-center justify-between text-left gap-4 font-bold text-sm text-slate-900 hover:text-amber-700 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 transition-transform ${activeFaq === idx ? 'rotate-180 text-amber-600' : 'text-slate-400'}`}
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
