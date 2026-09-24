import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  IndianRupee,
  Fuel,
  ArrowRight,
  ExternalLink,
  Calculator,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { RelatedCalculator } from '@/lib/types/article';
import { formatINR } from '@/lib/formatters';

interface Props {
  relatedCalculator: RelatedCalculator;
}

export const ExplainerCalculatorWidget: React.FC<Props> = ({ relatedCalculator }) => {
  // Gold interactive mini-state
  const [goldWeight, setGoldWeight] = useState<number>(10);
  const [goldPurity, setGoldPurity] = useState<'24K' | '22K' | '18K'>('22K');
  const [liveGold24K, setLiveGold24K] = useState<number>(139974);

  // Silver interactive mini-state
  const [silverWeight, setSilverWeight] = useState<number>(50);
  const [silverPurity, setSilverPurity] = useState<'999' | '925'>('925');
  const [liveSilverKg, setLiveSilverKg] = useState<number>(216670);

  // Salary interactive mini-state
  const [ctc, setCtc] = useState<number>(1200000);

  // Petrol interactive mini-state
  const [dailyKm, setDailyKm] = useState<number>(30);
  const [mileage, setMileage] = useState<number>(14);
  const [fuelPrice, setFuelPrice] = useState<number>(103);

  // Fetch live market benchmarks on mount
  useEffect(() => {
    fetch('/api/bullion-rates')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.gold24KPer10g) setLiveGold24K(data.gold24KPer10g);
        if (data?.silver999PerKg) setLiveSilverKg(data.silver999PerKg);
      })
      .catch(() => {});
  }, []);

  // Gold calculation
  const goldRatePerGram =
    goldPurity === '24K'
      ? liveGold24K / 10
      : goldPurity === '22K'
      ? (liveGold24K / 10 / 24) * 22
      : (liveGold24K / 10 / 24) * 18;
  const rawGoldCost = goldWeight * goldRatePerGram;
  const goldMaking = rawGoldCost * 0.12; // 12% standard making
  const goldSubtotal = rawGoldCost + goldMaking;
  const goldGst = goldSubtotal * 0.03;
  const totalGoldInvoice = Math.round(goldSubtotal + goldGst + 53.1);

  // Silver calculation
  const silverRatePerGram =
    silverPurity === '999' ? liveSilverKg / 1000 : (liveSilverKg / 1000) * 0.925;
  const rawSilverCost = silverWeight * silverRatePerGram;
  const silverMaking = rawSilverCost * 0.15;
  const silverSubtotal = rawSilverCost + silverMaking;
  const totalSilverInvoice = Math.round(silverSubtotal * 1.03 + 41.3);

  // Salary estimation (FY 2025-26 rules)
  const estMonthlyInHand = Math.round((ctc * 0.82) / 12);

  // Fuel calculation
  const monthlyLitres = (dailyKm * 26) / (mileage || 1);
  const monthlyFuelCost = Math.round(monthlyLitres * fuelPrice);

  if (relatedCalculator === 'gold') {
    return (
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-amber-200/90 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-amber-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Live Gold Bill Estimator</h3>
              <p className="text-[11px] text-slate-500">Includes 3% GST + 12% Making</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            Live Spot
          </span>
        </div>

        <div className="space-y-4">
          {/* Purity selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Gold Purity</label>
            <div className="grid grid-cols-3 gap-2">
              {(['24K', '22K', '18K'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setGoldPurity(p)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    goldPurity === p
                      ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p} {p === '22K' ? '(916)' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Weight Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Gross Weight</span>
              <span className="font-mono text-amber-700 font-bold">{goldWeight} grams</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              step={0.5}
              value={goldWeight}
              onChange={(e) => setGoldWeight(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
              <span>1g</span>
              <span>50g</span>
              <span>100g</span>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Pure Gold Value:</span>
              <span className="font-mono font-semibold text-slate-900">{formatINR(Math.round(rawGoldCost))}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Making + 3% GST:</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatINR(Math.round(goldMaking + goldGst + 53.1))}
              </span>
            </div>
            <div className="pt-2 border-t border-amber-200/80 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-900">Est. Final Showroom Bill:</span>
              <span className="text-base sm:text-lg font-black font-mono text-amber-800">
                {formatINR(totalGoldInvoice)}
              </span>
            </div>
          </div>

          <Link
            to="/calculators/gold-jewelry-bill"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <span>Open Full Jewelry GST & Invoice Tool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  if (relatedCalculator === 'silver') {
    return (
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-300 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Silver & Sterling Estimator</h3>
              <p className="text-[11px] text-slate-500">Spot per 1kg: {formatINR(liveSilverKg)}</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            BIS Grades
          </span>
        </div>

        <div className="space-y-4">
          {/* Purity selector */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1.5">Silver Grade</label>
            <div className="grid grid-cols-2 gap-2">
              {(['925', '999'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSilverPurity(p)}
                  className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    silverPurity === p
                      ? 'bg-slate-800 text-white border-slate-900'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p === '925' ? '925 Sterling Silver' : '999 Fine Bullion'}
                </button>
              ))}
            </div>
          </div>

          {/* Weight Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Weight in Grams</span>
              <span className="font-mono text-slate-900 font-bold">{silverWeight} grams</span>
            </div>
            <input
              type="range"
              min={10}
              max={500}
              step={10}
              value={silverWeight}
              onChange={(e) => setSilverWeight(Number(e.target.value))}
              className="w-full accent-slate-800 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
              <span>10g</span>
              <span>250g</span>
              <span>500g</span>
            </div>
          </div>

          {/* Result Card */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Bullion Cost:</span>
              <span className="font-mono font-semibold text-slate-900">{formatINR(Math.round(rawSilverCost))}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600">
              <span>Making + 3% GST:</span>
              <span className="font-mono font-semibold text-slate-900">
                {formatINR(Math.round(silverMaking + silverSubtotal * 0.03 + 41.3))}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-900">Est. Total Invoice:</span>
              <span className="text-base sm:text-lg font-black font-mono text-slate-900">
                {formatINR(totalSilverInvoice)}
              </span>
            </div>
          </div>

          <Link
            to="/calculators/gold-jewelry-bill"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <span>Open Complete Silver GST Calculator</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  if (relatedCalculator === 'salary') {
    return (
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-emerald-200 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">In-Hand Salary Quick Tool</h3>
              <p className="text-[11px] text-slate-500">FY 2025-26 New Tax Regime</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
            ₹75k Standard Ded.
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Annual CTC Package</span>
              <span className="font-mono text-emerald-700 font-bold">{formatINR(ctc)}</span>
            </div>
            <input
              type="range"
              min={300000}
              max={3000000}
              step={50000}
              value={ctc}
              onChange={(e) => setCtc(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
              <span>₹3L</span>
              <span>₹15L</span>
              <span>₹30L</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-center">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wide">Est. Monthly In-Hand</span>
              <span className="text-base sm:text-lg font-black font-mono text-emerald-800 block mt-0.5">
                {formatINR(estMonthlyInHand)}
              </span>
              <span className="text-[10px] text-emerald-600">~82% of CTC</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] text-slate-500 block uppercase tracking-wide">Standard Deduction</span>
              <span className="text-base sm:text-lg font-black font-mono text-slate-900 block mt-0.5">
                ₹75,000
              </span>
              <span className="text-[10px] text-slate-500">Sec 115BAC Slabs</span>
            </div>
          </div>

          <Link
            to="/calculators/in-hand-salary"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <span>Open Full CTC Breakdown & Slabs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  if (relatedCalculator === 'petrol') {
    return (
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-blue-200 shadow-md">
        <div className="flex items-center justify-between pb-3 border-b border-blue-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Commute Expense Estimator</h3>
              <p className="text-[11px] text-slate-500">Calculate 26 Working Days</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
            Fuel vs EV
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Daily Commute (Round Trip)</span>
              <span className="font-mono text-blue-700 font-bold">{dailyKm} km</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={dailyKm}
              onChange={(e) => setDailyKm(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Monthly Distance (26 days):</span>
              <span className="font-mono font-semibold text-slate-900">{dailyKm * 26} km</span>
            </div>
            <div className="pt-2 border-t border-blue-200 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-900">Monthly Fuel Spend:</span>
              <span className="text-base sm:text-lg font-black font-mono text-blue-800">
                {formatINR(monthlyFuelCost)}
              </span>
            </div>
          </div>

          <Link
            to="/calculators/commute-fuel"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <span>Open Commute & EV Comparison Tool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Fallback for relatedCalculator === 'none'
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-md space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-sm">BharatCalc Financial Tools</h3>
          <p className="text-[11px] text-slate-500">100% Free & Statutory Calibrated</p>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        Put these insights into practice using our zero-lag, client-side calculation engines for Indian consumers and taxpayers:
      </p>

      <div className="space-y-2">
        <Link
          to="/calculators/home-loan-prepayment"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
        >
          <span>Home Loan 1 Extra EMI Saver</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
        </Link>
        <Link
          to="/calculators/in-hand-salary"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
        >
          <span>In-Hand Salary (FY 2025-26)</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
        </Link>
        <Link
          to="/calculators/gold-jewelry-bill"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
        >
          <span>Gold & Silver 3% GST Invoice</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
        </Link>
        <Link
          to="/calculators/solar-rooftop"
          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors"
        >
          <span>PM Surya Ghar Solar Subsidy</span>
          <ArrowRight className="w-3.5 h-3.5 text-yellow-600" />
        </Link>
      </div>
    </div>
  );
};
