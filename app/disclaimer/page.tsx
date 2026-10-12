import React from 'react';
import { SeoHead } from '@/components/SeoHead';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SeoHead
        title="Statutory Disclaimer & Financial Notice – BharatCalc"
        description="Official statutory disclaimer for BharatCalc. Mathematical models, Section 115BAC computations, and precious metal rates are for informational estimation only."
        canonicalPath="/disclaimer"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Statutory Disclaimer', path: '/disclaimer' },
        ]}
      />

      <div className="border-b border-slate-200 pb-8 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
          <span>Statutory Regulatory Notice</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
          Statutory Disclaimer
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Regulatory disclosures regarding calculation models, live rates, and financial advice.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">1. No Financial, Tax, or Legal Advisory</h2>
          <p>
            BharatCalc provides mathematical algorithms designed to assist users in estimating income tax liabilities, jewelry GST invoices, home loan amortization schedules, commute fuel costs, and rooftop solar subsidies. <strong>Nothing on this website constitutes professional financial, tax, investment, or legal advice.</strong>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">2. Consult Certified Professionals</h2>
          <p>
            Tax laws and financial rules in India (including Finance Act amendments, CBDT circulars, and RBI guidelines) are subject to periodic changes and individual exemptions. Users should always consult a qualified Chartered Accountant (CA), registered tax practitioner, or certified financial planner before executing statutory tax filings, debt restructuring, or substantial jewelry purchases.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">3. Live Bullion Benchmark Rates</h2>
          <p>
            Precious metal rates (Gold 24K, Gold 22K, Silver 999) displayed on BharatCalc are aggregated from standard market reference feeds (IBJA / MCX). Local showroom retail rates may vary depending on regional jeweler associations, transportation logistics, state taxes, and hallmark charges.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 font-display">4. Accuracy of Formulas</h2>
          <p>
            While our team executes strict unit tests on all statutory formulas (Section 115BAC slabs, standard deductions, Section 87A rebate, standard reducing balance EMI formulas, MNRE subsidy slabs), BharatCalc makes no warranties regarding absolute completeness or liability for calculation discrepancies.
          </p>
        </section>
      </div>
    </div>
  );
};
