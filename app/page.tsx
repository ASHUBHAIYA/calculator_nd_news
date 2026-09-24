import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  Coins,
  Home,
  Fuel,
  Sun,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Sparkles,
  Calculator,
  ChevronRight,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock,
} from 'lucide-react';
import { AdBanner } from '@/components/AdBanner';
import { BullionTicker } from '@/components/BullionTicker';
import { SeoHead } from '@/components/SeoHead';
import { formatINR } from '@/lib/formatters';
import { INITIAL_ARTICLES } from '@/lib/articlesData';
import { Article } from '@/lib/types/article';

interface BenchmarkItem {
  id: string;
  label: string;
  value: string;
  delta: string;
  isPositive: boolean;
  category: string;
}

const INITIAL_BENCHMARKS: BenchmarkItem[] = [
  {
    id: 'gold-24k',
    label: 'Gold 24K (per 10g)',
    value: '₹1,39,974',
    delta: 'Live Spot',
    isPositive: true,
    category: 'Bullion (MCX / IBJA)',
  },
  {
    id: 'gold-22k',
    label: 'Gold 22K (Hallmark 916)',
    value: '₹1,28,310',
    delta: 'Live Spot',
    isPositive: true,
    category: 'Jewelry Benchmark',
  },
  {
    id: 'silver-999',
    label: 'Silver 999 (per 1kg)',
    value: '₹2,16,670',
    delta: 'Live Spot',
    isPositive: true,
    category: 'MCX Spot Bullion',
  },
  {
    id: 'repo-rate',
    label: 'Home Loan Prime Rate',
    value: '8.40% – 8.65%',
    delta: 'RBI Steady',
    isPositive: true,
    category: 'Monetary Policy',
  },
  {
    id: 'std-deduction',
    label: 'Standard Deduction (FY 2025-26)',
    value: '₹75,000',
    delta: 'Sec 115BAC',
    isPositive: true,
    category: 'FY 2025-26',
  },
  {
    id: 'surya-ghar',
    label: 'PM Surya Ghar Subsidy (3kW)',
    value: '₹78,000',
    delta: 'Direct DBT',
    isPositive: true,
    category: 'Central Scheme',
  },
  {
    id: 'epf-rate',
    label: 'EPF Statutory Rate',
    value: '8.25% p.a.',
    delta: 'Compounded',
    isPositive: true,
    category: 'EPFO India',
  },
];

const CALCULATOR_CARDS = [
  {
    id: 'salary',
    title: 'In-Hand Salary Calculator',
    subtitle: 'FY 2025-26 New Tax Regime Engine',
    description:
      'Compute accurate monthly take-home from CTC with the enhanced ₹75,000 standard deduction, Section 87A rebate up to ₹7 Lakhs, and EPF/PT rules.',
    href: '/calculators/in-hand-salary',
    icon: IndianRupee,
    accentColor: 'from-emerald-500 to-teal-700',
    badge: 'Updated Budget Slabs',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    stats: 'Covers 0% to 30% Slabs + 4% Cess',
  },
  {
    id: 'gold',
    title: 'Gold & Silver Jewelry GST & Invoice',
    subtitle: 'Live Bullion Ticker with 3% GST & Making Charges',
    description:
      'Avoid hidden showroom markups. Calculate real 22K/18K gold and 999/925 sterling silver value, configurable making charges, and exact 3% GST with BIS hallmarking.',
    href: '/calculators/gold-jewelry-bill',
    icon: Coins,
    accentColor: 'from-amber-500 to-yellow-700',
    badge: 'Gold 916 & Silver 925',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    stats: 'Live IBJA / MCX Rates & City Ticker',
  },
  {
    id: 'loan',
    title: 'Home Loan Prepayment Saver',
    subtitle: 'Tenure & Interest Reduction Engine',
    description:
      'Pay off your 20-year home loan in 12 years. Compare strategies like 1 extra annual EMI or 5% yearly step-up to save ₹15 Lakhs+ in interest.',
    href: '/calculators/home-loan-prepayment',
    icon: Home,
    accentColor: 'from-blue-500 to-indigo-700',
    badge: 'Reducing Balance',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    stats: 'Year-by-Year Amortization Schedule',
  },
  {
    id: 'fuel',
    title: 'Commute Fuel Spend Calculator',
    subtitle: 'Daily, 26-Day Monthly & EV Savings',
    description:
      'Determine your exact daily and monthly office commute fuel expenses across Petrol, Diesel, and CNG, with an instant comparison against Electric Vehicles.',
    href: '/calculators/commute-fuel',
    icon: Fuel,
    accentColor: 'from-orange-500 to-red-600',
    badge: 'Cost per Km',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    stats: 'Analyzes EV vs ICE Fuel Savings',
  },
  {
    id: 'solar',
    title: 'PM Surya Ghar Solar Subsidy',
    subtitle: 'Central DBT Assistance & ROI Engine',
    description:
      'Get your recommended rooftop solar kW capacity, central financial assistance up to ₹78,000, net installation cost, and payback period under 4 years.',
    href: '/calculators/solar-rooftop',
    icon: Sun,
    accentColor: 'from-yellow-500 to-amber-600',
    badge: 'MNRE Scheme',
    badgeColor: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    stats: '25-Year Cumulative Savings Matrix',
  },
];

export const HomePage: React.FC = () => {
  const [quickSalaryCTC, setQuickSalaryCTC] = useState<number>(1200000);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Real-time bullion rates for the floating live ticker
  const [liveGold24K, setLiveGold24K] = useState<string>('₹1,39,974');
  const [liveGold22K, setLiveGold22K] = useState<string>('₹1,28,310');
  const [liveSilver999, setLiveSilver999] = useState<string>('₹2,16,670');
  const [trendingArticles, setTrendingArticles] = useState<Article[]>(INITIAL_ARTICLES.slice(0, 3));

  useEffect(() => {
    fetch('/api/bullion-rates')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.gold24KPer10g) {
          setLiveGold24K(formatINR(data.gold24KPer10g));
        }
        if (data?.gold22KPer10g) {
          setLiveGold22K(formatINR(data.gold22KPer10g));
        }
        if (data?.silver999PerKg) {
          setLiveSilver999(formatINR(data.silver999PerKg));
        }
      })
      .catch(() => {});

    fetch('/api/articles')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.articles && Array.isArray(data.articles)) {
          setTrendingArticles(data.articles.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const liveBenchmarks: BenchmarkItem[] = [
    {
      id: 'gold-24k',
      label: 'Gold 24K (per 10g)',
      value: liveGold24K,
      delta: 'Live Spot',
      isPositive: true,
      category: 'Bullion (MCX / IBJA)',
    },
    {
      id: 'gold-22k',
      label: 'Gold 22K (Hallmark 916)',
      value: liveGold22K,
      delta: 'Live Spot',
      isPositive: true,
      category: 'Jewelry Benchmark',
    },
    {
      id: 'silver-999',
      label: 'Silver 999 (per 1kg)',
      value: liveSilver999,
      delta: 'Live Spot',
      isPositive: true,
      category: 'MCX Spot Bullion',
    },
    {
      id: 'repo-rate',
      label: 'Home Loan Prime Rate',
      value: '8.40% – 8.65%',
      delta: 'RBI Steady',
      isPositive: true,
      category: 'Monetary Policy',
    },
    {
      id: 'std-deduction',
      label: 'Standard Deduction (FY 2025-26)',
      value: '₹75,000',
      delta: 'Sec 115BAC',
      isPositive: true,
      category: 'FY 2025-26',
    },
    {
      id: 'surya-ghar',
      label: 'PM Surya Ghar Subsidy (3kW)',
      value: '₹78,000',
      delta: 'Direct DBT',
      isPositive: true,
      category: 'Central Scheme',
    },
    {
      id: 'epf-rate',
      label: 'EPF Statutory Rate',
      value: '8.25% p.a.',
      delta: 'Compounded',
      isPositive: true,
      category: 'EPFO India',
    },
  ];

  const HOME_FAQS = [
    {
      q: 'What is BharatCalc and how are calculations kept accurate with Indian regulations?',
      a: 'BharatCalc is a high-performance suite of financial, tax, and consumer utility calculators tailored specifically for India. Every algorithm is continuously calibrated against statutory Indian regulatory mandates, including Ministry of Finance FY 2025-26 income tax amendments (Section 115BAC), RBI floating-rate prepayment guidelines, Bureau of Indian Standards (BIS) gold & silver hallmarking rules, and MNRE PM Surya Ghar subsidy guidelines.',
    },
    {
      q: 'Why are gold prices in India different across Yahoo Finance, GoldAPI, and local jewelry showrooms?',
      a: 'Precious metal prices in India depend on several regulatory layers: (1) International OTC Spot vs COMEX Futures, (2) Statutory Indian Customs Import Duty (reduced to 6% in Budget 2024), (3) Local bullion association city premiums, (4) Showroom making charges (typically 8%–18%), and (5) Statutory 3% GST on jewelry. BharatCalc provides live institutional spot and domestic import-duty adjusted feeds so you know the exact pure bullion benchmark before negotiating at the showroom.',
    },
    {
      q: 'How does the enhanced ₹75,000 standard deduction under the New Tax Regime affect take-home salary in FY 2025-26?',
      a: 'Under the New Tax Regime for FY 2025-26 (Section 115BAC), the standard deduction for salaried employees is ₹75,000. In addition, the 5% tax bracket covers ₹3L–₹7L, 10% covers ₹7L–₹10L, and 15% covers ₹10L–₹12L. Combined with the Section 87A full rebate for taxable income up to ₹7 Lakhs, individuals earning up to ₹7,75,000 pay zero income tax, while higher earners save up to ₹17,500 annually in taxes.',
    },
    {
      q: 'How can paying 1 extra EMI per year cut a 20-year home loan down to 12 years?',
      a: 'Because bank EMIs are front-loaded with interest in the first decade of a mortgage, regular monthly payments barely touch the principal. Making 1 extra EMI payment each year directs 100% of that capital straight into reducing the principal balance. This removes the compounding interest that would have accrued on that principal over the remaining 10–15 years, eliminating up to 8 years of tenure and saving ₹15+ Lakhs.',
    },
    {
      q: 'How much subsidy does the PM Surya Ghar: Muft Bijli Yojana provide for rooftop solar?',
      a: 'Under the central government scheme, residential households receive direct financial assistance (DBT) deposited straight into their bank accounts: ₹30,000 for 1 kW systems, ₹60,000 for 2 kW systems, and the maximum central subsidy of ₹78,000 for systems of 3 kW or higher. Many state governments offer additional top-up subsidies, allowing payback in under 4 years.',
    },
    {
      q: 'Is my financial data stored, tracked, or sent to any server?',
      a: 'No. BharatCalc operates strictly with client-side execution. All salary computations, mortgage balances, fuel numbers, and invoice entries are processed locally inside your web browser. No personal financial data, mobile numbers, or income figures are ever logged, tracked, or transmitted to any external server.',
    },
  ];

  return (
    <div className="flex flex-col w-full">
      <SeoHead
        title="BharatCalc – Fast Indian Financial, Tax & Utility Calculators"
        description="Free, high-performance financial calculators for India: In-Hand Salary (FY 2025-26), Gold Jewelry 3% GST Bills, Home Loan Prepayment Saver, Fuel Spend, and PM Surya Ghar Solar Subsidy."
        canonicalPath="/"
        breadcrumbs={[{ name: 'Home', path: '/' }]}
        faqs={HOME_FAQS}
      />
      {/* 1. Floating Live Benchmark Ribbon (No horizontal scroll, wraps gracefully) */}
      <section
        aria-label="Live Benchmark Ticker"
        className="w-full bg-slate-900 border-b border-slate-800 text-white py-2.5 px-4"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 shrink-0 uppercase tracking-wider bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Live Ticker</span>
          </div>

          {/* Floating Benchmark Badges without horizontal scroll */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {liveBenchmarks.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-2.5 py-1 rounded-lg transition-colors"
              >
                <span className="text-slate-400 text-[11px] whitespace-nowrap">{item.label}:</span>
                <span className="font-bold text-slate-100 font-mono whitespace-nowrap">{item.value}</span>
                <span
                  className={`text-[10px] font-semibold px-1 rounded whitespace-nowrap ${
                    item.isPositive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'text-slate-400'
                  }`}
                >
                  {item.delta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/50 py-12 md:py-16 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Engineered for Indian Taxpayers, Homeowners & Consumers</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 font-display leading-tight">
                India&apos;s Most Accurate <br />
                <span className="text-emerald-600">Financial & Utility</span> Engines.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Calculate your true In-Hand Salary under the revised FY 2025-26 New Tax Regime, decode jewelers&apos; 3% GST bills, save ₹10+ Lakhs on Home Loans, and compute PM Surya Ghar rooftop solar subsidies with 100% mathematical fidelity.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/calculators/in-hand-salary"
                  id="hero-primary-cta"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all active:scale-95"
                >
                  <IndianRupee className="w-4 h-4" />
                  <span>Check In-Hand Salary</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/calculators/home-loan-prepayment"
                  id="hero-secondary-cta"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-sm shadow-xs transition-colors"
                >
                  <Home className="w-4 h-4 text-blue-600" />
                  <span>Loan Prepayment Tool</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-slate-600 border-t border-slate-200/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>FY 2025-26 Slabs & ₹75k Deduction</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Client-Side Privacy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Free & Open Access</span>
                </div>
              </div>
            </div>

            {/* Right Quick Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200/90 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500" />

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Quick Salary Preview</h3>
                      <p className="text-[11px] text-slate-500">New Tax Regime Standard Deduction ₹75k</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                    FY 2025-26
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                      <span>Annual CTC</span>
                      <span className="text-emerald-700 font-bold font-mono">{formatINR(quickSalaryCTC)}</span>
                    </div>
                    <input
                      type="range"
                      min={300000}
                      max={3000000}
                      step={50000}
                      value={quickSalaryCTC}
                      onChange={(e) => setQuickSalaryCTC(Number(e.target.value))}
                      className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                      aria-label="Annual CTC Quick Slider"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                      <span>₹3 Lakh</span>
                      <span>₹15 Lakh</span>
                      <span>₹30 Lakh</span>
                    </div>
                  </div>

                  {/* Calculated summary metrics */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Est. Monthly In-Hand</span>
                      <span className="text-lg font-black text-slate-900 font-mono">
                        {formatINR(Math.round((quickSalaryCTC * 0.82) / 12))}
                      </span>
                      <span className="text-[10px] text-emerald-600 block mt-0.5">~82% of CTC</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Standard Deduction</span>
                      <span className="text-lg font-black text-emerald-700 font-mono">₹75,000</span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">FY 2025-26 Deduction</span>
                    </div>
                  </div>

                  <Link
                    to="/calculators/in-hand-salary"
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                  >
                    <span>Open Full CTC Breakdown & Slabs</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Google AdSense Banner (Enforcing >= 32px safe clearance) */}
      <div className="max-w-7xl mx-auto px-4 w-full">
        <AdBanner format="leaderboard" slotId="home-leaderboard-top" />
      </div>

      {/* Live Bullion & Precious Metals Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <BullionTicker />
      </section>

      {/* 3. High-Performance Calculator Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full" aria-label="Available Calculators">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Precision Calculation Suite
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Explore All BharatCalc Financial & Utility Tools
          </h2>
          <p className="text-sm text-slate-600">
            Engineered with strict statutory rules, explicit Indian currency formatting, and instant real-time reactive feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CALCULATOR_CARDS.map((calc) => {
            const Icon = calc.icon;
            return (
              <Link
                key={calc.id}
                to={calc.href}
                id={`card-tool-${calc.id}`}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-emerald-300 hover:ring-2 hover:ring-emerald-500/10 transition-all flex flex-col justify-between group cursor-pointer block text-left"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${calc.accentColor} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${calc.badgeColor}`}>
                      {calc.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {calc.title}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{calc.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{calc.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">{calc.stats}</span>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-emerald-900 group-hover:translate-x-1 transition-all"
                  >
                    <span>Open Calculator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Trending Financial & Commodity Explainers Section */}
      <section className="py-12 bg-slate-50/80 border-t border-slate-200" aria-label="Trending Explainers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span>Regulatory Grounding & Market Analysis</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                Trending Financial & Commodity Explainers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Authoritative guides unpacking bullion surges, tax slabs, fuel economies, and mortgage amortizations.
              </p>
            </div>

            <Link
              to="/explainers"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline shrink-0"
            >
              <span>Explore All Explainers</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingArticles.map((article) => (
              <Link
                key={article.id}
                to={`/explainers/${article.slug}`}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between group text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {article.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(article.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Read Explainer</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* User Guarantees & Privacy Section */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Statutory Tax & Regulatory Accuracy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculators are calibrated strictly with official Indian statutory mandates — including FY 2025-26 Section 115BAC slabs, ₹75,000 standard deduction, Section 87A marginal rebate, BIS hallmarking rules, and PM Surya Ghar central subsidies.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Instant Local Computation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                All calculation algorithms execute locally on your device in less than 5 milliseconds. Experience instant reactive slider responses with zero delay, zero lag, and full mobile optimization.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900">100% Client-Side Privacy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your personal finances, salary numbers, and loan balances never leave your device. All math runs entirely in your browser without requiring logins, phone numbers, or account sign-ups.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Frequently Asked Questions Section */}
      <section className="py-14 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Consumer & Financial Knowledge Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Frequently Asked Questions on Indian Financial Planning
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
              Clear answers to the most common questions regarding income tax revisions, bullion billing transparency, mortgage prepayment math, and government subsidies.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs divide-y divide-slate-200/70">
            {HOME_FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm sm:text-base hover:text-emerald-700 transition-colors focus:outline-hidden"
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 pr-4 animate-in fade-in duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* In-Feed Responsive Ad Container */}
      <div className="max-w-4xl mx-auto px-4 w-full">
        <AdBanner format="in-feed" slotId="home-bottom-in-feed" />
      </div>
    </div>
  );
};

export default HomePage;
