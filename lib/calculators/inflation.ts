/**
 * Inflation & Purchasing Power Compounding Engine
 * Designed for Indian consumers, financial planners, and retirement corpus modeling.
 */

export type InflationMode = 'future_cost' | 'purchasing_power';

export interface InflationInput {
  amount: number;             // Amount today (₹)
  annualInflationRate: number;// Annual rate (%)
  tenureYears: number;        // Horizon in years
  mode?: InflationMode;       // 'future_cost' (default) or 'purchasing_power'
}

export interface InflationYearlyRow {
  year: number;
  projectedCost: number;
  purchasingPowerEquivalent: number;
  cumulativeInflationPct: number;
}

export interface InflationResult {
  currentAmount: number;
  annualInflationRate: number;
  tenureYears: number;
  mode: InflationMode;
  projectedFutureCost: number;
  futurePurchasingPower: number;
  absoluteCostIncrease: number;
  totalPercentageIncrease: number;
  yearlySchedule: InflationYearlyRow[];
}

/**
 * Calculates future cost of current expenses or erosion of purchasing power.
 * Formulas:
 *   Future Cost = PV × (1 + r / 100)^t
 *   Purchasing Power = PV ÷ (1 + r / 100)^t
 */
export function calculateInflation(input: InflationInput): InflationResult {
  const amount = Math.max(1, input.amount || 100000);
  const rate = Math.max(0, Math.min(50, input.annualInflationRate || 6.0));
  const years = Math.max(1, Math.min(50, input.tenureYears || 10));
  const mode = input.mode || 'future_cost';

  const multiplier = Math.pow(1 + rate / 100, years);
  const projectedFutureCost = Math.round(amount * multiplier);
  const futurePurchasingPower = Math.round(amount / multiplier);

  const absoluteCostIncrease = projectedFutureCost - amount;
  const totalPercentageIncrease = Number(((multiplier - 1) * 100).toFixed(1));

  const yearlySchedule: InflationYearlyRow[] = [];
  for (let y = 1; y <= years; y++) {
    const yearMult = Math.pow(1 + rate / 100, y);
    yearlySchedule.push({
      year: y,
      projectedCost: Math.round(amount * yearMult),
      purchasingPowerEquivalent: Math.round(amount / yearMult),
      cumulativeInflationPct: Number(((yearMult - 1) * 100).toFixed(1)),
    });
  }

  return {
    currentAmount: amount,
    annualInflationRate: rate,
    tenureYears: years,
    mode,
    projectedFutureCost,
    futurePurchasingPower,
    absoluteCostIncrease,
    totalPercentageIncrease,
    yearlySchedule,
  };
}
