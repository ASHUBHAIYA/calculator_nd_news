/**
 * Business & Trade Calculation Engine
 * Designed for Indian retailers, wholesalers, distributors, and MSMEs.
 * Adheres strictly to standard commercial accounting and Indian tax rules.
 */

// ============================================================================
// 1. Wholesale Profit Margin Calculator
// ============================================================================

export interface WholesaleMarginInput {
  purchaseCostPerUnit: number; // Cost price per unit (₹)
  sellingPricePerUnit: number;  // Listed selling price per unit (₹)
  quantity: number;             // Batch or lot size
  additionalExpenses: number;   // Handling, packaging, transport, etc. (₹)
  sellingDiscountPct?: number;  // Optional discount given to buyer (%)
  targetMarginPct?: number;     // Optional desired target margin (%)
}

export interface WholesaleMarginResult {
  effectiveSellingPricePerUnit: number;
  totalPurchaseCost: number;
  totalRevenue: number;
  totalExpenses: number;
  totalCostOfGoodsAndOps: number;
  totalProfit: number;
  profitPerUnit: number;
  profitMarginPct: number;    // Profit / Revenue * 100
  markupPct: number;          // Profit / Cost * 100
  breakEvenSellingPrice: number; // Minimum selling price per unit to have ₹0 profit
  sellingPriceForTargetMargin: number; // Price per unit needed to achieve targetMarginPct
  isLoss: boolean;
}

export function calculateWholesaleMargin(input: WholesaleMarginInput): WholesaleMarginResult {
  const purchaseCost = Math.max(0, input.purchaseCostPerUnit || 0);
  const listedSelling = Math.max(0, input.sellingPricePerUnit || 0);
  const qty = Math.max(1, input.quantity || 1);
  const expenses = Math.max(0, input.additionalExpenses || 0);
  const discountPct = Math.min(100, Math.max(0, input.sellingDiscountPct || 0));
  const targetMarginPct = Math.min(99.9, Math.max(0, input.targetMarginPct ?? 20));

  const effectiveSellingPricePerUnit = listedSelling * (1 - discountPct / 100);
  const totalPurchaseCost = purchaseCost * qty;
  const totalRevenue = effectiveSellingPricePerUnit * qty;
  const totalExpenses = expenses;
  const totalCostOfGoodsAndOps = totalPurchaseCost + totalExpenses;

  const totalProfit = totalRevenue - totalCostOfGoodsAndOps;
  const profitPerUnit = totalProfit / qty;

  const profitMarginPct = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const markupPct = totalCostOfGoodsAndOps > 0 ? (totalProfit / totalCostOfGoodsAndOps) * 100 : 0;

  // Break-even selling price per unit (after taking into account any discount)
  // Effective price needed = (totalPurchaseCost + totalExpenses) / qty
  // Listed price needed = Effective price / (1 - discountPct / 100)
  const baseCostPerUnit = (totalPurchaseCost + totalExpenses) / qty;
  const discountFactor = 1 - discountPct / 100;
  const breakEvenSellingPrice = discountFactor > 0 ? baseCostPerUnit / discountFactor : baseCostPerUnit;

  // Target Margin: Revenue * (1 - targetMarginPct/100) = Total Cost
  // Revenue = Total Cost / (1 - targetMarginPct/100)
  // Price per unit = Revenue / qty / discountFactor
  const marginFactor = 1 - targetMarginPct / 100;
  const requiredRevenue = marginFactor > 0 ? totalCostOfGoodsAndOps / marginFactor : totalCostOfGoodsAndOps;
  const requiredEffectivePrice = requiredRevenue / qty;
  const sellingPriceForTargetMargin = discountFactor > 0 ? requiredEffectivePrice / discountFactor : requiredEffectivePrice;

  return {
    effectiveSellingPricePerUnit,
    totalPurchaseCost,
    totalRevenue,
    totalExpenses,
    totalCostOfGoodsAndOps,
    totalProfit,
    profitPerUnit,
    profitMarginPct,
    markupPct,
    breakEvenSellingPrice,
    sellingPriceForTargetMargin,
    isLoss: totalProfit < 0,
  };
}

// ============================================================================
// 2. Supplier Scheme Calculator
// ============================================================================

export type SchemeType = 'buy_x_get_y' | 'percentage_discount' | 'fixed_discount_per_unit';

export interface SupplierOfferInput {
  name: string;
  schemeType: SchemeType;
  basePricePerUnit: number;     // ₹
  orderQuantity: number;        // Units ordered / paid
  freeQuantity?: number;        // For buy X get Y (e.g., Buy 10 Get 1)
  discountPercentage?: number;  // % discount on base price
  fixedDiscountPerUnit?: number;// ₹ discount per unit
  additionalExpenses?: number;  // Freight, handling, etc. (₹)
}

export interface SupplierOfferResult {
  name: string;
  paidQuantity: number;
  freeQuantity: number;
  totalQuantityReceived: number;
  grossAmount: number;
  schemeDiscountAmount: number;
  additionalExpenses: number;
  netTotalCost: number;
  effectiveCostPerUnit: number;
  effectiveDiscountPct: number;
  totalSavings: number; // Compared to buying total quantity at full base price
}

export function calculateSupplierOffer(offer: SupplierOfferInput): SupplierOfferResult {
  const basePrice = Math.max(0, offer.basePricePerUnit || 0);
  const orderQty = Math.max(1, offer.orderQuantity || 1);
  const expenses = Math.max(0, offer.additionalExpenses || 0);

  let paidQuantity = orderQty;
  let freeQuantity = 0;
  let schemeDiscountAmount = 0;

  if (offer.schemeType === 'buy_x_get_y') {
    freeQuantity = Math.max(0, offer.freeQuantity || 0);
    paidQuantity = orderQty;
  } else if (offer.schemeType === 'percentage_discount') {
    const pct = Math.min(100, Math.max(0, offer.discountPercentage || 0));
    schemeDiscountAmount = (basePrice * orderQty * pct) / 100;
  } else if (offer.schemeType === 'fixed_discount_per_unit') {
    const fixedDisc = Math.min(basePrice, Math.max(0, offer.fixedDiscountPerUnit || 0));
    schemeDiscountAmount = fixedDisc * orderQty;
  }

  const totalQuantityReceived = paidQuantity + freeQuantity;
  const grossAmount = basePrice * paidQuantity;
  const netProductCost = Math.max(0, grossAmount - schemeDiscountAmount);
  const netTotalCost = netProductCost + expenses;

  const effectiveCostPerUnit = totalQuantityReceived > 0 ? netTotalCost / totalQuantityReceived : 0;

  // Baseline standard cost without any offer for the same total received units
  const baselineCost = basePrice * totalQuantityReceived + expenses;
  const totalSavings = Math.max(0, baselineCost - netTotalCost);
  const effectiveDiscountPct = baselineCost > 0 ? (totalSavings / baselineCost) * 100 : 0;

  return {
    name: offer.name || 'Offer',
    paidQuantity,
    freeQuantity,
    totalQuantityReceived,
    grossAmount,
    schemeDiscountAmount,
    additionalExpenses: expenses,
    netTotalCost,
    effectiveCostPerUnit,
    effectiveDiscountPct,
    totalSavings,
  };
}

export interface OfferComparisonResult {
  offerA: SupplierOfferResult;
  offerB: SupplierOfferResult;
  betterOffer: 'A' | 'B' | 'TIE';
  costDifferencePerUnit: number;
  totalSavingsDifference: number;
  summaryText: string;
}

export function compareSupplierOffers(
  offerA: SupplierOfferInput,
  offerB: SupplierOfferInput
): OfferComparisonResult {
  const resultA = calculateSupplierOffer(offerA);
  const resultB = calculateSupplierOffer(offerB);

  const diffPerUnit = Math.abs(resultA.effectiveCostPerUnit - resultB.effectiveCostPerUnit);
  const diffSavings = Math.abs(resultA.totalSavings - resultB.totalSavings);

  let betterOffer: 'A' | 'B' | 'TIE' = 'TIE';
  let summaryText = 'Both supplier offers deliver the identical effective cost per unit.';

  if (resultA.effectiveCostPerUnit < resultB.effectiveCostPerUnit - 0.001) {
    betterOffer = 'A';
    summaryText = `${resultA.name} is cheaper by ₹${diffPerUnit.toFixed(2)}/unit (${((diffPerUnit / resultB.effectiveCostPerUnit) * 100).toFixed(1)}% lower cost).`;
  } else if (resultB.effectiveCostPerUnit < resultA.effectiveCostPerUnit - 0.001) {
    betterOffer = 'B';
    summaryText = `${resultB.name} is cheaper by ₹${diffPerUnit.toFixed(2)}/unit (${((diffPerUnit / resultA.effectiveCostPerUnit) * 100).toFixed(1)}% lower cost).`;
  }

  return {
    offerA: resultA,
    offerB: resultB,
    betterOffer,
    costDifferencePerUnit: diffPerUnit,
    totalSavingsDifference: diffSavings,
    summaryText,
  };
}

// ============================================================================
// 3. Landed Cost Calculator
// ============================================================================

export interface LandedCostInput {
  purchasePricePerUnit: number; // Base purchase rate (₹)
  quantity: number;              // Lot size (units)
  freightCharges: number;        // Transportation / cargo (₹)
  loadingUnloadingCharges: number; // Hamali / labor (₹)
  packagingExpenses: number;     // Cartons, shrink wrap, labels (₹)
  otherAttributableExpenses: number; // Insurance, transit handling, etc. (₹)
  nonRecoverableDutiesTaxes: number; // Mandi tax, octroi, entry tax, etc. (₹)
  recoverableGstRatePct?: number; // Optional GST input tax credit %
}

export interface LandedCostResult {
  totalPurchaseCost: number;
  freightCharges: number;
  loadingUnloadingCharges: number;
  packagingExpenses: number;
  otherAttributableExpenses: number;
  nonRecoverableDutiesTaxes: number;
  totalAdditionalExpenses: number;
  totalLandedCost: number;
  landedCostPerUnit: number;
  additionalCostPercentage: number; // (Additional / Purchase) * 100
  // Informational recoverable GST (input tax credit)
  recoverableGstAmount: number;
  grossAmountIncludingRecoverableGst: number;
}

export function calculateLandedCost(input: LandedCostInput): LandedCostResult {
  const price = Math.max(0, input.purchasePricePerUnit || 0);
  const qty = Math.max(1, input.quantity || 1);
  const freight = Math.max(0, input.freightCharges || 0);
  const loading = Math.max(0, input.loadingUnloadingCharges || 0);
  const packaging = Math.max(0, input.packagingExpenses || 0);
  const other = Math.max(0, input.otherAttributableExpenses || 0);
  const nonRecov = Math.max(0, input.nonRecoverableDutiesTaxes || 0);
  const gstRate = Math.max(0, input.recoverableGstRatePct || 0);

  const totalPurchaseCost = price * qty;
  const totalAdditionalExpenses = freight + loading + packaging + other + nonRecov;
  const totalLandedCost = totalPurchaseCost + totalAdditionalExpenses;
  const landedCostPerUnit = totalLandedCost / qty;

  const additionalCostPercentage = totalPurchaseCost > 0 ? (totalAdditionalExpenses / totalPurchaseCost) * 100 : 0;

  // Recoverable GST calculation (GST on goods and taxable freight that provides Input Tax Credit)
  const recoverableGstAmount = (totalPurchaseCost * gstRate) / 100;
  const grossAmountIncludingRecoverableGst = totalLandedCost + recoverableGstAmount;

  return {
    totalPurchaseCost,
    freightCharges: freight,
    loadingUnloadingCharges: loading,
    packagingExpenses: packaging,
    otherAttributableExpenses: other,
    nonRecoverableDutiesTaxes: nonRecov,
    totalAdditionalExpenses,
    totalLandedCost,
    landedCostPerUnit,
    additionalCostPercentage,
    recoverableGstAmount,
    grossAmountIncludingRecoverableGst,
  };
}

// ============================================================================
// 4. Margin vs Markup Calculator
// ============================================================================

export type MarginMarkupMode = 'by_selling_price' | 'by_desired_margin' | 'by_desired_markup';

export interface MarginVsMarkupInput {
  costPrice: number;            // Total cost per unit / product (₹)
  mode: MarginMarkupMode;
  sellingPrice?: number;        // When mode === 'by_selling_price'
  desiredMarginPct?: number;    // When mode === 'by_desired_margin'
  desiredMarkupPct?: number;    // When mode === 'by_desired_markup'
  additionalCosts?: number;     // Optional overhead per unit (₹)
}

export interface MarginVsMarkupResult {
  costPrice: number;
  additionalCosts: number;
  totalCost: number;
  sellingPrice: number;
  profitAmount: number;
  profitMarginPct: number;    // Profit / Selling Price * 100
  markupPct: number;          // Profit / Total Cost * 100
  sellingPriceFor20Margin: number;
  sellingPriceFor20Markup: number;
  isLoss: boolean;
}

export function calculateMarginVsMarkup(input: MarginVsMarkupInput): MarginVsMarkupResult {
  const cost = Math.max(0, input.costPrice || 0);
  const overhead = Math.max(0, input.additionalCosts || 0);
  const totalCost = cost + overhead;

  let sellingPrice = 0;

  if (input.mode === 'by_selling_price') {
    sellingPrice = Math.max(0, input.sellingPrice || 0);
  } else if (input.mode === 'by_desired_margin') {
    const margin = Math.min(99.9, Math.max(0, input.desiredMarginPct || 0));
    sellingPrice = margin < 100 ? totalCost / (1 - margin / 100) : totalCost;
  } else if (input.mode === 'by_desired_markup') {
    const markup = Math.max(0, input.desiredMarkupPct || 0);
    sellingPrice = totalCost * (1 + markup / 100);
  }

  const profitAmount = sellingPrice - totalCost;
  const profitMarginPct = sellingPrice > 0 ? (profitAmount / sellingPrice) * 100 : 0;
  const markupPct = totalCost > 0 ? (profitAmount / totalCost) * 100 : 0;

  // Benchmarks: Selling price required for 20% margin vs 20% markup
  const sellingPriceFor20Margin = totalCost / 0.8; // 20% margin -> / (1 - 0.20)
  const sellingPriceFor20Markup = totalCost * 1.2; // 20% markup -> * 1.20

  return {
    costPrice: cost,
    additionalCosts: overhead,
    totalCost,
    sellingPrice,
    profitAmount,
    profitMarginPct,
    markupPct,
    sellingPriceFor20Margin,
    sellingPriceFor20Markup,
    isLoss: profitAmount < 0,
  };
}

// ============================================================================
// 5. Credit Sale Cost Calculator
// ============================================================================

export interface CreditSaleCostInput {
  invoiceAmount: number;        // Invoice total (₹)
  creditPeriodDays: number;     // Payment terms (e.g., 30, 45, 60, 90 days)
  annualFinancingRatePct: number; // Cost of working capital / bank CC interest (% p.a.)
  collectionAdminCosts?: number;// Follow-up costs, recovery fees, discounts (₹)
}

export interface CreditSaleCostResult {
  invoiceAmount: number;
  creditPeriodDays: number;
  annualFinancingRatePct: number;
  dailyFinancingRatePct: number;
  estimatedFinancingCost: number;  // (Invoice * AnnualRate * Days) / 365
  collectionAdminCosts: number;
  totalEstimatedCreditCost: number;
  creditCostPercentage: number;   // Total Credit Cost / Invoice * 100
  estimatedNetProceeds: number;   // Invoice - Total Credit Cost
  annualizedCostPct: number;
}

export function calculateCreditSaleCost(input: CreditSaleCostInput): CreditSaleCostResult {
  const invoice = Math.max(0, input.invoiceAmount || 0);
  const days = Math.max(1, input.creditPeriodDays || 1);
  const annualRate = Math.max(0, input.annualFinancingRatePct || 0);
  const adminCosts = Math.max(0, input.collectionAdminCosts || 0);

  // Simple day-basis financial cost of funding this receivable
  const estimatedFinancingCost = (invoice * (annualRate / 100) * days) / 365;
  const totalEstimatedCreditCost = estimatedFinancingCost + adminCosts;

  const creditCostPercentage = invoice > 0 ? (totalEstimatedCreditCost / invoice) * 100 : 0;
  const estimatedNetProceeds = Math.max(0, invoice - totalEstimatedCreditCost);

  // Annualized rate of the credit granted
  const annualizedCostPct = days > 0 ? (creditCostPercentage * 365) / days : 0;

  return {
    invoiceAmount: invoice,
    creditPeriodDays: days,
    annualFinancingRatePct: annualRate,
    dailyFinancingRatePct: annualRate / 365,
    estimatedFinancingCost,
    collectionAdminCosts: adminCosts,
    totalEstimatedCreditCost,
    creditCostPercentage,
    estimatedNetProceeds,
    annualizedCostPct,
  };
}

// ============================================================================
// 6. GST-Inclusive Price Calculator
// ============================================================================

export type GstCalculationMode = 'inclusive' | 'exclusive';

export interface GstCalculationInput {
  amount: number;               // The entered amount (₹)
  gstRatePct: number;           // Standard Indian GST rates: 0, 3, 5, 12, 18, 28, or custom
  mode: GstCalculationMode;     // 'inclusive' = price includes GST; 'exclusive' = GST to be added
  transactionType?: 'intra_state' | 'inter_state'; // Intra (CGST+SGST) vs Inter (IGST)
}

export interface GstCalculationResult {
  enteredAmount: number;
  mode: GstCalculationMode;
  gstRatePct: number;
  taxableAmount: number;        // Base price before GST
  totalGstAmount: number;       // Total tax
  cgstAmount: number;           // Intra-state Central GST
  sgstAmount: number;           // Intra-state State GST
  igstAmount: number;           // Inter-state Integrated GST
  totalIncludingGst: number;    // Final customer price
  effectiveTaxMultiplier: number;
}

export function calculateGstPrice(input: GstCalculationInput): GstCalculationResult {
  const amount = Math.max(0, input.amount || 0);
  const gstRate = Math.max(0, input.gstRatePct || 0);
  const isInclusive = input.mode === 'inclusive';
  const isInterState = input.transactionType === 'inter_state';

  let taxableAmount = 0;
  let totalGstAmount = 0;
  let totalIncludingGst = 0;

  if (isInclusive) {
    // Amount = Taxable * (1 + GST/100)
    // Taxable = Amount / (1 + GST/100)
    taxableAmount = amount / (1 + gstRate / 100);
    totalGstAmount = amount - taxableAmount;
    totalIncludingGst = amount;
  } else {
    // Exclusive mode: Amount is Taxable
    taxableAmount = amount;
    totalGstAmount = (amount * gstRate) / 100;
    totalIncludingGst = taxableAmount + totalGstAmount;
  }

  const cgstAmount = isInterState ? 0 : totalGstAmount / 2;
  const sgstAmount = isInterState ? 0 : totalGstAmount / 2;
  const igstAmount = isInterState ? totalGstAmount : 0;

  return {
    enteredAmount: amount,
    mode: input.mode,
    gstRatePct: gstRate,
    taxableAmount,
    totalGstAmount,
    cgstAmount,
    sgstAmount,
    igstAmount,
    totalIncludingGst,
    effectiveTaxMultiplier: 1 + gstRate / 100,
  };
}
