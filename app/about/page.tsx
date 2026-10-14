import React from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '@/components/SeoHead';
import { ShieldCheck, Calculator, Award, Users, BookOpen, ArrowRight, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SeoHead
        title="About BharatCalc – Mission, Team & Statutory Accuracy Policy"
        description="Learn about BharatCalc, India's premier open financial and utility calculation suite. Built with 100% client-side privacy, official Union Budget FY 2026-27 rules, and BIS Hallmarking standards."
        canonicalPath="/about-us"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About Us', path: '/about-us' },
        ]}
      />

      {/* Header */}
      <div className="border-b border-slate-200 pb-8 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Statutory Calculation Engineering</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
          About Bharat<span className="text-emerald-600">Calc</span>
        </h1>
        <p className="text-base text-slate-600 mt-3 leading-relaxed">
          BharatCalc is an independent, non-commercial financial engineering and daily utility suite built for Indian salaried professionals, taxpayers, consumers, and homeowners.
        </p>
      </div>

      {/* Core Mission & Philosophy */}
      <div className="space-y-8 text-slate-700 leading-relaxed text-sm">
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            Our Mission: Zero Clutter, 100% Mathematical Precision
          </h2>
          <p>
            The Indian consumer financial landscape is riddled with calculators bloated with hidden marketing traps, outdated tax slabs, biased lead-generation forms, and opaque formula markups. 
          </p>
          <p>
            BharatCalc was founded to provide transparent, instant, and mathematically accurate financial models grounded strictly in Indian statutory law:
          </p>
          <ul className="space-y-2.5 pt-2">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Income Tax Act (Section 115BAC):</strong> Updated for FY 2026-27 with the ₹75,000 standard deduction, ₹7 Lakh Section 87A rebate, marginal relief, and EPF/PT rules.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Bureau of Indian Standards (BIS):</strong> Enforcing 6-digit HUID hallmarking purity standards and explicit 3% GST computation for gold and silver jewelry.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Reserve Bank of India (RBI):</strong> Standard monthly reducing balance loan amortizations with accurate prepayment compound savings formulas.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Ministry of New & Renewable Energy (MNRE):</strong> Direct Benefit Transfer (DBT) subsidy scales under the PM Surya Ghar Muft Bijli Yojana.</span>
            </li>
          </ul>
        </section>

        {/* 100% Client-Side Privacy Guarantee */}
        <section className="bg-emerald-50/50 rounded-2xl p-6 sm:p-8 border border-emerald-200/70 space-y-3">
          <h2 className="text-lg font-bold text-emerald-950 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            100% Client-Side Privacy Policy
          </h2>
          <p className="text-emerald-900 text-sm">
            We do not require user account registration, phone numbers, or email addresses to run any calculations. All mathematical processing for salary, tax slabs, loan amortization schedules, and jewelry bills executes entirely in your browser using client-side JavaScript. Your confidential financial data never leaves your device.
          </p>
        </section>

        {/* Editorial Standards & Transparency */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Editorial Transparency & Accuracy Verifications
          </h2>
          <p>
            All financial explainers and calculation algorithms are reviewed regularly whenever official notifications are gazetted by the Ministry of Finance, CBDT, RBI, or IBJA. Our engine undergoes automated unit testing with standard benchmark cases to eliminate edge-case rounding errors.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/explainers"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              <span>Explore Financial Explainers</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
            >
              <span>Read Knowledge Base & FAQs</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};
