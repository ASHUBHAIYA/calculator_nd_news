/**
 * Inventory Reorder & Safety Stock Calculation Engine
 * Designed for Indian retailers, wholesalers, and inventory managers.
 */

export interface InventoryReorderInput {
  averageDailyDemand: number; // Units sold/consumed per day
  leadTimeDays: number;       // Supplier replenishment lead time in days
  safetyStock?: number;       // Optional buffer units for demand surges / delays
  orderCost?: number;         // Optional cost to place an order (₹)
  annualHoldingCost?: number; // Optional annual carrying cost per unit (₹)
  annualDemand?: number;      // Optional annual demand (defaults to dailyDemand * 365)
}

export interface InventoryReorderResult {
  averageDailyDemand: number;
  leadTimeDays: number;
  leadTimeDemand: number;
  safetyStock: number;
  reorderPoint: number;
  suggestedReorderQuantity: number;
  economicOrderQuantity?: number;
  daysOfSupplyAtReorderPoint: number;
  assumptions: string[];
}

/**
 * Calculates the inventory reorder point (ROP) and suggested reorder quantity.
 * Formula:
 *   Reorder Point (ROP) = (Average Daily Demand × Lead Time in Days) + Safety Stock
 *   EOQ (Optional) = sqrt((2 × Annual Demand × Ordering Cost) / Holding Cost)
 */
export function calculateInventoryReorder(input: InventoryReorderInput): InventoryReorderResult {
  const demand = Math.max(0, input.averageDailyDemand || 0);
  const leadTime = Math.max(0, input.leadTimeDays || 0);
  const safety = Math.max(0, input.safetyStock || 0);
  const orderCost = Math.max(0, input.orderCost || 0);
  const holdingCost = Math.max(0, input.annualHoldingCost || 0);

  const leadTimeDemand = Math.round(demand * leadTime);
  const reorderPoint = Math.ceil(leadTimeDemand + safety);

  const annualDemand = Math.max(0, input.annualDemand || demand * 365);

  let eoq: number | undefined;
  if (orderCost > 0 && holdingCost > 0 && annualDemand > 0) {
    eoq = Math.round(Math.sqrt((2 * annualDemand * orderCost) / holdingCost));
  }

  // Suggested reorder quantity defaults to EOQ if available, or 30 days cycle stock, minimum 1
  const suggestedReorderQuantity = eoq && eoq > 0
    ? eoq
    : Math.max(1, Math.round(demand * Math.max(14, leadTime * 2)));

  const daysOfSupply = demand > 0 ? Number((reorderPoint / demand).toFixed(1)) : 0;

  const assumptions = [
    'Assumes average daily consumption remains consistent over the supplier replenishment lead time.',
    'Lead time reflects full transit, inspection, and receiving turnaround from supplier purchase order placement.',
    'Safety stock acts as a protective buffer against unexpected demand surges or logistics delays.',
    eoq
      ? 'Economic Order Quantity (EOQ) minimizes the sum of purchase ordering and annual holding carrying costs.'
      : 'Order quantity estimate assumes a balanced cycle stock. Provide ordering cost and annual holding cost to activate Wilson EOQ optimization.',
  ];

  return {
    averageDailyDemand: demand,
    leadTimeDays: leadTime,
    leadTimeDemand,
    safetyStock: safety,
    reorderPoint,
    suggestedReorderQuantity,
    economicOrderQuantity: eoq,
    daysOfSupplyAtReorderPoint: daysOfSupply,
    assumptions,
  };
}
