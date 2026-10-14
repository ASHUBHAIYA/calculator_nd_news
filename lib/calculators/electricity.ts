/**
 * Electricity Bill & Telescopic Tariff Slabs Calculation Engine
 * Designed for Indian domestic and commercial electricity consumers.
 */

export interface TariffSlab {
  min: number; // e.g. 0
  max: number; // e.g. 100 (Infinity for highest bracket)
  rate: number; // ₹ per kWh / unit
}

export interface ElectricityBillInput {
  consumptionKWh: number;        // Monthly units consumed
  fixedCharges?: number;          // Fixed monthly meter / connected load charge (₹)
  tariffSlabs?: TariffSlab[];     // Configurable telescopic slabs
  dutyPercentage?: number;        // Electricity tax / state duty percentage (e.g. 5%)
  fppcaRatePerUnit?: number;      // Fuel & Power Purchase Price Adjustment (₹/unit)
}

export interface SlabConsumptionBreakdown {
  slabLabel: string;
  unitsInSlab: number;
  ratePerUnit: number;
  slabCost: number;
}

export interface ElectricityBillResult {
  consumptionKWh: number;
  slabBreakdown: SlabConsumptionBreakdown[];
  totalEnergyCharges: number;
  fixedCharges: number;
  fppcaCharges: number;
  dutyCharges: number;
  totalEstimatedBill: number;
  effectiveCostPerUnit: number;
}

export const DEFAULT_DOMESTIC_SLABS: TariffSlab[] = [
  { min: 0, max: 100, rate: 3.50 },
  { min: 100, max: 200, rate: 5.25 },
  { min: 200, max: 400, rate: 7.40 },
  { min: 400, max: Infinity, rate: 9.20 },
];

/**
 * Calculates monthly electricity bill using telescopic tiered slab rates,
 * fixed connection charges, state duty, and fuel surcharges.
 */
export function calculateElectricityBill(input: ElectricityBillInput): ElectricityBillResult {
  const units = Math.max(0, input.consumptionKWh || 0);
  const fixedCharges = Math.max(0, input.fixedCharges ?? 75);
  const dutyPct = Math.max(0, input.dutyPercentage ?? 5);
  const fppcaRate = Math.max(0, input.fppcaRatePerUnit ?? 0.35);
  const slabs = input.tariffSlabs && input.tariffSlabs.length > 0 ? input.tariffSlabs : DEFAULT_DOMESTIC_SLABS;

  let remainingUnits = units;
  let totalEnergyCharges = 0;
  const slabBreakdown: SlabConsumptionBreakdown[] = [];

  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    const slabCapacity = slab.max - slab.min;

    if (remainingUnits > 0) {
      const unitsInThisSlab = Math.min(remainingUnits, slabCapacity);
      const slabCost = Number((unitsInThisSlab * slab.rate).toFixed(2));
      totalEnergyCharges += slabCost;
      remainingUnits -= unitsInThisSlab;

      const maxLabel = slab.max === Infinity ? 'Above' : `to ${slab.max}`;
      slabBreakdown.push({
        slabLabel: `${slab.min + 1} ${maxLabel} units`,
        unitsInSlab: unitsInThisSlab,
        ratePerUnit: slab.rate,
        slabCost,
      });
    } else {
      break;
    }
  }

  totalEnergyCharges = Number(totalEnergyCharges.toFixed(2));
  const fppcaCharges = Number((units * fppcaRate).toFixed(2));
  const subtotalBeforeDuty = totalEnergyCharges + fixedCharges + fppcaCharges;
  const dutyCharges = Number(((subtotalBeforeDuty * dutyPct) / 100).toFixed(2));
  const totalEstimatedBill = Math.round(subtotalBeforeDuty + dutyCharges);

  const effectiveCostPerUnit = units > 0 ? Number((totalEstimatedBill / units).toFixed(2)) : 0;

  return {
    consumptionKWh: units,
    slabBreakdown,
    totalEnergyCharges,
    fixedCharges,
    fppcaCharges,
    dutyCharges,
    totalEstimatedBill,
    effectiveCostPerUnit,
  };
}
