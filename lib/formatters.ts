/**
 * Currency, number, and input parsing utilities for Indian localization.
 * Complies with RBI, Income Tax Dept, and standard Indian numbering systems (Lakhs/Crores).
 */

const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const inrFormatterWithDecimals = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 2,
});

/**
 * Formats a number into Indian Rupee representation (e.g. ₹1,50,000).
 */
export function formatINR(value: number, includeDecimals: boolean = false): string {
  if (isNaN(value) || !isFinite(value)) return '₹0';
  return includeDecimals ? inrFormatterWithDecimals.format(value) : inrFormatter.format(Math.round(value));
}

/**
 * Formats a raw number according to Indian grouping (e.g. 1,50,000).
 */
export function formatNumberIN(value: number, maxDecimals: number = 2): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: maxDecimals,
  }).format(value);
}

/**
 * Parses user text inputs into clean positive numbers, handling commas, spaces, and currency symbols.
 */
export function parseInput(input: string | number, fallback: number = 0): number {
  if (typeof input === 'number') {
    return isNaN(input) ? fallback : Math.max(0, input);
  }
  if (!input || typeof input !== 'string') return fallback;
  const cleaned = input.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? fallback : Math.max(0, parsed);
}

/**
 * Converts a large INR number into human-readable compact denomination (K, Lakh, Crore).
 */
export function formatCompactINR(amount: number): string {
  if (isNaN(amount) || !isFinite(amount)) return '₹0';
  const abs = Math.abs(amount);
  const prefix = amount < 0 ? '-₹' : '₹';

  if (abs >= 10000000) {
    // 1 Crore = 10,000,000
    return `${prefix}${(abs / 10000000).toFixed(2)} Cr`;
  }
  if (abs >= 100000) {
    // 1 Lakh = 100,000
    return `${prefix}${(abs / 100000).toFixed(2)} Lakh`;
  }
  if (abs >= 1000) {
    return `${prefix}${(abs / 1000).toFixed(1)} K`;
  }
  return formatINR(amount);
}

/**
 * Returns a human-friendly spoken words breakdown for large Indian amounts.
 */
export function amountInWordsIN(amount: number): string {
  if (amount <= 0 || isNaN(amount)) return 'Zero Rupees';
  const crore = Math.floor(amount / 10000000);
  const remainderCrore = amount % 10000000;
  const lakh = Math.floor(remainderCrore / 100000);
  const remainderLakh = remainderCrore % 100000;
  const thousand = Math.floor(remainderLakh / 1000);
  const remainderThousand = Math.floor(remainderLakh % 1000);

  const parts: string[] = [];
  if (crore > 0) parts.push(`${crore} Crore`);
  if (lakh > 0) parts.push(`${lakh} Lakh`);
  if (thousand > 0) parts.push(`${thousand} Thousand`);
  if (remainderThousand > 0 && parts.length === 0) parts.push(`${remainderThousand}`);

  return parts.join(' ') + ' Rupees';
}
