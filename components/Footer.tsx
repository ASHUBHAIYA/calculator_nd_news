import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, ShieldCheck, FileText, Lock, Info, ExternalLink } from 'lucide-react';
import { NAV_LINKS } from './Navbar';

interface FooterProps {
  onOpenComplianceModal?: (tab: 'about' | 'privacy' | 'terms' | 'disclaimer') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenComplianceModal }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      {/* Top Banner with Trust Signals */}
      <div className="border-b border-slate-800/80 py-6 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-slate-300">
              Statutory Accuracy Engine: Updated for FY 2025-26 & MNRE Surya Ghar Guidelines.
            </span>
          </div>
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Client-Side Privacy (Zero Server Storage)
            </span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline">RBI Reducing EMI Formulations</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="font-black text-xl text-white font-display">
                Bharat<span className="text-emerald-400">Calc</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              BharatCalc is India&apos;s premier open financial and utility engineering suite. Designed for salaried professionals, consumers, homeowners, and taxpayers with zero clutter, zero dark patterns, and verified statutory formulas.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                INR Format (`en-IN`)
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Section 115BAC
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                BIS Hallmarking
              </span>
            </div>
          </div>

          {/* Calculators Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Tax & Finance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/calculators/in-hand-salary"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  In-Hand Salary Calculator (New Regime)
                </Link>
              </li>
              <li>
                <Link
                  to="/calculators/gold-jewelry-bill"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Gold Jewelry GST Invoice Calculator
                </Link>
              </li>
              <li>
                <Link
                  to="/calculators/home-loan-prepayment"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Home Loan Prepayment Saver
                </Link>
              </li>
            </ul>
          </div>

          {/* Utility Engines Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Daily Utilities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/calculators/commute-fuel"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Commute Fuel Spend Calculator
                </Link>
              </li>
              <li>
                <Link
                  to="/calculators/solar-rooftop"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  PM Surya Ghar Solar Subsidy Calculator
                </Link>
              </li>
              <li>
                <Link
                  to="/explainers"
                  className="text-emerald-400 font-semibold hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Trending Financial Explainers</span>
                  <span className="text-[9px] px-1 py-0.2 bg-emerald-950 text-emerald-300 rounded border border-emerald-800">
                    Blog
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Live Benchmark Rates Ticker
                </Link>
              </li>
            </ul>
          </div>

          {/* Regulatory & AdSense Compliance Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Compliance & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenComplianceModal?.('about')}
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                  id="footer-about-link"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  About BharatCalc
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenComplianceModal?.('privacy')}
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                  id="footer-privacy-link"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenComplianceModal?.('terms')}
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                  id="footer-terms-link"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenComplianceModal?.('disclaimer')}
                  className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                  id="footer-disclaimer-link"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  Statutory Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimer Warning (Critical for Financial AdSense Compliance) */}
        <div className="mt-10 pt-8 border-t border-slate-800 text-slate-400 text-xs leading-relaxed space-y-2">
          <p>
            <strong className="text-slate-300">Regulatory Disclaimer:</strong> BharatCalc provides mathematical models and educational computations based on Indian statutory announcements, including the Income Tax Act (Section 115BAC), standard bank reducing EMI formulations, BIS Hallmarking order, and MNRE PM Surya Ghar guidelines. These computations are for informational estimation only and do not constitute certified financial, tax, or legal advice. Consult a qualified Chartered Accountant (CA) or certified investment advisor for statutory tax returns and formal loan agreements.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 text-slate-400 text-xs">
            <p>© {currentYear} BharatCalc. All rights reserved. Made for Indian taxpayers and consumers.</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 sm:mt-0">
              <span className="text-[11px] text-slate-400">100% Private Client-Side Calculation</span>
              <span className="text-slate-700">•</span>
              <span className="text-[11px] text-slate-400">Updated for FY 2025-26</span>
              <span className="text-slate-700">•</span>
              <span className="text-[11px] text-slate-400">Zero Registration Required</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
