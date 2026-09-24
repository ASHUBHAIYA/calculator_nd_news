/**
 * Commute Fuel Spend Engine
 * Calculates:
 * - Daily commute fuel expenses
 * - Monthly spend (standard 26 working days or custom)
 * - Yearly spend
 * - Fuel consumed (litres / kg / kWh)
 * - Comparative savings vs Electric Vehicle (EV) or Public Transit
 * - Estimated carbon footprint (kg CO2)
 */

export type FuelType = 'petrol' | 'diesel' | 'cng' | 'electric';

export interface FuelInput {
  dailyDistanceKm: number; // round trip commute (e.g. 35 km)
  fuelType: FuelType;
  fuelPricePerUnit: number; // ₹/Litre for petrol/diesel, ₹/kg for CNG, ₹/kWh for EV
  mileage: number; // km per Litre/kg, or km per kWh
  workingDaysPerMonth?: number; // default 26 days
  vehicleLabel?: string;
}

export interface FuelSpendBreakdown {
  dailyDistanceKm: number;
  workingDaysPerMonth: number;
  monthlyDistanceKm: number;
  yearlyDistanceKm: number;

  fuelType: FuelType;
  fuelPricePerUnit: number;
  mileage: number;

  costPerKm: number;

  dailyCost: number;
  monthlyCost: number;
  yearlyCost: number;

  dailyConsumptionUnits: number;
  monthlyConsumptionUnits: number;
  yearlyConsumptionUnits: number;

  // EV Comparison
  evCostPerKm: number;
  potentialMonthlyEvSavings: number;
  potentialYearlyEvSavings: number;

  // Environmental impact
  annualCO2Kg: number;
}

// Typical benchmark rates across metropolitan India (Delhi/Mumbai/Bengaluru)
export const DEFAULT_FUEL_PRICES: Record<FuelType, { defaultPrice: number; defaultMileage: number; unitLabel: string }> = {
  petrol: { defaultPrice: 96.72, defaultMileage: 16, unitLabel: 'Litre' },
  diesel: { defaultPrice: 89.62, defaultMileage: 20, unitLabel: 'Litre' },
  cng: { defaultPrice: 76.59, defaultMileage: 24, unitLabel: 'kg' },
  electric: { defaultPrice: 8.50, defaultMileage: 7.5, unitLabel: 'kWh' }, // ₹8.5/kWh home tariff, ~7.5 km/kWh
};

// CO2 emission factors (kg CO2 per unit)
const CO2_FACTORS: Record<FuelType, number> = {
  petrol: 2.31, // kg CO2 per L
  diesel: 2.68, // kg CO2 per L
  cng: 2.75, // kg CO2 per kg
  electric: 0.82, // kg CO2 per kWh grid avg in India
};

export function calculateFuelSpend(input: FuelInput): FuelSpendBreakdown {
  const dailyDistanceKm = Math.max(0, input.dailyDistanceKm);
  const workingDays = Math.max(1, Math.min(31, input.workingDaysPerMonth ?? 26));
  const mileage = Math.max(0.1, input.mileage);
  const price = Math.max(0, input.fuelPricePerUnit);

  const monthlyDistanceKm = dailyDistanceKm * workingDays;
  const yearlyDistanceKm = monthlyDistanceKm * 12;

  const costPerKm = price / mileage;

  const dailyCost = Math.round(dailyDistanceKm * costPerKm);
  const monthlyCost = Math.round(monthlyDistanceKm * costPerKm);
  const yearlyCost = Math.round(yearlyDistanceKm * costPerKm);

  const dailyConsumptionUnits = Number((dailyDistanceKm / mileage).toFixed(2));
  const monthlyConsumptionUnits = Number((monthlyDistanceKm / mileage).toFixed(2));
  const yearlyConsumptionUnits = Number((yearlyDistanceKm / mileage).toFixed(1));

  // Benchmark against standard EV (e.g. ₹8.5/kWh at 7.5 km/kWh => ~₹1.13 / km)
  const evCostPerKm = DEFAULT_FUEL_PRICES.electric.defaultPrice / DEFAULT_FUEL_PRICES.electric.defaultMileage;
  const monthlyEvCost = monthlyDistanceKm * evCostPerKm;
  const yearlyEvCost = yearlyDistanceKm * evCostPerKm;

  const potentialMonthlyEvSavings = input.fuelType === 'electric' ? 0 : Math.max(0, Math.round(monthlyCost - monthlyEvCost));
  const potentialYearlyEvSavings = input.fuelType === 'electric' ? 0 : Math.max(0, Math.round(yearlyCost - yearlyEvCost));

  // Environmental impact
  const emissionFactor = CO2_FACTORS[input.fuelType] || 2.3;
  const annualCO2Kg = Math.round(yearlyConsumptionUnits * emissionFactor);

  return {
    dailyDistanceKm,
    workingDaysPerMonth: workingDays,
    monthlyDistanceKm,
    yearlyDistanceKm,

    fuelType: input.fuelType,
    fuelPricePerUnit: price,
    mileage,

    costPerKm: Number(costPerKm.toFixed(2)),

    dailyCost,
    monthlyCost,
    yearlyCost,

    dailyConsumptionUnits,
    monthlyConsumptionUnits,
    yearlyConsumptionUnits,

    evCostPerKm: Number(evCostPerKm.toFixed(2)),
    potentialMonthlyEvSavings,
    potentialYearlyEvSavings,

    annualCO2Kg,
  };
}
