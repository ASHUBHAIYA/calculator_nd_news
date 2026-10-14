/**
 * Comprehensive Unit Test Suite & Validation Engine for BharatCalc
 * Tests all statutory calculation logic, rounding precision, and edge-case boundaries.
 */

import { calculateInHandSalary } from '../salary';
import { calculateGoldInvoice } from '../gold';
import { calculateLoanPrepayment, calculateMonthlyEMI } from '../loan';
import { calculateFuelSpend } from '../fuel';
import { calculateSolarSubsidy, calculateCentralSubsidy } from '../solar';
import { calculateInventoryReorder } from '../inventory';
import { calculateWorkingCapital } from '../workingCapital';
import { calculateElectricityBill } from '../electricity';
import { calculateSipGrowth } from '../investment';
import { calculateDeposit } from '../deposit';
import { calculateInflation } from '../inflation';
import { buildCanonicalUrl } from '../../seoUtils';
import { formatINR, parseInput } from '../../formatters';

export interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  actual: any;
  expected: any;
  message?: string;
}

export function runAllUnitTests(): TestResult[] {
  const results: TestResult[] = [];

  function assert(name: string, category: string, condition: boolean, actual: any, expected: any, message?: string) {
    results.push({
      name,
      category,
      passed: condition,
      actual,
      expected,
      message,
    });
  }

  // -------------------------------------------------------------
  // 1. Formatters Tests
  // -------------------------------------------------------------
  const formatted1 = formatINR(150000);
  assert(
    'Format INR Indian Grouping',
    'Formatters',
    formatted1.includes('1,50,000'),
    formatted1,
    '₹1,50,000',
    'Should format 150000 into Indian currency grouping'
  );

  const parsed = parseInput('₹ 1,50,000.50');
  assert(
    'Parse Indian Currency Input',
    'Formatters',
    parsed === 150000.5,
    parsed,
    150000.5,
    'Should strip rupee symbols and commas cleanly'
  );

  // -------------------------------------------------------------
  // 2. Salary Engine Tests (FY 2026-27 New Tax Regime)
  // -------------------------------------------------------------
  // Test A: Standard Deduction of ₹75,000
  const sal7L = calculateInHandSalary({ annualCTC: 750000, epfType: 'none', professionalTaxAnnual: 0 });
  assert(
    'Standard Deduction ₹75,000 Applied',
    'Salary Engine',
    sal7L.standardDeduction === 75000,
    sal7L.standardDeduction,
    75000,
    'Standard deduction must be exactly ₹75,000 under FY 2026-27 New Regime'
  );

  // Test B: Zero Tax on Gross <= ₹7.75 Lakhs due to Standard Deduction + Sec 87A
  assert(
    'Section 87A Zero Tax Rebate up to ₹7.75L Gross',
    'Salary Engine',
    sal7L.totalAnnualTax === 0,
    sal7L.totalAnnualTax,
    0,
    'Taxable income ≤ ₹7L must have 100% tax rebate under Section 87A'
  );

  // Test C: High Earner CTC ₹20,00,000
  const sal20L = calculateInHandSalary({ annualCTC: 2000000, epfType: 'actual', professionalTaxAnnual: 2400 });
  assert(
    'High Earner Positive Net Tax & Positive In-Hand',
    'Salary Engine',
    sal20L.totalAnnualTax > 0 && sal20L.monthlyInHandSalary > 0 && sal20L.monthlyInHandSalary < (2000000 / 12),
    sal20L.monthlyInHandSalary,
    'Valid in-hand between 0 and CTC/12',
    'Net monthly salary must be positive and reflect tax & EPF deductions'
  );

  // Test D: EPF Statutory Capping at ₹1,800/mo (₹21,600/yr)
  const salCapped = calculateInHandSalary({ annualCTC: 3000000, basicPercentage: 50, epfType: 'capped' });
  assert(
    'EPF Capped at ₹1,800/mo',
    'Salary Engine',
    salCapped.annualEmployeeEPF === 21600,
    salCapped.annualEmployeeEPF,
    21600,
    'Capped EPF option must cap annual employee contribution at ₹21,600'
  );

  // Test E: High Earner CTC ₹1 Crore (Surcharge > 50L)
  const sal1Cr = calculateInHandSalary({ annualCTC: 10000000, epfType: 'capped', basicPercentage: 40 });
  assert(
    'Income > ₹50L Applies Statutory Surcharge',
    'Salary Engine',
    sal1Cr.surcharge > 0 && sal1Cr.surchargeRate >= 0.10,
    sal1Cr.surchargeRate,
    'Surcharge rate >= 10%',
    'Incomes exceeding ₹50 Lakh must trigger statutory tax surcharge under Section 115BAC'
  );

  // -------------------------------------------------------------
  // 3. Gold Jewelry Invoice Engine Tests
  // -------------------------------------------------------------
  // Test A: 22K Purity Ratio (22/24 = 91.666%)
  const gold22K = calculateGoldInvoice({
    goldRate24KPer10g: 72000,
    weightGrams: 10,
    purity: '22K',
    makingChargeType: 'percentage',
    makingChargeValue: 0,
    includeHallmarking: false,
  });
  // 24K per gram is 7200. 22K per gram is (7200/24)*22 = 6600. For 10g = 66,000 raw.
  // With 3% GST: 66,000 * 1.03 = 67,980.
  assert(
    '22K Hallmark 916 Pure Gold Price & 3% GST',
    'Gold Engine',
    gold22K.rawGoldCost === 66000 && gold22K.totalInvoiceAmount === 67980,
    gold22K.totalInvoiceAmount,
    67980,
    '22K rate must equal 22/24 of 24K rate, plus exact 3% GST'
  );

  // Test B: Making charges percentage
  const goldMaking = calculateGoldInvoice({
    goldRate24KPer10g: 72000,
    weightGrams: 10,
    purity: '22K',
    makingChargeType: 'percentage',
    makingChargeValue: 10, // 10% of 66,000 = 6,600
    includeHallmarking: false,
  });
  assert(
    'Making Charge 10% Addition',
    'Gold Engine',
    goldMaking.makingChargesTotal === 6600,
    goldMaking.makingChargesTotal,
    6600,
    'Making charges should correctly evaluate to 10% of raw gold cost'
  );

  // -------------------------------------------------------------
  // 4. Home Loan Prepayment Engine Tests
  // -------------------------------------------------------------
  // Test A: Standard Monthly EMI calculation
  // Principal 1,000,000, 8.5% interest, 10 years (120 months)
  const baseEmi = calculateMonthlyEMI(1000000, 8.5, 120);
  assert(
    'Standard Amortization EMI Calculation',
    'Loan Engine',
    baseEmi >= 12390 && baseEmi <= 12410,
    baseEmi,
    12399,
    'EMI for ₹10L @ 8.5% over 10 years should be ~₹12,399'
  );

  // Test B: Prepayment 1 Extra EMI reduces interest and tenure
  const loanResult = calculateLoanPrepayment({
    principal: 5000000,
    annualInterestRate: 8.5,
    tenureYears: 20,
    prepaymentStrategy: 'extra_emi_yearly',
  });
  assert(
    'Extra EMI Reduces Loan Tenure by 3+ Years',
    'Loan Engine',
    loanResult.tenureSavedYears >= 3 && loanResult.interestSaved > 800000,
    { yearsSaved: loanResult.tenureSavedYears, interestSaved: loanResult.interestSaved },
    'Tenure saved >= 3 years and Interest saved > ₹8 Lakhs',
    'Paying 1 extra EMI annually must yield major tenure & interest reduction'
  );

  // -------------------------------------------------------------
  // 5. Commute Fuel Spend Engine Tests
  // -------------------------------------------------------------
  const fuel = calculateFuelSpend({
    dailyDistanceKm: 40,
    fuelType: 'petrol',
    fuelPricePerUnit: 100,
    mileage: 20,
    workingDaysPerMonth: 26,
  });
  // 40km / 20km/L = 2 Litres/day * ₹100 = ₹200/day
  // Monthly = 26 days * ₹200 = ₹5,200/mo
  assert(
    'Commute Daily & 26-Day Monthly Cost',
    'Fuel Engine',
    fuel.dailyCost === 200 && fuel.monthlyCost === 5200,
    { daily: fuel.dailyCost, monthly: fuel.monthlyCost },
    { daily: 200, monthly: 5200 },
    'Fuel spend calculation must accurately compute daily and 26-day monthly amounts'
  );

  // -------------------------------------------------------------
  // 6. PM Surya Ghar Solar Subsidy Tests
  // -------------------------------------------------------------
  assert(
    'Solar Subsidy 1 kW = ₹30,000',
    'Solar Engine',
    calculateCentralSubsidy(1) === 30000,
    calculateCentralSubsidy(1),
    30000,
    '1 kW system must receive ₹30,000 central subsidy'
  );

  assert(
    'Solar Subsidy 2 kW = ₹60,000',
    'Solar Engine',
    calculateCentralSubsidy(2) === 60000,
    calculateCentralSubsidy(2),
    60000,
    '2 kW system must receive ₹60,000 central subsidy'
  );

  assert(
    'Solar Subsidy 3 kW and above capped at ₹78,000',
    'Solar Engine',
    calculateCentralSubsidy(3) === 78000 && calculateCentralSubsidy(5) === 78000,
    calculateCentralSubsidy(5),
    78000,
    '3 kW+ residential installations must cap at ₹78,000 central assistance'
  );

  // -------------------------------------------------------------
  // 7. SEO Canonical URL Generation Tests
  // -------------------------------------------------------------
  assert(
    'Canonical URL for Home Page',
    'SEO Engine',
    buildCanonicalUrl('/') === 'https://authorizetech.in/bharatcalc',
    buildCanonicalUrl('/'),
    'https://authorizetech.in/bharatcalc',
    'Root path must resolve to base production URL without trailing slash'
  );

  assert(
    'Canonical URL for Subpage',
    'SEO Engine',
    buildCanonicalUrl('/calculators/in-hand-salary') === 'https://authorizetech.in/bharatcalc/calculators/in-hand-salary',
    buildCanonicalUrl('/calculators/in-hand-salary'),
    'https://authorizetech.in/bharatcalc/calculators/in-hand-salary',
    'Subpage path must resolve with /bharatcalc base'
  );

  assert(
    'Canonical URL Strips Accidental Trailing Slash',
    'SEO Engine',
    buildCanonicalUrl('/business-calculators/') === 'https://authorizetech.in/bharatcalc/business-calculators',
    buildCanonicalUrl('/business-calculators/'),
    'https://authorizetech.in/bharatcalc/business-calculators',
    'Trailing slash must be stripped for consistency'
  );

  assert(
    'Canonical URL Prevents Duplicate /bharatcalc prefix',
    'SEO Engine',
    buildCanonicalUrl('/bharatcalc/explainers') === 'https://authorizetech.in/bharatcalc/explainers',
    buildCanonicalUrl('/bharatcalc/explainers'),
    'https://authorizetech.in/bharatcalc/explainers',
    'Duplicate /bharatcalc prefix must be stripped cleanly'
  );

  // -------------------------------------------------------------
  // 8. Inventory Reorder Calculator Tests
  // -------------------------------------------------------------
  const inv = calculateInventoryReorder({
    averageDailyDemand: 40,
    leadTimeDays: 10,
    safetyStock: 50,
  });
  // Lead time demand: 40 * 10 = 400. ROP: 400 + 50 = 450.
  assert(
    'Inventory Reorder Point Calculation',
    'Inventory Engine',
    inv.leadTimeDemand === 400 && inv.reorderPoint === 450,
    inv.reorderPoint,
    450,
    'ROP must equal (Demand × Lead Time) + Safety Stock'
  );

  // -------------------------------------------------------------
  // 9. Working Capital Calculator Tests
  // -------------------------------------------------------------
  const wc = calculateWorkingCapital({
    cashAndBank: 200000,
    accountsReceivable: 300000,
    inventory: 500000,
    accountsPayable: 400000,
    shortTermDebt: 100000,
    accruedExpenses: 0,
  });
  // Current Assets = 10L, Current Liabilities = 5L. NWC = 5L, Ratio = 2.0.
  assert(
    'Working Capital & Current Ratio Calculation',
    'Working Capital Engine',
    wc.netWorkingCapital === 500000 && wc.currentRatio === 2.0,
    { nwc: wc.netWorkingCapital, ratio: wc.currentRatio },
    { nwc: 500000, ratio: 2.0 },
    'Net working capital must equal Assets - Liabilities, and ratio = Assets / Liabilities'
  );

  // -------------------------------------------------------------
  // 10. Electricity Bill Calculator Tests
  // -------------------------------------------------------------
  const elec = calculateElectricityBill({
    consumptionKWh: 150,
    fixedCharges: 50,
    dutyPercentage: 5,
    fppcaRatePerUnit: 0.20,
    tariffSlabs: [
      { min: 0, max: 100, rate: 3.0 },
      { min: 100, max: 200, rate: 5.0 },
    ],
  });
  // 100 * 3 = 300; 50 * 5 = 250. Energy = 550.
  // Fixed = 50. FPPCA = 150 * 0.2 = 30. Subtotal = 630.
  // Duty = 5% of 630 = 31.5. Total = 661.5 -> 662.
  assert(
    'Electricity Telescopic Slab Math',
    'Electricity Engine',
    elec.totalEnergyCharges === 550 && elec.totalEstimatedBill === 662,
    { energy: elec.totalEnergyCharges, total: elec.totalEstimatedBill },
    { energy: 550, total: 662 },
    'Telescopic slab charging must correctly compute slab progression and fixed/duty charges'
  );

  // -------------------------------------------------------------
  // 11. SIP Investment Calculator Tests
  // -------------------------------------------------------------
  const sip = calculateSipGrowth({
    monthlyInvestment: 10000,
    annualReturnRate: 12,
    tenureYears: 1, // 1 year = 12 months
  });
  // Total invested = 10,000 * 12 = 120,000.
  // At 12% p.a. (1% monthly), 10,000 monthly for 12 months annuity-due ~ 128,093.
  assert(
    'SIP Growth Compounding Math',
    'SIP Engine',
    sip.totalInvested === 120000 && sip.maturityValue > 125000,
    sip.maturityValue,
    'Maturity > ₹1,25,000',
    'SIP 12 months at 12% p.a. must produce compounding returns above invested principal'
  );

  // -------------------------------------------------------------
  // 12. FD & RD Calculator Tests
  // -------------------------------------------------------------
  const fd = calculateDeposit({
    depositType: 'fixed',
    amount: 100000,
    interestRate: 8.0,
    tenureMonths: 12,
    compoundingFrequency: 'quarterly',
  });
  // P = 100,000, r = 8%, quarterly (2% per quarter), 4 quarters -> 100000 * (1.02)^4 = 108,243.21 -> 108,243.
  assert(
    'Fixed Deposit Quarterly Compounding',
    'Deposit Engine',
    fd.maturityAmount === 108243,
    fd.maturityAmount,
    108243,
    'FD 100k at 8% quarterly for 1 year must mature to exactly ₹1,08,243'
  );

  // -------------------------------------------------------------
  // 13. Inflation Calculator Tests
  // -------------------------------------------------------------
  const inf = calculateInflation({
    amount: 100000,
    annualInflationRate: 10,
    tenureYears: 2,
    mode: 'future_cost',
  });
  // 100,000 * (1.1)^2 = 121,000.
  assert(
    'Inflation Future Cost Compounding',
    'Inflation Engine',
    inf.projectedFutureCost === 121000 && inf.absoluteCostIncrease === 21000,
    inf.projectedFutureCost,
    121000,
    '100k at 10% annual inflation over 2 years must compound to ₹1,21,000'
  );

  return results;
}
