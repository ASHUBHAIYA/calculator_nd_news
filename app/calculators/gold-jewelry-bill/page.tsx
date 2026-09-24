import React, { useState, useEffect, useId } from 'react';
import {
  Coins,
  ShieldCheck,
  Receipt,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import {
  calculateGoldInvoice,
  calculateSilverInvoice,
  GoldPurity,
  SilverPurity,
  PURITY_MULTIPLIERS,
  SILVER_PURITY_MULTIPLIERS,
  BullionInvoiceBreakdown,
  BullionMetal,
  BullionMarketRate,
} from '@/lib/calculators/gold';
import { formatINR, formatNumberIN } from '@/lib/formatters';
import { AdBanner } from '@/components/AdBanner';
import { BullionTicker } from '@/components/BullionTicker';
import { SeoHead } from '@/components/SeoHead';

export const GoldJewelryBillPage: React.FC = () => {
  const rateId = useId();
  const weightId = useId();
  const makingTypeId = useId();
  const makingRateId = useId();
  const stoneId = useId();
  const discountId = useId();

  // Metal Selection: Gold or Silver
  const [metal, setMetal] = useState<BullionMetal>('gold');

  // Gold Parameters
  const [goldRate24K, setGoldRate24K] = useState<number>(143115); // per 10g
  const [goldPurity, setGoldPurity] = useState<GoldPurity>('22K');

  // Silver Parameters
  const [silverRate999PerKg, setSilverRate999PerKg] = useState<number>(216670); // per 1 kg
  const [silverPurity, setSilverPurity] = useState<SilverPurity>('925');
  const [silverWeightUnit, setSilverWeightUnit] = useState<'grams' | 'kg' | 'tola'>('grams');
  const [silverWeightInput, setSilverWeightInput] = useState<number>(50);

  // Common Parameters
  const [goldWeightGrams, setGoldWeightGrams] = useState<number>(12.5);
  const [makingType, setMakingType] = useState<'percentage' | 'perGram'>('percentage');
  const [makingRate, setMakingRate] = useState<number>(12); // 12% or ₹650/g
  const [stoneValue, setStoneValue] = useState<number>(0);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [includeHallmark, setIncludeHallmark] = useState<boolean>(true);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [syncedFeedSource, setSyncedFeedSource] = useState<string>('');

  // Synchronize with server live bullion rates on mount
  useEffect(() => {
    fetch('/api/bullion-rates')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.gold24KPer10g && data?.silver999PerKg) {
          setGoldRate24K(data.gold24KPer10g);
          setSilverRate999PerKg(data.silver999PerKg);
          setSyncedFeedSource(data.sourceDescription || data.source);
        }
      })
      .catch(() => {});
  }, []);

  // Compute effective weight in grams for Silver
  const effectiveSilverWeightGrams =
    silverWeightUnit === 'kg'
      ? silverWeightInput * 1000
      : silverWeightUnit === 'tola'
      ? Number((silverWeightInput * 11.6638).toFixed(2))
      : silverWeightInput;

  // Invoice Computation
  const invoice: BullionInvoiceBreakdown =
    metal === 'gold'
      ? calculateGoldInvoice({
          goldRate24KPer10g: goldRate24K,
          weightGrams: goldWeightGrams,
          purity: goldPurity,
          makingChargeType: makingType,
          makingChargeValue: makingRate,
          stoneValue,
          includeHallmarking: includeHallmark,
          discountAmount,
        })
      : calculateSilverInvoice({
          silverRate999PerKg,
          weightGrams: effectiveSilverWeightGrams,
          purity: silverPurity,
          makingChargeType: makingType,
          makingChargeValue: makingRate,
          stoneValue,
          includeHallmarking: includeHallmark,
          discountAmount,
        });

  const handleApplyTickerRate = (marketRate: BullionMarketRate) => {
    if (marketRate.metal === 'gold') {
      setMetal('gold');
      if (marketRate.purity === '24K') {
        setGoldPurity('24K');
        setGoldRate24K(marketRate.rate);
      } else if (marketRate.purity === '22K') {
        setGoldPurity('22K');
        // Convert 22K rate back to 24K base rate so that (base / 24) * 22 matches marketRate.rate exactly
        const base24K = Math.round((marketRate.rate / 22) * 24);
        setGoldRate24K(base24K);
      } else if (marketRate.purity === '18K') {
        setGoldPurity('18K');
        const base24K = Math.round((marketRate.rate / 18) * 24);
        setGoldRate24K(base24K);
      } else {
        setGoldRate24K(marketRate.rate);
      }
    } else {
      setMetal('silver');
      if (marketRate.purity === '999') {
        setSilverPurity('999');
        setSilverRate999PerKg(marketRate.rate);
      } else if (marketRate.purity === '925') {
        setSilverPurity('925');
        // Convert 925 10g rate to 999 1kg base rate so that (base / 100) * 0.925 matches marketRate.rate exactly
        const baseKg = Math.round((marketRate.rate / 0.925) * 100);
        setSilverRate999PerKg(baseKg);
      } else {
        setSilverRate999PerKg(marketRate.rate);
      }
    }
  };

  const FAQS = [
    {
      q: 'How are GoldAPI and Yahoo Finance rates standardized for the Indian market?',
      a: 'Raw international feeds (such as GoldAPI London OTC spot and COMEX futures) quote gold prices held in overseas vaults before entering India. Because all physical bullion legally imported into India is subject to the statutory 6% Customs Import Duty (5% Basic Customs Duty + 1% AIDC as enacted in the Union Budget 2024), BharatCalc automatically factors this 6% duty into both GoldAPI and Yahoo Finance feeds. This ensures the ticker reflects authentic domestic landed bullion rates (IBJA benchmark standard) ready for jewelry calculation.',
    },
    {
      q: 'How are live bullion tickers checked and calculated in India?',
      a: 'Bullion prices in India are driven by the Multi Commodity Exchange (MCX) futures market and spot rates published daily by the India Bullion and Jewellers Association (IBJA). IBJA polls top bullion dealers across major metropolitan centers to determine the daily opening and closing benchmark quotes for 24K (999) gold and 999 fine silver. BharatCalc benchmarks against these statutory wholesale quotes and automatically computes 22K (916), 18K (750), and 925 sterling silver rates.',
    },
    {
      q: 'How is 22 Karat (Hallmark 916) and 18 Karat gold price derived from 24 Karat rate?',
      a: 'The Multi Commodity Exchange (MCX) and bullion associations (IBJA) quote prices for pure 24K gold (99.9% purity). Because pure 24K gold is too soft for durable jewelry, jewelers use 22K (91.6% gold, 8.4% copper/silver alloy) or 18K (75% gold, 25% alloy). The pure gold value is calculated mathematically: 22K Rate = (24K Rate / 24) * 22, and 18K Rate = (24K Rate / 24) * 18. Never pay 24K rates for 22K or 18K jewelry.',
    },
    {
      q: 'What is the statutory GST rate on gold and silver jewelry in India?',
      a: 'Under Indian GST laws, both gold and silver jewelry are taxed at a composite rate of 3% on the total invoice value (1.5% CGST + 1.5% SGST). This 3% applies to the bullion value + making charges + gemstones. Hallmarking fees carry a standard 18% GST (₹45 + 18% GST = ₹53.10 for gold; ₹35 + 18% GST = ₹41.30 for silver per article).',
    },
    {
      q: 'What is the difference between Making Charges and Wastage Charges?',
      a: 'Making charges represent the artisan craftsmanship and machinery cost of manufacturing an ornament. In the past, traditional jewelers added a separate "wastage charge" (melting loss). Under current consumer protection and Bureau of Indian Standards (BIS) regulations, reputable jewellers must consolidate all manufacturing fees into a single transparent "Making Charge" and cannot charge unverified arbitrary wastage.',
    },
    {
      q: 'Why must stone weight be deducted before calculating gold price?',
      a: 'A common showroom malpractice is billing the gross weight of a studded ornament at the gold per-gram rate. Semi-precious stones, cubic zirconia (CZ), or glass beads cost a tiny fraction of gold (e.g. ₹50–₹200 per carat), whereas gold costs over ₹10,000 per gram. Always demand that the jeweler deduct the exact stone weight to determine the Net Gold Weight, and bill stones separately.',
    },
    {
      q: 'What is BIS Hallmarking and the 6-digit HUID code?',
      a: 'The Bureau of Indian Standards (BIS) mandates hallmarking on all gold jewelry sold in India. An authentic hallmark comprises three symbols: (1) The BIS triangular logo, (2) Purity mark (e.g., 22K916 for 22 Karat, 18K750 for 18 Karat, 14K585 for 14 Karat), and (3) A unique 6-digit alphanumeric Hallmarking Unique Identification (HUID) code laser-engraved on each piece. Consumers can verify authenticity using the BIS Care mobile app.',
    },
    {
      q: 'What are the official BIS purity grades for Silver?',
      a: 'The Bureau of Indian Standards (BIS) recognizes four major purity grades for silver articles: (1) 999 Fine Silver (99.9% pure for coins and bars), (2) 925 Sterling Silver (92.5% pure, internationally mandatory for fine jewelry), (3) 900 Coin Silver (90.0% pure, traditional utensils), and (4) 800 Silver (80.0% pure, traditional heavy anklets/payals). Every certified silver piece bears the BIS triangular mark and purity grade.',
    },
    {
      q: 'How did the Union Budget 2024 customs duty cut impact gold prices in India?',
      a: 'In July 2024, the Indian government slashed Basic Customs Duty (BCD) on gold and silver from 10% to 5%, and Agriculture Infrastructure and Development Cess (AIDC) from 5% to 1%, bringing total import duty down from 15% to 6%. This statutory reform immediately lowered domestic physical gold prices by approximately ₹4,000–₹5,000 per 10 grams, significantly reducing illegal smuggling and aligning Indian retail closer to international spot rates.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Gold & Silver Jewelry GST & Invoice Calculator | Live 22K 916 & 24K Rates"
        description="Calculate accurate gold and silver jewelry bills with live 22K (916) and 24K rates, making charges, stone deductions, and exact 3% GST with BIS hallmarking rules."
        canonicalPath="/calculators/gold-jewelry-bill"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/' },
          { name: 'Gold Jewelry GST & Bill Calculator', path: '/calculators/gold-jewelry-bill' },
        ]}
        faqs={FAQS}
      />
      {/* Header */}
      <section className="bg-white border-b border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                <span>Calculators</span>
                <span>/</span>
                <span className="text-slate-500">Bullion, Gold & Silver Retail</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
                Gold & Silver Jewelry GST & Invoice Calculator
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                Calculate authentic gold and silver jewelry prices before buying: live MCX/IBJA benchmark rates, 22K/18K/925 purity formulas, making charges, gemstone additions, and exact 3% GST with BIS hallmarking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Live Bullion Ticker Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <BullionTicker onSelectRate={handleApplyTickerRate} />
      </section>

      {/* Top Advertisement Banner with >= 32px safe clearance */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <AdBanner format="leaderboard" slotId="gold-top-leaderboard" />
      </div>

      {/* Calculator Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Inputs */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
            {/* Metal Selector (Gold vs Silver) */}
            <div className="border-b border-slate-100 pb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Select Bullion Metal
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMetal('gold');
                    if (makingType === 'perGram' && makingRate < 200) setMakingRate(650);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                    metal === 'gold'
                      ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-xs ring-2 ring-amber-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Coins className="w-4 h-4 text-amber-600" />
                  <span>Gold (24K / 22K / 18K)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMetal('silver');
                    if (makingType === 'perGram' && makingRate > 100) setMakingRate(30);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-bold transition-all ${
                    metal === 'silver'
                      ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs ring-2 ring-blue-500/20'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-300 border border-slate-400 inline-block" />
                  <span>Silver (999 / 925 Sterling)</span>
                </button>
              </div>
            </div>

            {/* GOLD PARAMETERS */}
            {metal === 'gold' ? (
              <>
                {/* 24K Gold Rate Benchmark */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor={rateId} className="text-xs font-bold text-slate-700">
                      24K Pure Gold Rate (per 10 grams)
                    </label>
                    <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                      {formatINR(goldRate24K)} / 10g (₹{Math.round(goldRate24K / 10)}/g)
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      id={rateId}
                      type="number"
                      step="100"
                      min="30000"
                      max="250000"
                      value={goldRate24K || ''}
                      onChange={(e) => setGoldRate24K(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
                      placeholder="e.g. 143115"
                    />
                  </div>
                  {/* Purity Explanation Pill */}
                  <div className="flex items-center justify-between text-[11px] bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/80 text-amber-950">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Benchmark for 24K pure bullion.</span>
                    </span>
                    <span className="font-bold">
                      Calculated {goldPurity} Rate: {formatINR(invoice.effectiveRatePerGram * 10)}/10g (₹{Math.round(invoice.effectiveRatePerGram)}/g)
                    </span>
                  </div>
                  {/* Quick Preset Buttons for Gold */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {[140000, 142000, 143115, 145000, 148000].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setGoldRate24K(rate)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                          goldRate24K === rate
                            ? 'bg-amber-100 border-amber-300 text-amber-900 font-bold'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        ₹{(rate / 1000).toFixed(0)}k
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gold Purity Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex justify-between items-center">
                    <span>Gold Purity & Karat</span>
                    <span className="text-[10px] text-amber-700 font-bold">
                      Effective Rate: {formatINR(invoice.effectiveRatePerGram)} / gram
                    </span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['24K', '22K', '18K', '14K'] as GoldPurity[]).map((p) => {
                      const info = PURITY_MULTIPLIERS[p];
                      const isSelected = goldPurity === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setGoldPurity(p)}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-amber-50 border-amber-500 text-amber-900 font-bold shadow-xs'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="block text-xs font-extrabold">{p}</span>
                          <span className="block text-[9px] text-slate-400">
                            {p === '22K' ? '916 Hallmark' : p === '18K' ? '750 Hallmark' : `${Math.round(info.ratio * 100)}%`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Gold Weight in Grams */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor={weightId} className="text-xs font-bold text-slate-700">
                      Gross Gold Weight (Grams)
                    </label>
                    <span className="text-xs font-mono font-bold text-slate-800">{goldWeightGrams} grams</span>
                  </div>
                  <input
                    id={weightId}
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="1000"
                    value={goldWeightGrams || ''}
                    onChange={(e) => setGoldWeightGrams(Math.max(0, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
                    placeholder="e.g. 12.5"
                  />
                  <div className="flex gap-2 pt-1">
                    {[5, 8, 10, 15, 20, 30].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setGoldWeightGrams(quick)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                      >
                        {quick}g
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* SILVER PARAMETERS */
              <>
                {/* Silver Rate Benchmark */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor={rateId} className="text-xs font-bold text-slate-700">
                      Silver 999 Spot Rate (per 1 Kilogram)
                    </label>
                    <span className="text-xs font-mono font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {formatINR(silverRate999PerKg)} / kg (₹{(silverRate999PerKg / 100).toFixed(0)}/10g)
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
                    <input
                      id={rateId}
                      type="number"
                      step="500"
                      min="40000"
                      max="350000"
                      value={silverRate999PerKg || ''}
                      onChange={(e) => setSilverRate999PerKg(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                      placeholder="e.g. 216670"
                    />
                  </div>
                  {/* Quick Preset Buttons for Silver */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[210000, 215000, 216670, 220000, 225000].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setSilverRate999PerKg(rate)}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                          silverRate999PerKg === rate
                            ? 'bg-blue-100 border-blue-300 text-blue-900 font-bold'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        ₹{(rate / 1000).toFixed(0)}k/kg
                      </button>
                    ))}
                  </div>
                </div>

                {/* Silver Purity Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex justify-between items-center">
                    <span>Silver Purity & Article Type</span>
                    <span className="text-[10px] text-blue-700 font-bold">
                      Effective Rate: ₹{invoice.effectiveRatePerGram}/g
                    </span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['999', '925', '900', '800'] as SilverPurity[]).map((p) => {
                      const isSelected = silverPurity === p;
                      const labels: Record<SilverPurity, { title: string; sub: string }> = {
                        '999': { title: '999 Fine', sub: 'Bullion / Bars' },
                        '925': { title: '925 Sterling', sub: 'BIS Jewelry' },
                        '900': { title: '900 Coins', sub: 'Utensils' },
                        '800': { title: '800 Silver', sub: 'Payal / Anklets' },
                      };
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setSilverPurity(p)}
                          className={`p-2 rounded-xl border text-center transition-all ${
                            isSelected
                              ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold shadow-xs'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="block text-xs font-extrabold">{labels[p].title}</span>
                          <span className="block text-[9px] text-slate-400">{labels[p].sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Silver Weight & Unit Switcher */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label htmlFor={weightId} className="text-xs font-bold text-slate-700">
                      Silver Weight
                    </label>
                    <span className="text-xs font-mono font-bold text-slate-800">
                      Total: {effectiveSilverWeightGrams} grams
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      id={weightId}
                      type="number"
                      step="1"
                      min="0.5"
                      value={silverWeightInput || ''}
                      onChange={(e) => setSilverWeightInput(Math.max(0, Number(e.target.value)))}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                      placeholder="e.g. 50"
                    />
                    <select
                      value={silverWeightUnit}
                      onChange={(e) => setSilverWeightUnit(e.target.value as any)}
                      className="px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold text-xs bg-slate-50 focus:outline-hidden"
                      aria-label="Silver Weight Unit"
                    >
                      <option value="grams">Grams (g)</option>
                      <option value="kg">Kilograms (Kg)</option>
                      <option value="tola">Tola (11.66g)</option>
                    </select>
                  </div>
                  <div className="flex gap-2 pt-1">
                    {[25, 50, 100, 250, 500, 1000].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => {
                          setSilverWeightUnit('grams');
                          setSilverWeightInput(quick);
                        }}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                      >
                        {quick >= 1000 ? `${quick / 1000}kg` : `${quick}g`}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Making Charges Mode & Rate */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <label htmlFor={makingTypeId} className="text-xs font-bold text-slate-700">
                  Making Charges Mode
                </label>
                <span className="text-xs font-mono font-bold text-slate-700">
                  Total Making: {formatINR(invoice.makingChargesTotal)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMakingType('percentage');
                    if (makingRate > 50) setMakingRate(metal === 'gold' ? 12 : 15);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-colors ${
                    makingType === 'percentage'
                      ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Percentage of Value (%)
                  <span className="block text-[10px] font-normal text-slate-400">
                    {metal === 'gold' ? 'Typical: 8% to 18%' : 'Typical: 10% to 25%'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMakingType('perGram');
                    if (makingRate <= 50) setMakingRate(metal === 'gold' ? 650 : 30);
                  }}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-colors ${
                    makingType === 'perGram'
                      ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Per Gram Fixed (₹/g)
                  <span className="block text-[10px] font-normal text-slate-400">
                    {metal === 'gold' ? 'Typical: ₹400 - ₹900/g' : 'Typical: ₹20 - ₹60/g'}
                  </span>
                </button>
              </div>

              <div className="pt-1">
                <input
                  id={makingRateId}
                  type="number"
                  min="0"
                  max={makingType === 'percentage' ? 50 : 5000}
                  step={makingType === 'percentage' ? 0.5 : 5}
                  value={makingRate || ''}
                  onChange={(e) => setMakingRate(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono text-xs focus:outline-hidden bg-slate-50/50"
                  placeholder={makingType === 'percentage' ? 'e.g. 12 (%)' : 'e.g. 650 (₹/g)'}
                />
              </div>
            </div>

            {/* Gemstone Value & Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <label htmlFor={stoneId} className="text-xs font-bold text-slate-700">
                  Precious Stones / Enamel (₹)
                </label>
                <input
                  id={stoneId}
                  type="number"
                  min="0"
                  step="500"
                  value={stoneValue || ''}
                  onChange={(e) => setStoneValue(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono text-xs bg-slate-50/50"
                  placeholder="₹0 if plain metal"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor={discountId} className="text-xs font-bold text-slate-700">
                  Showroom Discount (₹)
                </label>
                <input
                  id={discountId}
                  type="number"
                  min="0"
                  step="500"
                  value={discountAmount || ''}
                  onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono text-xs bg-slate-50/50"
                  placeholder="₹0"
                />
              </div>
            </div>

            {/* BIS Hallmarking Fee Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60">
              <div>
                <span className="text-xs font-bold text-slate-700 block">
                  BIS {metal === 'gold' ? 'Gold' : 'Silver'} Hallmarking Charge
                </span>
                <span className="text-[10px] text-slate-500">
                  {metal === 'gold'
                    ? 'Statutory ₹45 + 18% GST = ₹53.10 / article'
                    : 'Statutory ₹35 + 18% GST = ₹41.30 / article'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={includeHallmark}
                onChange={(e) => setIncludeHallmark(e.target.checked)}
                className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                aria-label="Include Hallmarking Charge"
              />
            </div>
          </div>

          {/* Right: Printable Jewelry Invoice Receipt */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-md relative overflow-hidden">
              <div className="border-b border-dashed border-slate-300 pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] tracking-widest uppercase font-mono text-slate-400">
                      ESTIMATED TAX INVOICE
                    </span>
                    <h3 className="text-lg font-black text-slate-900 font-display capitalize">
                      {metal} Jewelry & Bullion Bill Summary
                    </h3>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        metal === 'gold'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {metal === 'gold' ? goldPurity : `Grade ${silverPurity}`} ({invoice.purityCode})
                    </span>
                    <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                      Weight: {invoice.weightGrams}g
                    </span>
                  </div>
                </div>
              </div>

              {/* Line Items Breakdown */}
              <div className="divide-y divide-slate-100 text-xs space-y-2">
                <div className="pt-2 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-800 capitalize">Raw {metal} Value</span>
                    <span className="block text-[10px] text-slate-400 font-mono">
                      {invoice.weightGrams}g × ₹{invoice.effectiveRatePerGram}/g
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">{formatINR(invoice.rawMetalCost)}</span>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-800">Making Charges</span>
                    <span className="block text-[10px] text-slate-400">
                      {makingType === 'percentage'
                        ? `${makingRate}% of raw metal`
                        : `${formatINR(makingRate)}/g × ${invoice.weightGrams}g`}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    +{formatINR(invoice.makingChargesTotal)}
                  </span>
                </div>

                {stoneValue > 0 && (
                  <div className="pt-2 flex justify-between items-center">
                    <span className="font-semibold text-slate-800">Stones / Enamel</span>
                    <span className="font-mono font-bold text-slate-900">+{formatINR(stoneValue)}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="pt-2 flex justify-between items-center text-emerald-700">
                    <span className="font-semibold">Showroom Discount</span>
                    <span className="font-mono font-bold">-{formatINR(discountAmount)}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-between items-center bg-slate-50 px-2.5 py-1.5 rounded-lg font-bold">
                  <span className="text-slate-700">Net Taxable Amount</span>
                  <span className="font-mono text-slate-900">{formatINR(invoice.netTaxableAmount)}</span>
                </div>

                {/* GST Components (1.5% CGST + 1.5% SGST) */}
                <div className="pt-2 space-y-1">
                  <div className="flex justify-between items-center text-slate-600 text-[11px]">
                    <span>CGST (1.5% on taxable)</span>
                    <span className="font-mono">{formatINR(invoice.cgstAmount, true)}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 text-[11px]">
                    <span>SGST (1.5% on taxable)</span>
                    <span className="font-mono">{formatINR(invoice.sgstAmount, true)}</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold text-slate-800 text-xs">
                    <span>Total GST (3.0%)</span>
                    <span className="font-mono text-amber-800">+{formatINR(invoice.totalGST, true)}</span>
                  </div>
                </div>

                {includeHallmark && (
                  <div className="pt-2 flex justify-between items-center text-[11px] text-slate-600">
                    <span>BIS Hallmarking Fee (Incl. 18% GST)</span>
                    <span className="font-mono font-bold text-slate-800">
                      +{formatINR(invoice.hallmarkingFee, true)}
                    </span>
                  </div>
                )}
              </div>

              {/* Total Final Payable Amount */}
              <div className="mt-6 pt-5 border-t-2 border-slate-900 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Total Invoice Amount
                  </span>
                  <span className="block text-[11px] text-slate-400 font-mono mt-0.5">
                    Effective cost per gram: {formatINR(invoice.effectiveCostPerGram)}/g
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">
                    {formatINR(invoice.totalInvoiceAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Inspection Safeguard Checklist */}
            <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200/80 space-y-3 text-xs text-amber-950">
              <h4 className="font-bold text-sm flex items-center gap-1.5 text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Buyer Safeguard Checklist before paying:</span>
              </h4>
              <ul className="space-y-1.5 pl-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    Verify HUID laser code using the official <em>BIS Care App</em> on mobile.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    Confirm GST is strictly 3% on jewelry (never accept unbilled cash transactions without invoice).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    Ensure stone weight is deducted from gross weight before multiplying the metal price.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Advertisement */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <AdBanner format="in-feed" slotId="gold-in-feed-slot" />
      </div>

      {/* Comprehensive Structured Explanation */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 space-y-8 text-slate-700 text-sm leading-relaxed">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
            How Indian Jewelers Calculate Gold & Silver Jewelry Bills & How to Avoid Overcharges
          </h2>

          <p>
            Jewelry purchasing in India is steeped in cultural tradition, yet it remains one of the retail sectors where consumer overcharges are most frequent. Traditional billing practices often bundled mysterious wastage percentages, non-standard purity conversions, and arbitrary making charges.
          </p>

          <h3 className="text-lg font-bold text-slate-900">
            The Standard Statutory Formula for Bullion Invoices
          </h3>

          <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs leading-loose">
            <p><strong>Final Price</strong> = (Weight in grams × Effective Rate per gram) + Making Charges + Stones + 3% GST + BIS Hallmarking</p>
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            Understanding Silver Purity: 999 vs 925 Sterling
          </h3>

          <p>
            Silver is universally benchmarked at 999 purity (Fine Silver) per 1 Kilogram. For jewelry, 925 Sterling Silver contains 92.5% pure silver alloyed with 7.5% copper for strength. Always verify that your jeweler scales the base rate to 92.5% rather than billing sterling silver at full pure silver rates.
          </p>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <span>Frequently Asked Questions on Bullion & Jewelry</span>
          </h3>

          <div className="divide-y divide-slate-200/70">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="py-3.5">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-amber-700 transition-colors focus:outline-hidden"
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="mt-2.5 text-xs text-slate-600 leading-relaxed pl-1 pr-4 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </article>

      {/* Bottom Ad */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <AdBanner format="leaderboard" slotId="gold-bottom-leaderboard" />
      </div>
    </div>
  );
};

export default GoldJewelryBillPage;

