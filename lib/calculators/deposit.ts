/**
 * Fixed Deposit (FD) & Recurring Deposit (RD) Calculation Engine
 * Adheres to Reserve Bank of India (RBI) and Indian Banks' Association (IBA) quarterly compounding standards.
 */

export type DepositType = 'fixed' | 'recurring';
export type CompoundingFrequency = 'quarterly' | 'monthly' | 'half_yearly' | 'yearly' | 'simple';

export interface DepositInput {
  depositType: DepositType;
  amount: number; // Lump sum for FD or Monthly installment for RD (₹)
  interestRate: number; // Annual interest rate (%)
  tenureMonths: number; // Total tenure in months
  compoundingFrequency?: CompoundingFrequency; // Default quarterly for FD
  isSeniorCitizen?: boolean; // Adds +0.50% p.a. senior citizen benefit
}

export interface DepositResult {
  depositType: DepositType;
  effectiveInterestRate: number;
  totalDepositAmount: number;
  totalInterestEarned: number;
  maturityAmount: number;
  effectiveAnnualYield: number;
  compoundingFrequency: CompoundingFrequency;
  seniorCitizenBonusApplied: boolean;
}

/**
 * Calculates maturity amount and interest for Fixed Deposit and Recurring Deposit.
 */
export function calculateDeposit(input: DepositInput): DepositResult {
  const isSenior = !!input.isSeniorCitizen;
  const baseRate = Math.max(0.1, Math.min(25, input.interestRate || 7.0));
  const effectiveRate = isSenior ? baseRate + 0.5 : baseRate;
  const months = Math.max(1, Math.min(360, input.tenureMonths || 12));
  const amount = Math.max(100, input.amount || 100000);
  const freq = input.compoundingFrequency || 'quarterly';

  if (input.depositType === 'fixed') {
    // Fixed Deposit (FD) Calculation
    const principal = amount;
    const years = months / 12;

    let maturity = principal;

    if (freq === 'simple') {
      const interest = (principal * effectiveRate * years) / 100;
      maturity = principal + interest;
    } else {
      let n = 4; // Quarterly default
      if (freq === 'monthly') n = 12;
      else if (freq === 'half_yearly') n = 2;
      else if (freq === 'yearly') n = 1;

      // Compound Interest: A = P * (1 + r / (n * 100))^(n * t)
      const periods = n * years;
      const ratePerPeriod = effectiveRate / (n * 100);
      maturity = principal * Math.pow(1 + ratePerPeriod, periods);
    }

    const roundedMaturity = Math.round(maturity);
    const totalInterest = Math.max(0, roundedMaturity - principal);
    const annualYield = years > 0 ? Number(((totalInterest / principal / years) * 100).toFixed(2)) : effectiveRate;

    return {
      depositType: 'fixed',
      effectiveInterestRate: effectiveRate,
      totalDepositAmount: principal,
      totalInterestEarned: totalInterest,
      maturityAmount: roundedMaturity,
      effectiveAnnualYield: annualYield,
      compoundingFrequency: freq,
      seniorCitizenBonusApplied: isSenior,
    };
  } else {
    // Recurring Deposit (RD) Calculation (Indian Banks Association standard: Quarterly Compounding)
    const monthlyDeposit = amount;
    const totalDeposit = monthlyDeposit * months;

    // In Indian scheduled banks, interest on RD is compounded quarterly:
    // M = P * sum( (1 + r/400)^(4*(months - i + 1)/12) ) for i = 1 to months
    const rPerQuarter = effectiveRate / 400;
    let maturity = 0;

    for (let i = 1; i <= months; i++) {
      const remainingMonths = months - i + 1;
      const quarters = remainingMonths / 3;
      maturity += monthlyDeposit * Math.pow(1 + rPerQuarter, quarters);
    }

    const roundedMaturity = Math.round(maturity);
    const totalInterest = Math.max(0, roundedMaturity - totalDeposit);
    const years = months / 12;
    const annualYield = years > 0 ? Number(((totalInterest / totalDeposit / years) * 100).toFixed(2)) : effectiveRate;

    return {
      depositType: 'recurring',
      effectiveInterestRate: effectiveRate,
      totalDepositAmount: totalDeposit,
      totalInterestEarned: totalInterest,
      maturityAmount: roundedMaturity,
      effectiveAnnualYield: annualYield,
      compoundingFrequency: 'quarterly',
      seniorCitizenBonusApplied: isSenior,
    };
  }
}
