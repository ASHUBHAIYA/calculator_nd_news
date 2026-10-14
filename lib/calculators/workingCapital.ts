/**
 * Working Capital & Current Ratio Calculation Engine
 * Designed for Indian MSMEs, proprietary businesses, and corporate finance.
 */

export interface WorkingCapitalInput {
  // Current Assets
  cashAndBank: number;
  accountsReceivable: number;
  inventory: number;
  otherCurrentAssets?: number;

  // Current Liabilities
  accountsPayable: number;
  shortTermDebt: number; // Bank CC / OD / Short-term credit
  accruedExpenses: number; // Unpaid GST, TDS, salaries, utilities
  otherCurrentLiabilities?: number;
}

export interface WorkingCapitalResult {
  totalCurrentAssets: number;
  totalCurrentLiabilities: number;
  netWorkingCapital: number;
  currentRatio: number | null; // null if liabilities are 0
  quickRatio: number | null;   // (Cash + Receivables) / Liabilities
  workingCapitalStatus: 'healthy' | 'adequate' | 'deficit';
  statusDescription: string;
}

/**
 * Calculates Net Working Capital, Current Ratio, and Quick Ratio.
 * Formulas:
 *   Net Working Capital = Total Current Assets - Total Current Liabilities
 *   Current Ratio = Total Current Assets / Total Current Liabilities
 *   Quick (Acid-Test) Ratio = (Cash & Bank + Accounts Receivable) / Total Current Liabilities
 */
export function calculateWorkingCapital(input: WorkingCapitalInput): WorkingCapitalResult {
  const cash = Math.max(0, input.cashAndBank || 0);
  const receivables = Math.max(0, input.accountsReceivable || 0);
  const inventory = Math.max(0, input.inventory || 0);
  const otherAssets = Math.max(0, input.otherCurrentAssets || 0);

  const payables = Math.max(0, input.accountsPayable || 0);
  const debt = Math.max(0, input.shortTermDebt || 0);
  const accrued = Math.max(0, input.accruedExpenses || 0);
  const otherLiab = Math.max(0, input.otherCurrentLiabilities || 0);

  const totalCurrentAssets = cash + receivables + inventory + otherAssets;
  const totalCurrentLiabilities = payables + debt + accrued + otherLiab;

  const netWorkingCapital = totalCurrentAssets - totalCurrentLiabilities;

  let currentRatio: number | null = null;
  let quickRatio: number | null = null;

  if (totalCurrentLiabilities > 0) {
    currentRatio = Number((totalCurrentAssets / totalCurrentLiabilities).toFixed(2));
    quickRatio = Number(((cash + receivables) / totalCurrentLiabilities).toFixed(2));
  }

  let workingCapitalStatus: 'healthy' | 'adequate' | 'deficit' = 'adequate';
  let statusDescription = '';

  if (netWorkingCapital < 0 || (currentRatio !== null && currentRatio < 1.0)) {
    workingCapitalStatus = 'deficit';
    statusDescription =
      'Negative Working Capital: Current liabilities exceed liquid assets. The business may face cash flow friction servicing obligations due within 12 months without additional financing.';
  } else if (currentRatio !== null && currentRatio >= 1.5) {
    workingCapitalStatus = 'healthy';
    statusDescription =
      'Strong Liquidity Cushion: Current assets comfortably exceed near-term debt obligations, providing strong operational headroom.';
  } else {
    workingCapitalStatus = 'adequate';
    statusDescription =
      'Balanced Liquidity: Current assets cover current liabilities, but receivables collection and inventory turns must be closely monitored to prevent temporary cash crunches.';
  }

  return {
    totalCurrentAssets,
    totalCurrentLiabilities,
    netWorkingCapital,
    currentRatio,
    quickRatio,
    workingCapitalStatus,
    statusDescription,
  };
}
