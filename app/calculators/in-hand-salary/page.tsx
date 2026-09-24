import React, { useState, useId } from 'react';
import {
  IndianRupee,
  HelpCircle,
  TrendingDown,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PieChart as PieIcon,
  Table as TableIcon,
} from 'lucide-react';
import { calculateInHandSalary, SalaryBreakdown } from '@/lib/calculators/salary';
import { formatINR, formatNumberIN, formatCompactINR } from '@/lib/formatters';
import { AdBanner } from '@/components/AdBanner';
import { SeoHead } from '@/components/SeoHead';

export const InHandSalaryPage: React.FC = () => {
  const ctcInputId = useId();
  const basicPctId = useId();
  const epfTypeId = useId();
  const ptAnnualId = useId();

  // State
  const [annualCTC, setAnnualCTC] = useState<number>(1200000);
  const [basicPct, setBasicPct] = useState<number>(40);
  const [epfType, setEpfType] = useState<'actual' | 'capped' | 'none'>('actual');
  const [includeGratuity, setIncludeGratuity] = useState<boolean>(false);
  const [ptAnnual, setPtAnnual] = useState<number>(2400);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  // Compute breakdown reactive
  const breakdown: SalaryBreakdown = calculateInHandSalary({
    annualCTC,
    basicPercentage: basicPct,
    epfType,
    includeGratuityInCTC: includeGratuity,
    professionalTaxAnnual: ptAnnual,
    otherTaxDeductions: otherDeductions,
  });

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const FAQS = [
    {
      q: 'How does the revised New Tax Regime for FY 2025-26 affect in-hand salary?',
      a: 'For Financial Year 2025-26 (Assessment Year 2026-27), salaried employees under the New Tax Regime (Section 115BAC) receive a statutory Standard Deduction of ₹75,000. Furthermore, the rationalized tax slabs mean the 5% slab covers ₹3 Lakh – ₹7 Lakh, the 10% slab covers ₹7 Lakh – ₹10 Lakh, and the 15% slab covers ₹10 Lakh – ₹12 Lakh. Combined with the Section 87A rebate, salaried employees earning up to ₹7,75,000 pay zero income tax, while higher earners save up to ₹17,500 annually in taxes.',
    },
    {
      q: 'Why is there ₹0 income tax on taxable income up to ₹7,00,000?',
      a: 'Under Section 87A of the Income Tax Act, a resident individual whose total taxable income does not exceed ₹7,00,000 is entitled to an income tax rebate of 100% of tax payable or ₹25,000, whichever is less. Because gross salary up to ₹7,75,000 receives a ₹75,000 standard deduction, your taxable income becomes ₹7,00,000, leading to exactly ₹0 income tax under the New Regime.',
    },
    {
      q: 'What is the difference between CTC and In-Hand Salary?',
      a: 'Cost to Company (CTC) is the total financial expenditure an employer incurs on you annually. It includes components you never receive in your monthly bank transfer, such as the Employer’s matching contribution to the Employees’ Provident Fund (12% of Basic), company gratuity provisioning (4.81% of basic), health insurance group coverage, and annual bonuses. In-Hand (Take-Home) salary is the net cash deposited into your bank account after subtracting both Employer/Employee EPF, Professional Tax, and Income Tax (TDS).',
    },
    {
      q: 'How is EPF (Provident Fund) calculated on CTC?',
      a: 'Standard statutory rules mandate an employee contribution of 12% of Basic Salary towards EPF, matched by an equal 12% contribution by the employer. While high-earners may cap their statutory EPF at 12% of the statutory ceiling (₹15,000/month = ₹1,800/month or ₹21,600/year), many corporate CTC packages default to the full actual 12% of Basic salary, reducing immediate monthly cash flow in favor of long-term tax-free 8.25% compounded retirement wealth.',
    },
    {
      q: 'Does Section 87A marginal relief apply if my taxable income is slightly above ₹7,00,000?',
      a: 'Yes. To protect taxpayers from a sharp tax cliff where earning ₹1,000 extra causes ₹25,000 in tax liability, marginal relief ensures that the tax payable cannot exceed the amount by which your taxable income exceeds ₹7,00,000. BharatCalc’s statutory engine automatically calculates and incorporates this marginal relief formula.',
    },
    {
      q: 'Is Gratuity deducted from my monthly in-hand salary?',
      a: 'No, Gratuity is not a monthly cash deduction from your paycheck. However, companies frequently list Gratuity (calculated at 4.81% of Basic salary as per the Payment of Gratuity Act 1972) as part of your annual CTC package. You only receive Gratuity when leaving the company after at least 5 years of continuous service. Toggle the "Include Gratuity in CTC" option in our calculator to see how your take-home adjusts if your employer includes this provision in your CTC offer letter.',
    },
    {
      q: 'What are the New Tax Regime income tax slabs for FY 2025-26?',
      a: 'Under Section 115BAC for FY 2025-26 (AY 2026-27): (1) Up to ₹3,00,000: Nil (0%), (2) ₹3,00,001 to ₹7,00,000: 5%, (3) ₹7,00,001 to ₹10,00,000: 10%, (4) ₹10,00,001 to ₹12,00,000: 15%, (5) ₹12,00,001 to ₹15,00,000: 20%, (6) Above ₹15,00,000: 30%. A 4% Health & Education Cess applies to total tax payable.',
    },
    {
      q: 'What is Professional Tax and how much is deducted across Indian states?',
      a: 'Professional Tax (PT) is a state-level tax levied on salaried individuals under Article 276(2) of the Indian Constitution, subject to a maximum statutory ceiling of ₹2,500 per year. Most states like Maharashtra, Karnataka, Telangana, West Bengal, and Tamil Nadu deduct approximately ₹200 per month (₹2,400 to ₹2,500 annually), while states like Delhi, Haryana, and Uttar Pradesh levy zero Professional Tax.',
    },
  ];

  return (
    <div className="w-full pb-16">
      <SeoHead
        title="In-Hand Salary Calculator (FY 2025-26) | CTC to Take-Home Pay India"
        description="Calculate exact monthly take-home in-hand salary from CTC under the New Tax Regime (Section 115BAC) for FY 2025-26, ₹75,000 Standard Deduction, EPF, and PT rules."
        canonicalPath="/calculators/in-hand-salary"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Calculators', path: '/' },
          { name: 'In-Hand Salary Calculator', path: '/calculators/in-hand-salary' },
        ]}
        faqs={FAQS}
      />
      {/* 1. Dedicated Header & Breadcrumb */}
      <section className="bg-white border-b border-slate-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <span>Calculators</span>
                <span>/</span>
                <span className="text-slate-500">Income Tax & Payroll</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-display tracking-tight">
                In-Hand Salary Calculator (FY 2025-26)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl">
                Accurately convert your annual Cost to Company (CTC) into exact monthly take-home salary using the New Tax Regime (Section 115BAC) for FY 2025-26, ₹75,000 Standard Deduction, and statutory EPF/PT rules.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Banner Advertisement with >= 32px safe clearance */}
      <div className="max-w-7xl mx-auto px-4">
        <AdBanner format="leaderboard" slotId="salary-top-leaderboard" />
      </div>

      {/* 2. Interactive Calculator Engine Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Inputs (Enforcing robust 32px internal margins) */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span>Salary Parameters</span>
              </h2>
              <span className="text-[11px] font-medium text-slate-500">Instant Local Calculation</span>
            </div>

            {/* Annual CTC Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor={ctcInputId} className="text-xs font-bold text-slate-700">
                  Annual Cost to Company (CTC)
                </label>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {formatCompactINR(annualCTC)} ({formatINR(annualCTC)})
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  id={ctcInputId}
                  type="number"
                  step="50000"
                  min="0"
                  max="100000000"
                  value={annualCTC || ''}
                  onChange={(e) => setAnnualCTC(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-mono font-semibold text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  placeholder="e.g. 1200000"
                />
              </div>

              {/* Quick Preset Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-400 font-medium mr-1">Quick Presets:</span>
                {[
                  { label: '₹12L', value: 1200000 },
                  { label: '₹25L', value: 2500000 },
                  { label: '₹50L', value: 5000000 },
                  { label: '₹75L', value: 7500000 },
                  { label: '₹1 Cr', value: 10000000 },
                  { label: '₹2 Cr', value: 20000000 },
                  { label: '₹5 Cr', value: 50000000 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setAnnualCTC(preset.value)}
                    className={`text-[11px] px-2 py-0.5 rounded-md font-mono transition-all ${
                      annualCTC === preset.value
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Slider for smooth manipulation up to ₹5 Crore */}
              <input
                type="range"
                min="300000"
                max="50000000"
                step="50000"
                value={Math.min(50000000, annualCTC)}
                onChange={(e) => setAnnualCTC(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer mt-2"
                aria-label="CTC Range Slider"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>₹3 Lakh</span>
                <span>₹50 Lakh</span>
                <span>₹1 Crore</span>
                <span>₹2.5 Crore</span>
                <span>₹5 Crore</span>
              </div>
            </div>

            {/* Basic Salary Percentage Slider */}
            <div className="space-y-2 pt-1">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <label htmlFor={basicPctId} className="text-xs font-bold text-slate-700">
                    Basic Salary % of CTC
                  </label>
                  <span className="text-[10px] text-slate-400" title="Usually 40% to 50% in Indian IT & Corporate jobs">
                    (Standard: 40% - 50%)
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-800">{basicPct}%</span>
              </div>
              <input
                id={basicPctId}
                type="range"
                min="30"
                max="60"
                step="5"
                value={basicPct}
                onChange={(e) => setBasicPct(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>30% (Tech/MNCs)</span>
                <span>40% (Standard)</span>
                <span>50% (New Wage Code)</span>
              </div>
            </div>

            {/* EPF (Provident Fund) Configuration */}
            <div className="space-y-2 pt-1">
              <label htmlFor={epfTypeId} className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>Employees&apos; Provident Fund (EPF) Option</span>
                <span className="text-[10px] text-slate-500">12% Employee + 12% Employer</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setEpfType('actual')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                    epfType === 'actual'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Full 12% Basic
                  <span className="block text-[9px] font-normal text-slate-400">Standard MNC</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEpfType('capped')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                    epfType === 'capped'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Capped ₹1,800/mo
                  <span className="block text-[9px] font-normal text-slate-400">Statutory Min</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEpfType('none')}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                    epfType === 'none'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Zero EPF
                  <span className="block text-[9px] font-normal text-slate-400">Consultants</span>
                </button>
              </div>
            </div>

            {/* Optional CTC Additions: Gratuity & Professional Tax */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Gratuity in CTC</span>
                  <span className="text-[10px] text-slate-500">4.81% of Basic salary</span>
                </div>
                <input
                  type="checkbox"
                  checked={includeGratuity}
                  onChange={(e) => setIncludeGratuity(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                  aria-label="Include Gratuity in CTC"
                />
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <label htmlFor={ptAnnualId} className="text-xs font-bold text-slate-700 flex justify-between">
                  <span>Professional Tax</span>
                  <span className="text-[10px] text-slate-500">State specific</span>
                </label>
                <select
                  id={ptAnnualId}
                  value={ptAnnual}
                  onChange={(e) => setPtAnnual(Number(e.target.value))}
                  className="w-full text-xs font-medium py-1 px-2 border border-slate-200 rounded-md bg-white text-slate-800 focus:outline-hidden"
                >
                  <option value="2400">Standard ₹2,400 / yr (KA, MH, WB, AP)</option>
                  <option value="2500">₹2,500 / yr (Kerala / Tamil Nadu max)</option>
                  <option value="0">₹0 / yr (Delhi, Haryana, UP, Rajasthan)</option>
                </select>
              </div>
            </div>

            {/* Other Section 80CCD(2) / Employer NPS Deductions */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>Employer NPS Tier-1 / Additional Deductions (Sec 80CCD(2))</span>
                <span className="text-xs font-mono font-bold text-slate-700">{formatINR(otherDeductions)}</span>
              </label>
              <input
                type="number"
                min="0"
                max="500000"
                step="5000"
                value={otherDeductions || ''}
                onChange={(e) => setOtherDeductions(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono text-xs focus:outline-hidden bg-slate-50/50"
                placeholder="Optional deductible amount (₹)"
              />
            </div>
          </div>

          {/* Right Column: Live In-Hand & Salary Breakdown Result */}
          <div className="lg:col-span-6 space-y-6">
            {/* Primary Highlight In-Hand Card */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
                  Monthly Take-Home Cash
                </span>
                <span className="text-xs font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                  Net In-Hand
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono text-white">
                  {formatINR(breakdown.monthlyInHandSalary)}
                </span>
                <span className="text-xs text-slate-400 font-medium">/ month</span>
              </div>

              <p className="text-xs text-slate-400 mt-1 font-mono">
                Annual In-Hand: <strong className="text-slate-200">{formatINR(breakdown.annualInHandSalary)}</strong> ({breakdown.takeHomePercentage}% of CTC)
              </p>

              {/* Quick Stat Tiles */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-800">
                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Monthly Tax</span>
                  <span className="text-sm font-bold font-mono text-amber-400">
                    {formatINR(breakdown.totalMonthlyTax)}
                  </span>
                </div>

                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Employee EPF</span>
                  <span className="text-sm font-bold font-mono text-teal-300">
                    {formatINR(breakdown.monthlyEmployeeEPF)}
                  </span>
                </div>

                <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                  <span className="text-[10px] text-slate-400 block">Standard Ded.</span>
                  <span className="text-sm font-bold font-mono text-emerald-400">
                    ₹75,000
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Salary Structure Breakdown Table */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <TableIcon className="w-4 h-4 text-emerald-600" />
                  <span>Salary Structure & Deductions</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">Monthly / Annual</span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {/* Gross Salary Components */}
                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-600">Basic Pay ({basicPct}%)</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatINR(breakdown.monthlyBasic)} / mo ({formatINR(breakdown.annualBasic)}/yr)
                  </span>
                </div>

                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-600">HRA Allowance</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatINR(breakdown.monthlyHRA)} / mo
                  </span>
                </div>

                <div className="py-2 flex justify-between items-center">
                  <span className="text-slate-600">Special & Flexi Allowances</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {formatINR(breakdown.monthlySpecialAllowance)} / mo
                  </span>
                </div>

                <div className="py-2 flex justify-between items-center bg-slate-50/70 px-2 rounded-md font-bold">
                  <span className="text-slate-800">Gross Salary (Pre-tax)</span>
                  <span className="font-mono text-slate-900">{formatINR(breakdown.monthlyGrossSalary)} / mo</span>
                </div>

                {/* Deductions */}
                <div className="py-2 flex justify-between items-center text-red-700">
                  <span>- Employee PF (12%)</span>
                  <span className="font-mono font-semibold">-{formatINR(breakdown.monthlyEmployeeEPF)} / mo</span>
                </div>

                <div className="py-2 flex justify-between items-center text-red-700">
                  <span>- Income Tax (TDS New Regime)</span>
                  <span className="font-mono font-semibold">-{formatINR(breakdown.totalMonthlyTax)} / mo</span>
                </div>

                <div className="py-2 flex justify-between items-center text-red-700">
                  <span>- Professional Tax (PT)</span>
                  <span className="font-mono font-semibold">-{formatINR(breakdown.monthlyProfessionalTax)} / mo</span>
                </div>

                {/* Employer Retained Contributions */}
                <div className="py-2 flex justify-between items-center text-slate-500 italic text-[11px]">
                  <span>Employer EPF (Part of CTC, not in Gross)</span>
                  <span className="font-mono">{formatINR(breakdown.monthlyEmployerEPF)} / mo</span>
                </div>
              </div>
            </div>

            {/* Income Tax Slab Breakdown Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  New Tax Regime Slab Calculation (FY 2025-26)
                </h3>
                <span className="text-[11px] font-mono text-slate-500">
                  Taxable: {formatINR(breakdown.taxableIncome)}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                      <th className="py-1.5">Slab Range</th>
                      <th className="py-1.5">Rate</th>
                      <th className="py-1.5 text-right">Taxable</th>
                      <th className="py-1.5 text-right">Tax</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {breakdown.taxSlabsBreakdown.map((slab, i) => (
                      <tr key={i} className={slab.taxAmount > 0 ? 'bg-amber-50/40' : ''}>
                        <td className="py-1.5 text-slate-700">{slab.slabRange}</td>
                        <td className="py-1.5 font-bold text-slate-600">{slab.rate}</td>
                        <td className="py-1.5 text-right text-slate-600">{formatINR(slab.taxableAmountInSlab)}</td>
                        <td className="py-1.5 text-right font-bold text-slate-900">{formatINR(slab.taxAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Rebate, Surcharge & Cess Note */}
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-[11px] text-slate-500">
                {breakdown.section87aRebate > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Section 87A Tax Rebate applied:</span>
                    <span>-{formatINR(breakdown.section87aRebate)}</span>
                  </div>
                )}
                {breakdown.surcharge > 0 && (
                  <div className="flex justify-between text-amber-800 font-semibold">
                    <span>High Earner Surcharge ({(breakdown.surchargeRate * 100).toFixed(0)}% on Tax):</span>
                    <span className="font-mono">+{formatINR(breakdown.surcharge)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Health & Education Cess (4%):</span>
                  <span className="font-mono">{formatINR(breakdown.educationCess)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total Annual Income Tax:</span>
                  <span className="font-mono">{formatINR(breakdown.totalAnnualTax)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Responsive In-Feed Ad with 32px safe clearance */}
      <div className="max-w-4xl mx-auto px-4">
        <AdBanner format="in-feed" slotId="salary-in-content-slot" />
      </div>

      {/* 3. High-Quality Comprehensive SEO Content (500+ Words) */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 space-y-8 text-slate-700 text-sm leading-relaxed">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
            Comprehensive Guide to CTC vs In-Hand Salary under the FY 2025-26 New Tax Regime
          </h2>

          <p>
            When entering the Indian corporate workforce or evaluating an offer letter, the headline figure presented by Human Resources is virtually always the <strong>Cost to Company (CTC)</strong>. However, what arrives in your bank account at the end of each month—your <strong>Take-Home (In-Hand) Salary</strong>—is markedly different. Understanding the statutory deductions, tax slabs, and benefit allocations that account for this disparity is essential for effective personal financial budgeting.
          </p>

          <h3 className="text-lg font-bold text-slate-900">
            The FY 2025-26 Standard Deduction & Slabs Structure
          </h3>

          <p>
            The Union Finance Minister introduced substantial relief for salaried employees opting for the <strong>New Tax Regime under Section 115BAC</strong> of the Income Tax Act. Primary among these changes was the increase in the statutory <strong>Standard Deduction</strong> from ₹50,000 to <strong>₹75,000</strong>. This automatic deduction applies unconditionally to all salaried taxpayers without requiring documentation, rent receipts, or investment proofs.
          </p>

          <p>
            Furthermore, the tax brackets were expanded to reduce effective taxation across middle-income earners:
          </p>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-mono space-y-1">
            <p><strong>• Up to ₹3,00,000:</strong> NIL (0%)</p>
            <p><strong>• ₹3,00,001 to ₹7,00,000:</strong> 5% (Rebated under Sec 87A if taxable income ≤ ₹7L)</p>
            <p><strong>• ₹7,00,001 to ₹10,00,000:</strong> 10%</p>
            <p><strong>• ₹10,00,001 to ₹12,00,000:</strong> 15%</p>
            <p><strong>• ₹12,00,001 to ₹15,00,000:</strong> 20%</p>
            <p><strong>• Above ₹15,00,000:</strong> 30%</p>
            <p><strong>• Health & Education Cess:</strong> 4% levied on total tax payable</p>
          </div>

          <h3 className="text-lg font-bold text-slate-900">
            How EPF and Gratuity Erode Your Monthly Cash Flow
          </h3>

          <p>
            Under the Employees&apos; Provident Funds and Miscellaneous Provisions Act, 1952, employees contribute 12% of their basic pay to their EPF account, while the employer provides a matching 12% contribution. Crucially, in standard private-sector compensation letters, the <em>employer&apos;s</em> 12% contribution is bundled inside your CTC figure. As a result, 24% of your basic pay is diverted straight into your EPFO retirement corpus. While this corpus compounds at a government-backed 8.25% p.a., it cannot be accessed for immediate liquid spending.
          </p>

          <p>
            Similarly, employers frequently include a 4.81% provisioning for statutory gratuity (under the Payment of Gratuity Act, 1972) inside the annual CTC, which is only payable after completing five continuous years of service at the firm.
          </p>

          <h3 className="text-lg font-bold text-slate-900">
            Section 87A Rebate and Marginal Relief Explained
          </h3>

          <p>
            One of the most confusing statutory provisions for taxpayers earning around ₹7.5 Lakhs is Section 87A. Under the New Tax Regime, if your net taxable income (after deducting the ₹75,000 standard deduction) does not exceed ₹7,00,000, your entire tax liability (up to ₹25,000) is forgiven via a government rebate, resulting in zero tax.
          </p>

          <p>
            If your income slightly surpasses ₹7,00,000 (for example, ₹7,20,000), marginal relief intervenes to guarantee that the tax you pay cannot exceed the exact incremental income over ₹7,00,000. BharatCalc’s precision engine computes this marginal threshold dynamically.
          </p>
        </div>

        {/* FAQ Accordion Section for Rich Search Snippets */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-xl font-bold text-slate-900 font-display flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <span>Frequently Asked Questions (FAQs)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified answers to common salary slip, EPF, and tax deduction queries.
            </p>
          </div>

          <div className="divide-y divide-slate-200/70">
            {FAQS.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="py-3.5">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm hover:text-emerald-700 transition-colors focus:outline-hidden"
                    aria-expanded={isOpen}
                  >
                    <span className="pr-4">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-emerald-600 shrink-0" />
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

      {/* Bottom Leaderboard Advertisement */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        <AdBanner format="leaderboard" slotId="salary-bottom-leaderboard" />
      </div>
    </div>
  );
};

export default InHandSalaryPage;
