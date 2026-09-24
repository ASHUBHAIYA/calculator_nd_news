/**
 * Gold & Silver Bullion Invoice Engine
 * Calculates:
 * - 24K benchmark gold rate to 22K (91.6% - 916 Hallmark) and 18K (75% - 750 Hallmark)
 * - 999 Fine Silver to 925 Sterling Silver (92.5%) and 900 Coin Silver
 * - Making charges (Percentage of bullion value OR per-gram charge)
 * - Precious stone / gemstone additions
 * - BIS Hallmarking charge:
 *     Gold: ₹45 + 18% GST = ₹53.10 per piece
 *     Silver: ₹35 + 18% GST = ₹41.30 per piece
 * - 3% GST split into 1.5% CGST and 1.5% SGST on (Bullion + Making Charges + Stones)
 */

export type BullionMetal = 'gold' | 'silver';
export type GoldPurity = '24K' | '22K' | '18K' | '14K';
export type SilverPurity = '999' | '925' | '900' | '800';

export interface GoldInvoiceInput {
  goldRate24KPer10g: number; // e.g. ₹74,500 per 10g
  weightGrams: number; // e.g. 15.5 grams
  purity: GoldPurity; // '22K' standard for jewelry
  makingChargeType: 'percentage' | 'perGram';
  makingChargeValue: number; // e.g. 12% or ₹650/gram
  stoneValue?: number; // optional gemstone value
  includeHallmarking?: boolean; // ₹53.10 standard BIS fee
  discountAmount?: number;
}

export interface SilverInvoiceInput {
  silverRate999PerKg: number; // e.g. ₹92,000 per 1 kg (or ₹920 per 10g)
  weightGrams: number; // e.g. 50 grams or 250 grams
  purity: SilverPurity; // '925' standard for sterling silver jewelry
  makingChargeType: 'percentage' | 'perGram';
  makingChargeValue: number; // e.g. 15% or ₹35/gram
  stoneValue?: number;
  includeHallmarking?: boolean; // ₹41.30 standard BIS fee
  discountAmount?: number;
}

export interface BullionInvoiceBreakdown {
  metal: BullionMetal;
  baseBenchmarkRate: number; // 24K per 10g (Gold) or 999 per kg (Silver)
  ratePerGram: number;
  effectiveRatePerGram: number;
  purityPercentage: number;
  purityCode: string;
  purityLabel: string;

  weightGrams: number;
  rawMetalCost: number;

  makingChargeType: 'percentage' | 'perGram';
  makingChargeRate: number;
  makingChargesTotal: number;

  stoneValue: number;
  subtotalBeforeTax: number;
  discount: number;
  netTaxableAmount: number;

  cgstPercentage: number;
  cgstAmount: number;
  sgstPercentage: number;
  sgstAmount: number;
  totalGST: number;

  hallmarkingFee: number;
  totalInvoiceAmount: number;
  effectiveCostPerGram: number;
}

export type GoldInvoiceBreakdown = BullionInvoiceBreakdown & {
  goldRate24KPerGram: number;
  effectiveGoldRatePerGram: number;
  goldWeightGrams: number;
  rawGoldCost: number;
};

export const PURITY_MULTIPLIERS: Record<GoldPurity, { ratio: number; code: string; label: string }> = {
  '24K': { ratio: 1.0, code: '999', label: '24 Karat (99.9% Pure Gold)' },
  '22K': { ratio: 22 / 24, code: '916', label: '22 Karat (91.6% Hallmark 916)' },
  '18K': { ratio: 18 / 24, code: '750', label: '18 Karat (75.0% Hallmark 750)' },
  '14K': { ratio: 14 / 24, code: '585', label: '14 Karat (58.5% Hallmark 585)' },
};

export const SILVER_PURITY_MULTIPLIERS: Record<SilverPurity, { ratio: number; code: string; label: string }> = {
  '999': { ratio: 1.0, code: '999', label: 'Fine Silver 999 (99.9% Bullion Coins & Bars)' },
  '925': { ratio: 0.925, code: '925', label: 'Sterling Silver 925 (92.5% BIS Hallmark Jewelry)' },
  '900': { ratio: 0.90, code: '900', label: 'Coin Silver 900 (90.0% Utensils & Traditional Items)' },
  '800': { ratio: 0.80, code: '800', label: 'Jewelry Silver 800 (80.0% Traditional Anklets)' },
};

export const BIS_GOLD_HALLMARKING_FEE = 53.10; // ₹45 + 18% GST
export const BIS_SILVER_HALLMARKING_FEE = 41.30; // ₹35 + 18% GST
export const BIS_HALLMARKING_FEE_INC_GST = BIS_GOLD_HALLMARKING_FEE;

// Market Indicative Benchmark Rates (Based on MCX & IBJA Daily Reference Rates)
export interface BullionMarketRate {
  metal: 'gold' | 'silver';
  title: string;
  purity: string;
  rate: number;
  unit: string;
  change: number;
  changePercent: number;
  direction: 'up' | 'down';
  source: string;
}

export const BULLION_BENCHMARK_RATES: BullionMarketRate[] = [
  {
    metal: 'gold',
    title: 'Gold 24K (999)',
    purity: '24K Pure',
    rate: 76850,
    unit: 'per 10g',
    change: 280,
    changePercent: 0.37,
    direction: 'up',
    source: 'MCX / IBJA Reference',
  },
  {
    metal: 'gold',
    title: 'Gold 22K (916)',
    purity: '22K Hallmark',
    rate: 70445,
    unit: 'per 10g',
    change: 255,
    changePercent: 0.36,
    direction: 'up',
    source: 'Retail Standard',
  },
  {
    metal: 'silver',
    title: 'Silver 999 (1 Kg)',
    purity: '999 Fine',
    rate: 92500,
    unit: 'per 1 kg',
    change: 450,
    changePercent: 0.49,
    direction: 'up',
    source: 'MCX Spot',
  },
  {
    metal: 'silver',
    title: 'Silver 925 (10g)',
    purity: '925 Sterling',
    rate: 855,
    unit: 'per 10g',
    change: 4,
    changePercent: 0.47,
    direction: 'up',
    source: 'Jewelry Standard',
  },
];

export const MAJOR_CITY_RATES = [
  { city: 'Mumbai', gold24K: 76850, gold22K: 70445, silver1Kg: 92500 },
  { city: 'Delhi', gold24K: 77000, gold22K: 70590, silver1Kg: 92500 },
  { city: 'Chennai', gold24K: 77350, gold22K: 70900, silver1Kg: 98000 },
  { city: 'Bengaluru', gold24K: 76850, gold22K: 70445, silver1Kg: 92000 },
  { city: 'Kolkata', gold24K: 76850, gold22K: 70445, silver1Kg: 92500 },
  { city: 'Ahmedabad', gold24K: 76900, gold22K: 70490, silver1Kg: 92500 },
  { city: 'Hyderabad', gold24K: 76850, gold22K: 70445, silver1Kg: 98000 },
];

export function calculateGoldInvoice(input: GoldInvoiceInput): GoldInvoiceBreakdown {
  const goldRate24KPer10g = Math.max(0, input.goldRate24KPer10g);
  const goldRate24KPerGram = goldRate24KPer10g / 10;
  const weight = Math.max(0, input.weightGrams);
  const purityInfo = PURITY_MULTIPLIERS[input.purity] || PURITY_MULTIPLIERS['22K'];

  // Effective rate per gram based on karat purity
  const effectiveGoldRatePerGram = goldRate24KPerGram * purityInfo.ratio;
  const rawGoldCost = Math.round(weight * effectiveGoldRatePerGram);

  // Making charges calculation
  let makingChargesTotal = 0;
  if (input.makingChargeType === 'percentage') {
    const pct = Math.max(0, input.makingChargeValue) / 100;
    makingChargesTotal = Math.round(rawGoldCost * pct);
  } else {
    const ratePerGram = Math.max(0, input.makingChargeValue);
    makingChargesTotal = Math.round(weight * ratePerGram);
  }

  const stoneValue = Math.max(0, input.stoneValue ?? 0);
  const discount = Math.max(0, input.discountAmount ?? 0);

  const subtotalBeforeTax = rawGoldCost + makingChargesTotal + stoneValue;
  const netTaxableAmount = Math.max(0, subtotalBeforeTax - discount);

  // 3% GST on jewelry (1.5% CGST + 1.5% SGST)
  const cgstAmount = Number((netTaxableAmount * 0.015).toFixed(2));
  const sgstAmount = Number((netTaxableAmount * 0.015).toFixed(2));
  const totalGST = Number((cgstAmount + sgstAmount).toFixed(2));

  // BIS Hallmarking
  const hallmarkingFee = input.includeHallmarking !== false ? BIS_GOLD_HALLMARKING_FEE : 0;

  const totalInvoiceAmount = Math.round(netTaxableAmount + totalGST + hallmarkingFee);
  const effectiveCostPerGram = weight > 0 ? Math.round(totalInvoiceAmount / weight) : 0;

  return {
    metal: 'gold',
    baseBenchmarkRate: goldRate24KPer10g,
    ratePerGram: Math.round(goldRate24KPerGram),
    effectiveRatePerGram: Math.round(effectiveGoldRatePerGram),
    purityPercentage: Number((purityInfo.ratio * 100).toFixed(1)),
    purityCode: purityInfo.code,
    purityLabel: purityInfo.label,

    weightGrams: weight,
    rawMetalCost: rawGoldCost,

    goldRate24KPerGram: Math.round(goldRate24KPerGram),
    effectiveGoldRatePerGram: Math.round(effectiveGoldRatePerGram),
    goldWeightGrams: weight,
    rawGoldCost,

    makingChargeType: input.makingChargeType,
    makingChargeRate: input.makingChargeValue,
    makingChargesTotal,

    stoneValue,
    subtotalBeforeTax,
    discount,
    netTaxableAmount,

    cgstPercentage: 1.5,
    cgstAmount,
    sgstPercentage: 1.5,
    sgstAmount,
    totalGST,

    hallmarkingFee,
    totalInvoiceAmount,
    effectiveCostPerGram,
  };
}

export function calculateSilverInvoice(input: SilverInvoiceInput): BullionInvoiceBreakdown {
  const silverRate999PerKg = Math.max(0, input.silverRate999PerKg);
  const silverRatePerGram = silverRate999PerKg / 1000;
  const weight = Math.max(0, input.weightGrams);
  const purityInfo = SILVER_PURITY_MULTIPLIERS[input.purity] || SILVER_PURITY_MULTIPLIERS['925'];

  const effectiveRatePerGram = silverRatePerGram * purityInfo.ratio;
  const rawMetalCost = Math.round(weight * effectiveRatePerGram);

  let makingChargesTotal = 0;
  if (input.makingChargeType === 'percentage') {
    const pct = Math.max(0, input.makingChargeValue) / 100;
    makingChargesTotal = Math.round(rawMetalCost * pct);
  } else {
    const ratePerGram = Math.max(0, input.makingChargeValue);
    makingChargesTotal = Math.round(weight * ratePerGram);
  }

  const stoneValue = Math.max(0, input.stoneValue ?? 0);
  const discount = Math.max(0, input.discountAmount ?? 0);

  const subtotalBeforeTax = rawMetalCost + makingChargesTotal + stoneValue;
  const netTaxableAmount = Math.max(0, subtotalBeforeTax - discount);

  // 3% GST on Silver (1.5% CGST + 1.5% SGST)
  const cgstAmount = Number((netTaxableAmount * 0.015).toFixed(2));
  const sgstAmount = Number((netTaxableAmount * 0.015).toFixed(2));
  const totalGST = Number((cgstAmount + sgstAmount).toFixed(2));

  // BIS Silver Hallmarking fee (₹35 + 18% GST = ₹41.30)
  const hallmarkingFee = input.includeHallmarking !== false ? BIS_SILVER_HALLMARKING_FEE : 0;

  const totalInvoiceAmount = Math.round(netTaxableAmount + totalGST + hallmarkingFee);
  const effectiveCostPerGram = weight > 0 ? Math.round(totalInvoiceAmount / weight) : 0;

  return {
    metal: 'silver',
    baseBenchmarkRate: silverRate999PerKg,
    ratePerGram: Math.round(silverRatePerGram * 10) / 10,
    effectiveRatePerGram: Math.round(effectiveRatePerGram * 10) / 10,
    purityPercentage: Number((purityInfo.ratio * 100).toFixed(1)),
    purityCode: purityInfo.code,
    purityLabel: purityInfo.label,

    weightGrams: weight,
    rawMetalCost,

    makingChargeType: input.makingChargeType,
    makingChargeRate: input.makingChargeValue,
    makingChargesTotal,

    stoneValue,
    subtotalBeforeTax,
    discount,
    netTaxableAmount,

    cgstPercentage: 1.5,
    cgstAmount,
    sgstPercentage: 1.5,
    sgstAmount,
    totalGST,

    hallmarkingFee,
    totalInvoiceAmount,
    effectiveCostPerGram,
  };
}

