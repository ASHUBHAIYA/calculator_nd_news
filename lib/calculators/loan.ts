/**
 * Home Loan Prepayment Engine
 * Computes:
 * - Standard Reducing-Balance Monthly EMI
 * - Full amortization schedule comparison (Base vs Prepayment)
 * - Prepayment strategies:
 *   a) Extra 1 EMI every year
 *   b) Annual EMI step-up by % (e.g. 5% or 10% hike each year)
 *   c) Fixed recurring monthly prepayment (e.g. +₹5,000/mo)
 *   d) Periodic / One-time lump sum prepayment
 * - Total interest savings, tenure reduction in years & months
 */

export interface LoanInput {
  principal: number; // in Rupees
  annualInterestRate: number; // e.g. 8.5 (%)
  tenureYears: number; // e.g. 20 (years)

  prepaymentStrategy: 'extra_emi_yearly' | 'annual_stepup' | 'recurring_monthly' | 'lump_sum' | 'none';
  recurringMonthlyPrepayment?: number; // e.g. ₹5,000
  annualStepUpPercentage?: number; // e.g. 5%
  extraEmisPerYear?: number; // default 1
  lumpSumAmount?: number; // e.g. ₹2,00,000
  lumpSumMonth?: number; // month at which lump sum is paid (e.g. 12 or 24)
}

export interface AmortizationYearSummary {
  year: number;
  baseClosingBalance: number;
  baseInterestPaid: number;
  prepayClosingBalance: number;
  prepayInterestPaid: number;
  cumulativeInterestSaved: number;
}

export interface LoanPrepaymentResult {
  principal: number;
  annualInterestRate: number;
  tenureMonths: number;
  baseMonthlyEMI: number;

  baseTotalInterest: number;
  baseTotalPayment: number;

  prepayTotalInterest: number;
  prepayTotalPayment: number;
  prepayActualTenureMonths: number;

  interestSaved: number;
  interestSavedPercentage: number;
  tenureSavedMonths: number;
  tenureSavedYears: number;
  tenureSavedRemainderMonths: number;

  yearlyAmortization: AmortizationYearSummary[];
}

/**
 * Calculates standard monthly EMI using reducing balance compound formula
 */
export function calculateMonthlyEMI(principal: number, annualInterestRate: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualInterestRate <= 0) return Math.round(principal / tenureMonths);

  const monthlyRate = annualInterestRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

export function calculateLoanPrepayment(input: LoanInput): LoanPrepaymentResult {
  const principal = Math.max(0, input.principal);
  const annualInterestRate = Math.max(0.1, input.annualInterestRate);
  const tenureMonths = Math.max(1, Math.round(input.tenureYears * 12));
  const monthlyRate = annualInterestRate / 12 / 100;

  const baseMonthlyEMI = calculateMonthlyEMI(principal, annualInterestRate, tenureMonths);

  // 1. Calculate Baseline (without prepayment)
  let baseBalance = principal;
  let baseTotalInterest = 0;
  const baseMonthlyInterestByYear: number[] = [];
  const baseEndingBalanceByYear: number[] = [];

  for (let m = 1; m <= tenureMonths; m++) {
    const interest = baseBalance * monthlyRate;
    const principalComponent = Math.min(baseBalance, baseMonthlyEMI - interest);
    baseTotalInterest += interest;
    baseBalance = Math.max(0, baseBalance - principalComponent);

    const yearIdx = Math.floor((m - 1) / 12);
    baseMonthlyInterestByYear[yearIdx] = (baseMonthlyInterestByYear[yearIdx] || 0) + interest;

    if (m % 12 === 0 || m === tenureMonths) {
      baseEndingBalanceByYear[yearIdx] = baseBalance;
    }
  }

  // 2. Calculate With Prepayment Strategy
  let prepayBalance = principal;
  let prepayTotalInterest = 0;
  let prepayActualTenureMonths = 0;
  let currentEmi = baseMonthlyEMI;

  const strategy = input.prepaymentStrategy;
  const recurringExtra = Math.max(0, input.recurringMonthlyPrepayment ?? 0);
  const stepUpPct = Math.max(0, input.annualStepUpPercentage ?? 0) / 100;
  const extraEmisCount = Math.max(1, input.extraEmisPerYear ?? 1);
  const lumpSumAmount = Math.max(0, input.lumpSumAmount ?? 0);
  const lumpSumMonth = Math.max(1, input.lumpSumMonth ?? 12);

  const prepayInterestByYear: number[] = [];
  const prepayEndingBalanceByYear: number[] = [];

  for (let m = 1; m <= tenureMonths * 2; m++) {
    if (prepayBalance <= 0) {
      break;
    }
    prepayActualTenureMonths = m;

    // Check for annual EMI step-up at beginning of each new year (month 13, 25, 37...)
    if (strategy === 'annual_stepup' && m > 1 && (m - 1) % 12 === 0) {
      currentEmi = Math.round(currentEmi * (1 + stepUpPct));
    }

    const interest = prepayBalance * monthlyRate;
    prepayTotalInterest += interest;

    // Determine extra payment this month
    let extraPayment = 0;

    if (strategy === 'extra_emi_yearly' && m % 12 === 0) {
      extraPayment += baseMonthlyEMI * extraEmisCount;
    } else if (strategy === 'recurring_monthly') {
      extraPayment += recurringExtra;
    }

    if (strategy === 'lump_sum' && m === lumpSumMonth) {
      extraPayment += lumpSumAmount;
    }

    const scheduledPayment = Math.min(prepayBalance + interest, currentEmi + extraPayment);
    const principalPaid = scheduledPayment - interest;
    prepayBalance = Math.max(0, prepayBalance - principalPaid);

    const yearIdx = Math.floor((m - 1) / 12);
    prepayInterestByYear[yearIdx] = (prepayInterestByYear[yearIdx] || 0) + interest;

    if (m % 12 === 0 || prepayBalance <= 0) {
      prepayEndingBalanceByYear[yearIdx] = prepayBalance;
    }
  }

  const interestSaved = Math.max(0, Math.round(baseTotalInterest - prepayTotalInterest));
  const interestSavedPercentage = baseTotalInterest > 0 ? Number(((interestSaved / baseTotalInterest) * 100).toFixed(1)) : 0;
  const tenureSavedMonths = Math.max(0, tenureMonths - prepayActualTenureMonths);
  const tenureSavedYears = Math.floor(tenureSavedMonths / 12);
  const tenureSavedRemainderMonths = tenureSavedMonths % 12;

  // Build Year-by-year summary
  const totalYears = Math.ceil(tenureMonths / 12);
  const yearlyAmortization: AmortizationYearSummary[] = [];
  let runningSaved = 0;

  for (let y = 0; y < totalYears; y++) {
    const yearNum = y + 1;
    const bInterest = Math.round(baseMonthlyInterestByYear[y] || 0);
    const pInterest = Math.round(prepayInterestByYear[y] || 0);
    runningSaved += Math.max(0, bInterest - pInterest);

    yearlyAmortization.push({
      year: yearNum,
      baseClosingBalance: Math.round(baseEndingBalanceByYear[y] || 0),
      baseInterestPaid: bInterest,
      prepayClosingBalance: Math.round(prepayEndingBalanceByYear[y] || 0),
      prepayInterestPaid: pInterest,
      cumulativeInterestSaved: runningSaved,
    });
  }

  return {
    principal,
    annualInterestRate,
    tenureMonths,
    baseMonthlyEMI,

    baseTotalInterest: Math.round(baseTotalInterest),
    baseTotalPayment: Math.round(principal + baseTotalInterest),

    prepayTotalInterest: Math.round(prepayTotalInterest),
    prepayTotalPayment: Math.round(principal + prepayTotalInterest),
    prepayActualTenureMonths,

    interestSaved,
    interestSavedPercentage,
    tenureSavedMonths,
    tenureSavedYears,
    tenureSavedRemainderMonths,

    yearlyAmortization,
  };
}
