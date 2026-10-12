import React from 'react';
import { SeoHead } from '@/components/SeoHead';
import { FileText, ShieldCheck } from 'lucide-react';

export const TermsOfServicePage: React.FC = () => {
  const lastUpdated = 'October 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SeoHead
        title="Terms of Service – BharatCalc"
        description="Terms and conditions governing the use of BharatCalc's financial and daily utility calculation engines."
        canonicalPath="/terms-of-service"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Terms of Service', path: '/terms-of-service' },
        ]}
      />

      <div className="border-b border-slate-200 pb-8 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
          <FileText className="w-3.5 h-3.5 text-emerald-600" />
          <span>Legal & User Terms</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Last Updated: <strong>{lastUpdated}</strong> • Effective Date: January 1, 2026
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">1. Agreement to Terms</h2>
          <p>
            By accessing or using BharatCalc (https://bharatcalc.in), you agree to be bound by these Terms of Service and all applicable laws and regulations in India. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">2. Educational &amp; Estimation Utility Only</h2>
          <p>
            BharatCalc provides automated calculation tools for estimation, informational, and educational purposes. While every effort is made to maintain mathematical consistency with the Income Tax Act (Section 115BAC), RBI guidelines, and BIS hallmarking specifications, outputs do not constitute certified financial, tax, investment, or legal advice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">3. Intellectual Property Rights</h2>
          <p>
            All custom UI components, calculation algorithms, editorial explainers, and branding on BharatCalc are the intellectual property of BharatCalc and are protected by applicable copyright and trademark law.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">4. Limitation of Liability</h2>
          <p>
            In no event shall BharatCalc or its developers be liable for any damages (including, without limitation, damages for loss of profit, tax penalties, or business interruption) arising out of the use or inability to use the materials on BharatCalc. Users are advised to verify statutory tax filings with a certified Chartered Accountant (CA).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">5. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in India.
          </p>
        </section>
      </div>
    </div>
  );
};
