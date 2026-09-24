/**
 * Comprehensive Unit Test Suite & Validation Engine for BharatCalc
 * Tests all statutory calculation logic, rounding precision, and edge-case boundaries.
 */

import { calculateInHandSalary } from '../salary';
import { calculateGoldInvoice } from '../gold';
import { calculateLoanPrepayment, calculateMonthlyEMI } from '../loan';
import { calculateFuelSpend } from '../fuel';
import { calculateSolarSubsidy, calculateCentralSubsidy } from '../solar';
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
  // 2. Salary Engine Tests (FY 2025-26 New Tax Regime)
  // -------------------------------------------------------------
  // Test A: Standard Deduction of ₹75,000
  const sal7L = calculateInHandSalary({ annualCTC: 750000, epfType: 'none', professionalTaxAnnual: 0 });
  assert(
    'Standard Deduction ₹75,000 Applied',
    'Salary Engine',
    sal7L.standardDeduction === 75000,
    sal7L.standardDeduction,
    75000,
    'Standard deduction must be exactly ₹75,000 under FY 2025-26 New Regime'
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

  return results;
}
