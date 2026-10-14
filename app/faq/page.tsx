import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SeoHead } from '@/components/SeoHead';
import { HelpCircle, ChevronDown, ChevronUp, IndianRupee, Coins, Home, Sun, ShieldCheck } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_SECTIONS: Array<{ category: string; icon: React.ComponentType<{ className?: string }>; faqs: FaqItem[] }> = [
  {
    category: 'Income Tax & In-Hand Salary (FY 2026-27)',
    icon: IndianRupee,
    faqs: [
      {
        question: 'What are the revised tax slabs under the Section 115BAC New Tax Regime for FY 2026-27?',
        answer:
          'Under the Union Budget for FY 2026-27 (AY 2027-28), the New Tax Regime revised slabs are: Up to ₹3,00,000: Nil (0%); ₹3,00,001 to ₹7,00,000: 5%; ₹7,00,001 to ₹10,00,000: 10%; ₹10,00,001 to ₹12,00,000: 15%; ₹12,00,001 to ₹15,00,000: 20%; and Above ₹15,00,000: 30%.',
      },
      {
        question: 'How much is the Standard Deduction for salaried individuals in FY 2026-27?',
        answer:
          'The standard deduction for salaried employees under the New Tax Regime is ₹75,000 (increased from ₹50,000). Salaried individuals earning up to ₹7,75,000 pay zero income tax after combining the ₹75,000 standard deduction and the Section 87A rebate.',
      },
      {
        question: 'How does Section 87A rebate work under the New Tax Regime?',
        answer:
          'Under Section 87A for the New Tax Regime, resident individuals with total taxable income not exceeding ₹7,00,000 are eligible for a rebate of up to ₹25,000, reducing their net income tax liability to zero.',
      },
    ],
  },
  {
    category: 'Gold & Silver Jewelry GST & BIS Hallmarking',
    icon: Coins,
    faqs: [
      {
        question: 'How is GST calculated on gold jewelry purchases in India?',
        answer:
          'In India, GST on jewelry is levied at a flat 3% on the combined total value of (Net Gold Value + Making Charges). In addition, BIS hallmarking fee is ₹45 + 18% GST = ₹53.10 per gold item.',
      },
      {
        question: 'What is the formula to calculate 22K gold rate from 24K pure bullion spot rate?',
        answer:
          '22 Karat gold represents 22/24 parts (91.67%) pure gold. The standard benchmark formula is: 22K Rate = (24K Pure Rate / 24) * 22. Jewelers often add making charges (usually 8% to 18%) depending on the intricacy of the piece.',
      },
      {
        question: 'What is a 6-digit HUID in gold jewelry?',
        answer:
          'HUID stands for Hallmark Unique Identification. As mandated by the Bureau of Indian Standards (BIS), every hallmarked jewelry article is laser-stamped with a unique 6-digit alphanumeric code guaranteeing certified purity.',
      },
    ],
  },
  {
    category: 'Home Loan Prepayments & Amortization',
    icon: Home,
    faqs: [
      {
        question: 'How does making extra principal prepayments reduce home loan interest?',
        answer:
          'Banks compute interest on a monthly reducing balance basis. When you make an extra prepayment directly against principal, it lowers your remaining outstanding balance immediately, drastically shrinking the compound interest generated over the loan term.',
      },
      {
        question: 'Are there foreclosure or prepayment penalty charges on floating-rate home loans?',
        answer:
          'According to Reserve Bank of India (RBI) guidelines, scheduled commercial banks and housing finance companies cannot charge any prepayment or foreclosure penalties on floating-rate housing loans given to individual borrowers.',
      },
    ],
  },
  {
    category: 'PM Surya Ghar Solar Subsidy',
    icon: Sun,
    faqs: [
      {
        question: 'What is the government subsidy amount under PM Surya Ghar: Muft Bijli Yojana?',
        answer:
          'Under the PM Surya Ghar scheme, the Central Government provides Direct Benefit Transfer (DBT) subsidies: ₹30,000 for 1 kW rooftop solar systems, ₹60,000 for 2 kW systems, and ₹78,000 for systems of 3 kW or higher capacity.',
      },
      {
        question: 'How much roof space is required for a 3 kW solar rooftop setup?',
        answer:
          'A standard 3 kW residential rooftop solar setup requires approximately 300 to 350 square feet of shadow-free rooftop area and generates about 360 to 420 kWh (units) of clean electricity every month.',
      },
    ],
  },
  {
    category: 'Privacy, Cookies & AdSense Compliance',
    icon: ShieldCheck,
    faqs: [
      {
        question: 'Does BharatCalc store or sell my salary or financial numbers?',
        answer:
          'No. BharatCalc is built on a 100% client-side calculation architecture. All mathematical calculations run strictly in your web browser. We do not store your CTC, loan amounts, or personal numbers on any backend servers.',
      },
      {
        question: 'Why does BharatCalc show advertisements?',
        answer:
          'BharatCalc provides completely free, unlimited access to all calculators and tools without charging any subscription or locking features behind paywalls. Standard Google AdSense advertisements help fund high-speed servers and ongoing updates.',
      },
    ],
  },
];

export const FaqPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    '0-0': true,
    '1-0': true,
    '2-0': true,
  });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const allFaqsFlat = FAQ_SECTIONS.flatMap((s) => s.faqs);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SeoHead
        title="Frequently Asked Questions (FAQ) – Indian Tax, Bullion & Utilities"
        description="Comprehensive FAQs covering FY 2026-27 New Tax Regime slabs, Section 115BAC deductions, gold jewelry 3% GST formulas, home loan prepayments, and PM Surya Ghar solar subsidies."
        canonicalPath="/faq"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' },
        ]}
        faqs={allFaqsFlat.map((f) => ({ q: f.question, a: f.answer }))}
      />

      {/* Header */}
      <div className="border-b border-slate-200 pb-8 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Knowledge Base & Frequently Asked Questions</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 font-display tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-base text-slate-600 mt-3 leading-relaxed">
          Clear, authoritative answers to common questions on Indian statutory tax provisions, gold jewelry billing, home loan amortizations, and website policies.
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-8">
        {FAQ_SECTIONS.map((section, sIdx) => {
          const Icon = section.icon;
          return (
            <div
              key={section.category}
              className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs"
            >
              <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-100">
                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                  <Icon className="w-4 h-4" />
                </div>
                <span>{section.category}</span>
              </h2>

              <div className="space-y-3">
                {section.faqs.map((faq, fIdx) => {
                  const key = `${sIdx}-${fIdx}`;
                  const isOpen = !!openItems[key];
                  return (
                    <div
                      key={faq.question}
                      className="rounded-xl border border-slate-200/80 overflow-hidden transition-all bg-slate-50/50"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(key)}
                        className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-4 font-semibold text-sm text-slate-900 hover:bg-slate-100/70 transition-colors"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Help Banner */}
      <div className="mt-10 p-6 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h3 className="text-sm font-bold text-emerald-950">Have a question not listed here?</h3>
          <p className="text-xs text-emerald-800 mt-1">
            Our engineering desk can help review specific edge cases or statutory provisions.
          </p>
        </div>
        <Link
          to="/contact"
          className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
        >
          Contact Support Desk
        </Link>
      </div>
    </div>
  );
};
