import React from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '@/components/SeoHead';
import { BookOpen, IndianRupee, Coins, Home, Sun, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export const GuidePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SeoHead
        title="Comprehensive Financial, Tax & Utility Guides – BharatCalc"
        description="Authoritative, step-by-step financial engineering guides covering Section 115BAC New Tax Regime slabs, BIS Hallmarking jewelry GST formulas, home loan prepayment strategies, and rooftop solar economics."
        canonicalPath="/guide"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Financial Guides', path: '/guide' },
        ]}
      />

      {/* Header */}
      <div className="border-b border-slate-200 pb-8 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Educational & Statutory Knowledge Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
          Financial &amp; Utility Guides
        </h1>
        <p className="text-base text-slate-600 mt-3 leading-relaxed">
          In-depth architectural breakdowns of Indian personal finance, statutory taxation, precious metal purchasing, and renewable energy incentives.
        </p>
      </div>

      {/* Guides Grid */}
      <div className="space-y-8">
        {/* Guide 1: In-Hand Salary & Tax Slabs */}
        <article className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">
            <IndianRupee className="w-4 h-4" />
            <span>Taxation & Salary Engineering</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-display">
            Mastering the FY 2025-26 New Tax Regime (Section 115BAC)
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            The Union Budget enhanced the default New Tax Regime to make it universally lucrative for middle-income taxpayers. Key statutory pillars include:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900">₹75,000 Standard Deduction</span>
              <p className="text-slate-600">Direct flat deduction from gross salary before slab calculation.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900">₹7,00,000 Section 87A Rebate</span>
              <p className="text-slate-600">Zero net tax for taxable income up to ₹7 Lakhs (Gross up to ₹7.75 Lakhs).</p>
            </div>
          </div>
          <div className="pt-2">
            <Link
              to="/calculators/in-hand-salary"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-900"
            >
              <span>Launch In-Hand Salary Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </article>

        {/* Guide 2: Gold & Silver Jewelry */}
        <article className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Coins className="w-4 h-4" />
            <span>Precious Metals & Hallmarking</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-display">
            How to Verify Jewelry Invoices: 3% GST &amp; BIS 6-Digit HUID
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            When buying gold or silver jewelry in India, ensure that your invoice explicitly breaks down: (1) Purity (22K Hallmark 916 or 18K 750), (2) Net Weight after deducting stone weights, (3) Making charges per gram or percentage, (4) Flat 3% GST on Net Value + Making, and (5) Statutory ₹53.10 BIS Hallmarking fee.
          </p>
          <div className="pt-2">
            <Link
              to="/calculators/gold-jewelry-bill"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-900"
            >
              <span>Launch Gold Jewelry GST Invoice Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </article>

        {/* Guide 3: Home Loan Prepayment */}
        <article className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
            <Home className="w-4 h-4" />
            <span>Debt Optimization & Real Estate</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-display">
            The Prepayment Multiplier: Slicing 8–10 Years Off Your Home Loan
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Home loans front-load interest during the first 7 to 10 years of amortization. Making one extra EMI payment every year directly against the principal can reduce total interest paid by up to 40% and save more than ₹15 Lakhs on a ₹50 Lakh loan.
          </p>
          <div className="pt-2">
            <Link
              to="/calculators/home-loan-prepayment"
              className="inline-flex items-center gap-2 text-xs font-bold text-blue-700 hover:text-blue-900"
            >
              <span>Launch Home Loan Prepayment Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </article>

        {/* Guide 4: PM Surya Ghar */}
        <article className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider">
            <Sun className="w-4 h-4" />
            <span>Renewable Energy & Central Subsidies</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-display">
            PM Surya Ghar Muft Bijli Yojana: Economics &amp; Net Metering
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            With ₹78,000 in direct DBT government subsidy for systems 3 kW and above, a residential rooftop solar system typically breaks even within 3.5 to 4 years, delivering free electricity for the remaining 20+ years of solar panel warranty.
          </p>
          <div className="pt-2">
            <Link
              to="/calculators/solar-rooftop"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-900"
            >
              <span>Launch PM Surya Ghar Solar Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};
