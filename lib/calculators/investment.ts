/**
 * Systematic Investment Plan (SIP) & Mutual Fund Growth Engine
 * Designed for Indian retail investors, equity mutual funds, and wealth planning.
 */

export interface SipInput {
  monthlyInvestment: number; // Monthly installment in ₹
  annualReturnRate: number;  // Expected annual rate of return (%)
  tenureYears: number;       // Duration in years
  annualStepUpPct?: number;  // Optional annual step-up top-up percentage (%)
}

export interface SipYearlyBreakdown {
  year: number;
  monthlyDeposit: number;
  investedThisYear: number;
  cumulativeInvested: number;
  portfolioValue: number;
  cumulativeReturns: number;
}

export interface SipResult {
  monthlyInvestment: number;
  annualReturnRate: number;
  tenureYears: number;
  annualStepUpPct: number;
  totalInvested: number;
  estimatedReturns: number;
  maturityValue: number;
  yearlyBreakdown: SipYearlyBreakdown[];
  wealthMultiplier: number;
}

/**
 * Calculates SIP future value with optional annual step-up.
 * Compounding: Monthly compounding annuity-due formula.
 */
export function calculateSipGrowth(input: SipInput): SipResult {
  const initialMonthly = Math.max(100, input.monthlyInvestment || 5000);
  const annualRate = Math.max(0.1, Math.min(40, input.annualReturnRate || 12));
  const years = Math.max(1, Math.min(40, input.tenureYears || 10));
  const stepUp = Math.max(0, Math.min(50, input.annualStepUpPct || 0));

  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = years * 12;

  let currentMonthly = initialMonthly;
  let totalInvested = 0;
  let portfolioValue = 0;
  const yearlyBreakdown: SipYearlyBreakdown[] = [];

  let investedThisYear = 0;

  for (let month = 1; month <= totalMonths; month++) {
    // If step-up is enabled and it's the start of a new year after year 1
    if (stepUp > 0 && month > 1 && (month - 1) % 12 === 0) {
      currentMonthly = Math.round(currentMonthly * (1 + stepUp / 100));
    }

    totalInvested += currentMonthly;
    investedThisYear += currentMonthly;

    // Beginning-of-month contribution compounded for the month
    portfolioValue = (portfolioValue + currentMonthly) * (1 + monthlyRate);

    if (month % 12 === 0) {
      const yearIndex = month / 12;
      yearlyBreakdown.push({
        year: yearIndex,
        monthlyDeposit: currentMonthly,
        investedThisYear,
        cumulativeInvested: Math.round(totalInvested),
        portfolioValue: Math.round(portfolioValue),
        cumulativeReturns: Math.round(Math.max(0, portfolioValue - totalInvested)),
      });
      investedThisYear = 0;
    }
  }

  const maturityValue = Math.round(portfolioValue);
  const estimatedReturns = Math.max(0, maturityValue - totalInvested);
  const wealthMultiplier = totalInvested > 0 ? Number((maturityValue / totalInvested).toFixed(2)) : 1;

  return {
    monthlyInvestment: initialMonthly,
    annualReturnRate: annualRate,
    tenureYears: years,
    annualStepUpPct: stepUp,
    totalInvested: Math.round(totalInvested),
    estimatedReturns,
    maturityValue,
    yearlyBreakdown,
    wealthMultiplier,
  };
}
