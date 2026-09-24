/**
 * CTC to In-Hand Salary Engine
 * Incorporates:
 * - FY 2025-26 New Tax Regime (Section 115BAC)
 * - Revised Standard Deduction of ₹75,000
 * - Statutory Section 87A tax rebate (up to ₹7,00,000 taxable income) with marginal relief
 * - 4% Health & Education Cess
 * - Employee & Employer EPF calculation (12% of Basic or statutory capped ₹1,800/mo)
 * - Professional Tax of ₹2,400/yr (₹200/month)
 */

export interface SalaryInput {
  annualCTC: number;
  basicPercentage?: number; // default 40% or 50%
  epfType?: 'actual' | 'capped' | 'none'; // actual 12% of basic, capped at ₹1,800/mo, or none
  includeGratuityInCTC?: boolean; // 4.81% of basic
  professionalTaxAnnual?: number; // default ₹2,400
  otherTaxDeductions?: number; // optional employee NPS tier 1 (Sec 80CCD(2))
}

export interface TaxSlabBreakdown {
  slabRange: string;
  rate: string;
  taxableAmountInSlab: number;
  taxAmount: number;
}

export interface SalaryBreakdown {
  annualCTC: number;
  monthlyCTC: number;

  // Earnings
  annualBasic: number;
  monthlyBasic: number;
  annualHRA: number;
  monthlyHRA: number;
  annualSpecialAllowance: number;
  monthlySpecialAllowance: number;
  annualGrossSalary: number;
  monthlyGrossSalary: number;

  // Deductions from CTC / Gross
  annualEmployerEPF: number;
  monthlyEmployerEPF: number;
  annualGratuity: number;
  monthlyGratuity: number;

  // Employee Deductions (Take-Home Reductions)
  annualEmployeeEPF: number;
  monthlyEmployeeEPF: number;
  annualProfessionalTax: number;
  monthlyProfessionalTax: number;

  // Taxation details
  standardDeduction: number;
  taxableIncome: number;
  grossTaxBeforeRebate: number;
  section87aRebate: number;
  taxAfterRebate: number;
  surcharge: number;
  surchargeRate: number;
  educationCess: number;
  totalAnnualTax: number;
  totalMonthlyTax: number;
  taxSlabsBreakdown: TaxSlabBreakdown[];

  // Final In-Hand / Take Home
  annualInHandSalary: number;
  monthlyInHandSalary: number;

  // Percentages
  takeHomePercentage: number;
  totalTaxPercentage: number;
  pfPercentage: number;
}

export const STANDARD_DEDUCTION_NEW_REGIME = 75000;
export const DEFAULT_PROFESSIONAL_TAX = 2400;

export function calculateInHandSalary(input: SalaryInput): SalaryBreakdown {
  const annualCTC = Math.max(0, input.annualCTC);
  const basicPercentage = (input.basicPercentage ?? 40) / 100;
  const epfType = input.epfType ?? 'actual';
  const includeGratuityInCTC = input.includeGratuityInCTC ?? false;
  const professionalTaxAnnual = input.professionalTaxAnnual ?? DEFAULT_PROFESSIONAL_TAX;

  // 1. Basic Pay
  const annualBasic = annualCTC * basicPercentage;
  const monthlyBasic = annualBasic / 12;

  // 2. EPF Calculation
  let annualEmployerEPF = 0;
  let annualEmployeeEPF = 0;

  if (epfType === 'actual') {
    annualEmployerEPF = annualBasic * 0.12;
    annualEmployeeEPF = annualBasic * 0.12;
  } else if (epfType === 'capped') {
    // Statutory ceiling: 12% of ₹15,000 = ₹1,800/month = ₹21,600/year
    const cappedAnnual = Math.min(annualBasic * 0.12, 1800 * 12);
    annualEmployerEPF = cappedAnnual;
    annualEmployeeEPF = cappedAnnual;
  }

  // 3. Gratuity (if component of CTC)
  const annualGratuity = includeGratuityInCTC ? annualBasic * (15 / 26 / 12) : 0; // ~4.81%

  // 4. Gross Salary (CTC minus company contributions retained by employer)
  const annualGrossSalary = Math.max(0, annualCTC - annualEmployerEPF - annualGratuity);
  const monthlyGrossSalary = annualGrossSalary / 12;

  // HRA (typically 40% of Basic for non-metro, 50% for metro; here modeled as 40% of Basic)
  const annualHRA = Math.min(annualBasic * 0.4, Math.max(0, annualGrossSalary - annualBasic));
  // Remaining allowance as Special / Flexible allowance
  const annualSpecialAllowance = Math.max(0, annualGrossSalary - annualBasic - annualHRA);

  // 5. Tax Calculation under FY 2025-26 New Tax Regime (Sec 115BAC)
  const standardDeduction = annualGrossSalary > 0 ? Math.min(STANDARD_DEDUCTION_NEW_REGIME, annualGrossSalary) : 0;
  const additionalDeductions = Math.max(0, input.otherTaxDeductions ?? 0);
  const taxableIncome = Math.max(0, annualGrossSalary - standardDeduction - additionalDeductions);

  const { taxBeforeRebate, slabs } = computeNewRegimeTax(taxableIncome);

  // Section 87A Rebate:
  // In the New Regime, if taxable income <= ₹7,00,000, tax rebate is 100% (up to ₹25,000).
  let section87aRebate = 0;
  let taxAfterRebate = taxBeforeRebate;

  if (taxableIncome <= 700000) {
    section87aRebate = taxBeforeRebate;
    taxAfterRebate = 0;
  } else {
    // Marginal relief under Section 87A:
    // If taxable income > 7,00,000, the income tax payable cannot exceed (Taxable Income - 7,00,000).
    const excessOver7Lakh = taxableIncome - 700000;
    if (taxBeforeRebate > excessOver7Lakh) {
      taxAfterRebate = excessOver7Lakh;
      section87aRebate = taxBeforeRebate - excessOver7Lakh;
    }
  }

  // Surcharge (under Section 115BAC New Tax Regime for High Net-Worth Individuals):
  // Taxable Income > ₹50L to ₹1Cr: 10%
  // Taxable Income > ₹1Cr to ₹2Cr: 15%
  // Taxable Income > ₹2Cr: 25% (statutory cap under New Regime)
  let surchargeRate = 0;
  let surcharge = 0;
  if (taxableIncome > 20000000) {
    surchargeRate = 0.25;
  } else if (taxableIncome > 10000000) {
    surchargeRate = 0.15;
  } else if (taxableIncome > 5000000) {
    surchargeRate = 0.10;
  }

  if (surchargeRate > 0) {
    surcharge = Math.round(taxAfterRebate * surchargeRate);
  }

  // 4% Health & Education Cess (calculated on Tax + Surcharge)
  const educationCess = Math.round((taxAfterRebate + surcharge) * 0.04);
  const totalAnnualTax = Math.round(taxAfterRebate + surcharge + educationCess);
  const totalMonthlyTax = Math.round(totalAnnualTax / 12);

  // 6. Final Employee Net Take-Home (In-Hand)
  // In-Hand = Gross Salary - Employee EPF - Professional Tax - Income Tax
  const annualInHandSalary = Math.max(0, annualGrossSalary - annualEmployeeEPF - professionalTaxAnnual - totalAnnualTax);
  const monthlyInHandSalary = Math.round(annualInHandSalary / 12);

  return {
    annualCTC,
    monthlyCTC: Math.round(annualCTC / 12),

    annualBasic: Math.round(annualBasic),
    monthlyBasic: Math.round(monthlyBasic),
    annualHRA: Math.round(annualHRA),
    monthlyHRA: Math.round(annualHRA / 12),
    annualSpecialAllowance: Math.round(annualSpecialAllowance),
    monthlySpecialAllowance: Math.round(annualSpecialAllowance / 12),
    annualGrossSalary: Math.round(annualGrossSalary),
    monthlyGrossSalary: Math.round(monthlyGrossSalary),

    annualEmployerEPF: Math.round(annualEmployerEPF),
    monthlyEmployerEPF: Math.round(annualEmployerEPF / 12),
    annualGratuity: Math.round(annualGratuity),
    monthlyGratuity: Math.round(annualGratuity / 12),

    annualEmployeeEPF: Math.round(annualEmployeeEPF),
    monthlyEmployeeEPF: Math.round(annualEmployeeEPF / 12),
    annualProfessionalTax: professionalTaxAnnual,
    monthlyProfessionalTax: Math.round(professionalTaxAnnual / 12),

    standardDeduction,
    taxableIncome: Math.round(taxableIncome),
    grossTaxBeforeRebate: Math.round(taxBeforeRebate),
    section87aRebate: Math.round(section87aRebate),
    taxAfterRebate: Math.round(taxAfterRebate),
    surcharge,
    surchargeRate,
    educationCess,
    totalAnnualTax,
    totalMonthlyTax,
    taxSlabsBreakdown: slabs,

    annualInHandSalary: Math.round(annualInHandSalary),
    monthlyInHandSalary,

    takeHomePercentage: annualCTC > 0 ? Number(((annualInHandSalary / annualCTC) * 100).toFixed(1)) : 0,
    totalTaxPercentage: annualCTC > 0 ? Number(((totalAnnualTax / annualCTC) * 100).toFixed(1)) : 0,
    pfPercentage: annualCTC > 0 ? Number((((annualEmployeeEPF + annualEmployerEPF) / annualCTC) * 100).toFixed(1)) : 0,
  };
}

/**
 * Computes progressive tax under Union Budget New Tax Regime Slabs
 */
function computeNewRegimeTax(taxableIncome: number): { taxBeforeRebate: number; slabs: TaxSlabBreakdown[] } {
  // Slabs:
  // 0 to 3,00,000 : 0%
  // 3,00,001 to 7,00,000 : 5%
  // 7,00,001 to 10,00,000 : 10%
  // 10,00,001 to 12,00,000 : 15%
  // 12,00,001 to 15,00,000 : 20%
  // Above 15,00,000 : 30%

  const slabDefinitions = [
    { min: 0, max: 300000, rate: 0, label: '₹0 - ₹3,00,000', rateLabel: '0%' },
    { min: 300000, max: 700000, rate: 0.05, label: '₹3,00,001 - ₹7,00,000', rateLabel: '5%' },
    { min: 700000, max: 1000000, rate: 0.10, label: '₹7,00,001 - ₹10,00,000', rateLabel: '10%' },
    { min: 1000000, max: 1200000, rate: 0.15, label: '₹10,00,001 - ₹12,00,000', rateLabel: '15%' },
    { min: 1200000, max: 1500000, rate: 0.20, label: '₹12,00,001 - ₹15,00,000', rateLabel: '20%' },
    { min: 1500000, max: Infinity, rate: 0.30, label: 'Above ₹15,00,000', rateLabel: '30%' },
  ];

  let totalTax = 0;
  const slabsBreakdown: TaxSlabBreakdown[] = [];

  for (const slab of slabDefinitions) {
    if (taxableIncome > slab.min) {
      const taxableInThisSlab = Math.min(taxableIncome, slab.max) - slab.min;
      const taxForSlab = taxableInThisSlab * slab.rate;
      totalTax += taxForSlab;
      slabsBreakdown.push({
        slabRange: slab.label,
        rate: slab.rateLabel,
        taxableAmountInSlab: Math.round(taxableInThisSlab),
        taxAmount: Math.round(taxForSlab),
      });
    } else {
      slabsBreakdown.push({
        slabRange: slab.label,
        rate: slab.rateLabel,
        taxableAmountInSlab: 0,
        taxAmount: 0,
      });
    }
  }

  return { taxBeforeRebate: totalTax, slabs: slabsBreakdown };
}
