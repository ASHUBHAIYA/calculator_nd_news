import { runAllUnitTests } from '../lib/calculators/__tests__/calculators.test';

console.log('Running BharatCalc Test Suite...');
const results = runAllUnitTests();
let passedCount = 0;
let failedCount = 0;

for (const r of results) {
  if (r.passed) {
    passedCount++;
    console.log(`  [PASS] [${r.category}] ${r.name}`);
  } else {
    failedCount++;
    console.error(`  [FAIL] [${r.category}] ${r.name}`);
    console.error(`         Expected:`, r.expected);
    console.error(`         Actual:  `, r.actual);
    if (r.message) console.error(`         Note:    `, r.message);
  }
}

console.log(`\nResults: ${passedCount} passed, ${failedCount} failed of ${results.length} tests.`);
if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('All tests passed successfully!');
}
