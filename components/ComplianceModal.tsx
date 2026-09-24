import React from 'react';
import { X, ShieldCheck, Lock, FileText, Info } from 'lucide-react';

export type ComplianceTab = 'about' | 'privacy' | 'terms' | 'disclaimer';

interface ComplianceModalProps {
  isOpen: boolean;
  activeTab: ComplianceTab;
  onClose: () => void;
  onSelectTab: (tab: ComplianceTab) => void;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({
  isOpen,
  activeTab,
  onClose,
  onSelectTab,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-lg text-slate-900 font-display">
              BharatCalc Compliance & Information
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => onSelectTab('about')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Info className="w-4 h-4" />
            About BharatCalc
          </button>
          <button
            onClick={() => onSelectTab('privacy')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'privacy'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4" />
            Privacy Policy
          </button>
          <button
            onClick={() => onSelectTab('terms')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'terms'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            Terms of Service
          </button>
          <button
            onClick={() => onSelectTab('disclaimer')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'disclaimer'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Statutory Disclaimer
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed max-h-[60vh]">
          {activeTab === 'about' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-slate-900">About BharatCalc</h4>
              <p>
                BharatCalc was built with a single objective: to provide Indian taxpayers, salaried workers, gold buyers, homeowners, and everyday citizens with mathematically exact, transparent, and ultra-fast financial and utility calculators.
              </p>
              <h5 className="font-semibold text-slate-800">Our Core Principles:</h5>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Statutory Rigor:</strong> All tax formulations strictly follow the Finance Act and Union Budget announcements (Section 115BAC New Tax Regime, Standard Deduction of ₹75,000, Section 87A rebate).
                </li>
                <li>
                  <strong>Standard Indian Formats:</strong> Every rupee amount is formatted strictly using the Indian grouping convention (Lakhs and Crores via <code>Intl.NumberFormat(&apos;en-IN&apos;)</code>).
                </li>
                <li>
                  <strong>100% Privacy by Architecture:</strong> All computations occur on your browser. No financial salary data or loan amounts are transmitted to or stored on remote servers.
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-slate-900">Privacy Policy (Digital Personal Data Protection Act Compliant)</h4>
              <p>
                Last updated: January 2025. At BharatCalc, your financial privacy is paramount.
              </p>
              <h5 className="font-semibold text-slate-800">1. Information Collection & Processing</h5>
              <p>
                BharatCalc runs purely client-side mathematical algorithms. The numbers you enter into the calculators (such as your salary, loan principal, or gold purchase weight) are processed inside your device&apos;s memory and are never saved to our database.
              </p>
              <h5 className="font-semibold text-slate-800">2. Cookies & Advertising Partners</h5>
              <p>
                We may serve advertisements via Google AdSense to support the free maintenance of this portal. Google and its partners may use cookies to serve personalized or non-personalized ads based on prior visits. You can learn more or opt out of personalized advertising by visiting Google&apos;s Ads Settings (<a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-emerald-600 underline">adssettings.google.com</a>).
              </p>
              <h5 className="font-semibold text-slate-800">3. Contact for Inquiries</h5>
              <p>
                For privacy questions or data protection queries, contact our editorial team at <code>privacy@bharatcalc.org</code>.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-slate-900">Terms of Service</h4>
              <p>
                By accessing and using BharatCalc, you agree to comply with and be bound by the following terms and conditions.
              </p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Permitted Use:</strong> You are granted a free, non-exclusive license to use these calculators for personal and commercial financial estimations.
                </li>
                <li>
                  <strong>No Commercial Resale of Code:</strong> Scraping, reverse engineering, or redistributing the algorithmic engines without explicit attribution is prohibited.
                </li>
                <li>
                  <strong>Limitation of Liability:</strong> Under no circumstances shall BharatCalc or its maintainers be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the calculations.
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'disclaimer' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-slate-900">Statutory & Financial Disclaimer</h4>
              <p className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900 font-medium text-xs">
                Important Notice: BharatCalc is not an authorized financial advisor, registered broker, or a certified chartered accountancy firm.
              </p>
              <p>
                1. <strong>Income Tax Computations:</strong> Income tax calculations reflect the provisions of Section 115BAC (New Tax Regime) as updated by the Union Budget. Tax liability may differ based on specific exemptions, allowances, company policies, or loss set-offs. Always verify your form 16 and file through the official Income Tax e-filing portal (eportal.incometax.gov.in).
              </p>
              <p>
                2. <strong>Gold Rates & GST:</strong> Gold rates fluctuate in real-time according to MCX (Multi Commodity Exchange) and local bullion associations (IBJA). Making charges and discounts are subject to individual jeweler discretion.
              </p>
              <p>
                3. <strong>Home Loan Prepayment:</strong> Bank terms, floating interest rates, reset periods, and prepayment penalty clauses (for non-individual borrowers) vary by lending institution.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};
