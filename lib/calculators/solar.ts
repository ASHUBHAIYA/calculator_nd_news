/**
 * PM Surya Ghar: Muft Bijli Yojana (Rooftop Solar Subsidy) Engine
 * Official MNRE (Ministry of New and Renewable Energy) subsidy framework:
 * - 1 kW system: ₹30,000 central financial assistance
 * - 2 kW system: ₹60,000 central financial assistance
 * - 3 kW system and above: Capped at ₹78,000 for residential rooftops
 *
 * Performance modeling:
 * - 1 kW generates approx 4 units (kWh) per day = 120 units per month = 1,440 units/year
 * - Requires approx 100 sq.ft of unshaded rooftop area per kW
 * - Standard residential cost benchmark: ₹60,000 per kW
 * - Typical grid electricity tariff: ~₹7.00 per unit (discom avg)
 */

export interface SolarInput {
  monthlyElectricityBill: number; // in Rupees, e.g. ₹2,800
  electricityTariffPerUnit?: number; // e.g. ₹7.50 / unit
  customCapacityKw?: number; // optional manual override
  systemCostPerKw?: number; // default ₹60,000 / kW
  stateSubsidyAmount?: number; // optional state-specific top-up (e.g. UP, Gujarat, Delhi)
  availableRoofAreaSqFt?: number; // optional area check
}

export interface SolarSubsidyBreakdown {
  recommendedCapacityKw: number;
  rooftopAreaRequiredSqFt: number;

  monthlyUnitsConsumed: number;
  monthlySolarUnitsGenerated: number;
  annualSolarUnitsGenerated: number;

  grossSystemCost: number;
  centralSubsidy: number;
  stateSubsidy: number;
  totalSubsidy: number;
  netInvestmentCost: number;

  monthlyElectricityBillSaved: number;
  annualSavings: number;
  paybackPeriodYears: number;

  lifetime25YearGrossSavings: number;
  lifetimeNetProfit: number;
  annualCO2OffsetTons: number;
  equivalentTreesPlanted: number;
}

export const CENTRAL_SUBSIDY_MAX = 78000;
export const DEFAULT_TARIFF_PER_UNIT = 7.0;
export const DEFAULT_COST_PER_KW = 60000;
export const UNITS_PER_KW_PER_MONTH = 120;
export const SQFT_PER_KW = 100;

/**
 * Calculates central subsidy as per PM Surya Ghar Guidelines
 */
export function calculateCentralSubsidy(capacityKw: number): number {
  if (capacityKw <= 0) return 0;
  if (capacityKw <= 1) {
    return Math.round(capacityKw * 30000);
  }
  if (capacityKw <= 2) {
    return 30000 + Math.round((capacityKw - 1) * 30000);
  }
  if (capacityKw <= 3) {
    return 60000 + Math.round((capacityKw - 2) * 18000);
  }
  return CENTRAL_SUBSIDY_MAX; // Capped at ₹78,000 for residential
}

export function calculateSolarSubsidy(input: SolarInput): SolarSubsidyBreakdown {
  const bill = Math.max(0, input.monthlyElectricityBill);
  const tariff = Math.max(1, input.electricityTariffPerUnit ?? DEFAULT_TARIFF_PER_UNIT);
  const costPerKw = Math.max(30000, input.systemCostPerKw ?? DEFAULT_COST_PER_KW);
  const stateSubsidy = Math.max(0, input.stateSubsidyAmount ?? 0);

  // Monthly electricity consumption (units/kWh)
  const monthlyUnitsConsumed = Math.round(bill / tariff);

  // Determine capacity: either custom or calculated based on monthly consumption
  let capacityKw: number;
  if (input.customCapacityKw && input.customCapacityKw > 0) {
    capacityKw = Number(input.customCapacityKw.toFixed(1));
  } else {
    // Recommend capacity to offset 90% - 100% of consumption
    const rawKw = monthlyUnitsConsumed / UNITS_PER_KW_PER_MONTH;
    capacityKw = Math.max(1, Math.min(10, Math.ceil(rawKw)));
  }

  const rooftopAreaRequiredSqFt = Math.round(capacityKw * SQFT_PER_KW);

  const monthlySolarUnitsGenerated = Math.round(capacityKw * UNITS_PER_KW_PER_MONTH);
  const annualSolarUnitsGenerated = monthlySolarUnitsGenerated * 12;

  const grossSystemCost = Math.round(capacityKw * costPerKw);
  const centralSubsidy = calculateCentralSubsidy(capacityKw);
  const totalSubsidy = Math.min(grossSystemCost, centralSubsidy + stateSubsidy);
  const netInvestmentCost = Math.max(0, grossSystemCost - totalSubsidy);

  // Savings: up to the bill amount or generation value
  const potentialMonthlyValue = monthlySolarUnitsGenerated * tariff;
  const monthlyElectricityBillSaved = Math.min(bill, Math.round(potentialMonthlyValue));
  const annualSavings = Math.round(monthlyElectricityBillSaved * 12);

  const paybackPeriodYears = annualSavings > 0
    ? Number((netInvestmentCost / annualSavings).toFixed(1))
    : 0;

  // 25-year lifetime: factoring 0.5% degradation per year
  let lifetime25YearGrossSavings = 0;
  for (let year = 1; year <= 25; year++) {
    const degradation = Math.pow(0.995, year - 1);
    lifetime25YearGrossSavings += annualSavings * degradation;
  }
  lifetime25YearGrossSavings = Math.round(lifetime25YearGrossSavings);
  const lifetimeNetProfit = Math.max(0, lifetime25YearGrossSavings - netInvestmentCost);

  // Environmental benefits: ~0.82 kg CO2 per kWh grid electricity
  const annualCO2OffsetTons = Number(((annualSolarUnitsGenerated * 0.82) / 1000).toFixed(2));
  const equivalentTreesPlanted = Math.round(annualCO2OffsetTons * 45);

  return {
    recommendedCapacityKw: capacityKw,
    rooftopAreaRequiredSqFt,

    monthlyUnitsConsumed,
    monthlySolarUnitsGenerated,
    annualSolarUnitsGenerated,

    grossSystemCost,
    centralSubsidy,
    stateSubsidy,
    totalSubsidy,
    netInvestmentCost,

    monthlyElectricityBillSaved,
    annualSavings,
    paybackPeriodYears,

    lifetime25YearGrossSavings,
    lifetimeNetProfit,
    annualCO2OffsetTons,
    equivalentTreesPlanted,
  };
}
