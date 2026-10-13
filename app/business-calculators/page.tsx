import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Percent,
  Layers,
  Truck,
  Scale,
  CreditCard,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { SeoHead } from '@/components/SeoHead';

export const BUSINESS_CALCULATOR_ITEMS = [
  {
    id: 'wholesale-profit-margin',
    title: 'Wholesale Profit Margin Calculator',
    shortTitle: 'Wholesale Margin',
    subtitle: 'Batch Revenue, Expenses, Markup & Break-Even Prices',
    description:
      'Calculate wholesale profit margins, cost markups, batch expenses, and break-even selling prices for B2B distributors and bulk trade.',
    path: '/business-calculators/wholesale-profit-margin-calculator',
    icon: Percent,
    accentColor: 'from-emerald-500 to-teal-700',
    badge: 'Margin vs Markup',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    stats: 'Break-even & Target Margin Engine',
  },
  {
    id: 'supplier-scheme',
    title: 'Supplier Scheme Calculator',
    shortTitle: 'Supplier Schemes',
    subtitle: 'Compare "Buy 10 Get 1" vs Cash & Trade Discounts',
    description:
      'Compare vendor promotions side-by-side: evaluate free unit offers (Buy 10 Get 1, Buy 100 Get 10) against percentage and rupee cash discounts.',
    path: '/business-calculators/supplier-scheme-calculator',
    icon: Layers,
    accentColor: 'from-blue-500 to-indigo-700',
    badge: 'Vendor Comparison',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    stats: 'Side-by-Side Savings Matrix',
  },
  {
    id: 'landed-cost',
    title: 'Landed Cost Calculator',
    shortTitle: 'Landed Cost',
    subtitle: 'Freight, Hamali, Packaging & Separate Recoverable GST',
    description:
      'Compute accurate inventory landed costs per unit by factoring transport, handling, packaging, and non-recoverable levies while isolating ITC GST.',
    path: '/business-calculators/landed-cost-calculator',
    icon: Truck,
    accentColor: 'from-amber-500 to-yellow-700',
    badge: 'Ind AS 2 Valuation',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    stats: 'Separates Recoverable GST (ITC)',
  },
  {
    id: 'margin-vs-markup',
    title: 'Margin vs Markup Calculator',
    shortTitle: 'Margin vs Markup',
    subtitle: 'Formulas, Conversion & Pricing Numerical Examples',
    description:
      'Convert effortlessly between profit margins and markups. Determine required retail selling prices with simple worked numerical examples.',
    path: '/business-calculators/margin-vs-markup-calculator',
    icon: Scale,
    accentColor: 'from-purple-500 to-pink-700',
    badge: 'Pricing Formulas',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    stats: '20% Margin = 25% Markup',
  },
  {
    id: 'credit-sale-cost',
    title: 'Credit Sale Cost Calculator',
    shortTitle: 'Credit Sale Cost',
    subtitle: 'Working Capital Carrying Cost for 30/60/90 Days Terms',
    description:
      'Estimate the hidden financing cost of granting trade credit to buyers against your bank CC/OD borrowing rates, with net proceeds analysis.',
    path: '/business-calculators/credit-sale-cost-calculator',
    icon: CreditCard,
    accentColor: 'from-rose-500 to-red-700',
    badge: 'Receivables Cost',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    stats: 'Calculates Working Capital Drag',
  },
  {
    id: 'gst-inclusive-price',
    title: 'GST-Inclusive Price Calculator',
    shortTitle: 'GST Reverse Math',
    subtitle: 'Reverse-Calculate Taxable Base & CGST/SGST/IGST Slabs',
    description:
      'Extract the base taxable value from MRP or inclusive invoices, or add GST to exclusive prices across 0%, 3%, 5%, 12%, 18%, and 28% slabs.',
    path: '/business-calculators/gst-inclusive-price-calculator',
    icon: FileText,
    accentColor: 'from-teal-500 to-emerald-700',
    badge: '0% to 28% Slabs',
    badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
    stats: 'Intra vs Inter-State Splitting',
  },
];

export const BusinessCalculatorsHubPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const FAQS = [
    {
      q: 'What is the purpose of BharatCalc’s Business Calculators suite?',
      a: 'The Business Calculators suite is engineered specifically for Indian retail shopkeepers, FMCG distributors, wholesalers, and MSMEs. It provides fast, client-side financial tools to calculate wholesale margins, evaluate supplier promotional schemes, establish accurate landed product costs, evaluate working capital credit carrying drag, and reverse-calculate GST invoice amounts.',
    },
    {
      q: 'Are these calculators calibrated for Indian business and GST norms?',
      a: 'Yes. All formulas comply with Indian commercial practices: standard CBIC GST slabs (0%, 3%, 5%, 12%, 18%, 28%), separate treatment of Input Tax Credit (ITC) under Ind AS 2 inventory valuation rules, Day-basis carrying cost formulas for bank CC/OD accounts, and standard trade discount structures.',
    },
    {
      q: 'Are any financial inputs or commercial margins stored on servers?',
      a: 'No. All calculations run strictly in your web browser with 100% client-side execution. None of your business data, unit costs, pricing margins, or supplier details are ever logged or transmitted.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="Business & Trade Calculators for Indian Retailers & Wholesalers | BharatCalc"
        description="Free, high-performance business calculators for India: Wholesale Profit Margins, Supplier Scheme Comparisons, Landed Costs, Margin vs Markup, Credit Sale Cost, and GST-Inclusive Prices."
        canonicalPath="/business-calculators"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Business Calculators', path: '/business-calculators' },
        ]}
        faqs={FAQS}
      />

      {/* Hero Header */}
      <section className="bg-white border-b border-slate-200/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
              <span>Commercial &amp; Trade Suite</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
              Business &amp; Commercial Calculators
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Precision calculators tailored for Indian wholesalers, distributors, retail shopkeepers, and MSMEs. Eliminate guesswork in bulk margins, supplier promotions, landed inventory costs, credit sale terms, and GST invoicing.
            </p>
          </div>
        </div>
      </section>

      {/* Grid of Business Calculators */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BUSINESS_CALCULATOR_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs hover:shadow-lg hover:border-emerald-300 hover:ring-2 hover:ring-emerald-500/10 transition-all flex flex-col justify-between group cursor-pointer text-left"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.accentColor} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-bold text-lg text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{item.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">{item.stats}</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 group-hover:text-emerald-900 group-hover:translate-x-1 transition-all">
                    <span>Open Calculator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Benefits Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Commercial Integrity</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              Built Specifically for Indian Wholesale &amp; Retail Realities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">FMCG &amp; Retail Scheme Math</span>
              <p>
                Decode vendor scheme incentives accurately. Never confuse a &quot;Buy 10 Get 1 Free&quot; (9.09% discount) with a genuine 10% bill cash discount.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">True Landed Cost Accounting</span>
              <p>
                Capitalize all transport, hamali, and packaging overheads while keeping claimable Input Tax Credit (ITC) distinct from inventory valuation.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">Debtor Carrying Drag</span>
              <p>
                Know the actual cost of granting 30, 45, or 60 days credit to distributors against your working capital borrowing rates before signing contracts.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              Frequently Asked Questions on Business Calculators
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-slate-900 hover:text-emerald-700 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
