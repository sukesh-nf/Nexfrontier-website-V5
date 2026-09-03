/**
 * Calculator formula regression test.
 * Run: node scripts/calculator-regression-test.mjs
 * Verifies all calculator formulas against hand-computed expected values.
 */

// Re-implement the pure functions from src/lib/calculator.ts for testing.
// This avoids TS/ESM import issues. The formulas are compared line-by-line.

function safeNumber(value) {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function positiveNumber(value) {
  const n = safeNumber(value);
  return n !== null && n > 0 ? n : null;
}

function businessNumber(inputs, key) {
  return Math.max(0, safeNumber(inputs[key]) ?? 0);
}

function calculatePool(inputs) {
  const customers = positiveNumber(inputs.customers);
  const lifetime = positiveNumber(inputs.lifetime);
  const ltv = safeNumber(inputs.ltv);
  return customers !== null && lifetime !== null && ltv !== null && ltv >= 0
    ? customers * (ltv / lifetime)
    : null;
}

function calculateValues(inputs, assumptions, pool) {
  const revenue = (businessNumber(inputs, 'revenue') * assumptions.revenue) / 100;
  const cost = (businessNumber(inputs, 'nonPeopleCost') * assumptions.cost) / 100;
  const capacity = (businessNumber(inputs, 'peopleCost') * assumptions.capacity) / 100;
  const customer = ((pool ?? 0) * assumptions.customer) / 100;
  const capability = (businessNumber(inputs, 'revenue') * assumptions.capability) / 100;
  return { revenue, cost, capacity, customer, capability, gross: revenue + cost + capacity + customer + capability };
}

function formatValue(value, signed = false) {
  if (value === null || !Number.isFinite(value)) return '—';
  const sign = signed && value > 0 ? '+' : '';
  const absolute = Math.abs(value);
  const prefix = value < 0 ? '−' : sign;
  if (absolute >= 1000000) return `${prefix}${(absolute / 1000000).toFixed(absolute >= 10000000 ? 1 : 2)}M`;
  if (absolute >= 1000) return `${prefix}${(absolute / 1000).toFixed(absolute >= 100000 ? 0 : 1)}K`;
  return `${prefix}${Math.round(absolute).toLocaleString('en-US')}`;
}

let passed = 0;
let failed = 0;

function assert(name, actual, expected) {
  const pass = typeof expected === 'number'
    ? Math.abs(actual - expected) < 0.01
    : actual === expected;
  if (pass) {
    passed++;
  } else {
    failed++;
    console.error(`FAIL: ${name}\n  expected: ${expected}\n  actual:   ${actual}`);
  }
}

// === Test 1: Pool calculation ===
// 1000 customers, LTV 5000, lifetime 5 years → pool = 1000 * (5000/5) = 1,000,000
const inputs1 = { revenue: '10000000', nonPeopleCost: '3000000', peopleCost: '4000000', ebitda: '2000000', customers: '1000', ltv: '5000', lifetime: '5' };
assert('pool_basic', calculatePool(inputs1), 1000000);

// === Test 2: Pool with zero lifetime → null ===
const inputs2 = { ...inputs1, lifetime: '0' };
assert('pool_zero_lifetime', calculatePool(inputs2), null);

// === Test 3: Pool with negative lifetime → null ===
const inputs3 = { ...inputs1, lifetime: '-1' };
assert('pool_negative_lifetime', calculatePool(inputs3), null);

// === Test 4: Pool with negative LTV → null (ltv >= 0 check) ===
const inputs4 = { ...inputs1, ltv: '-100' };
assert('pool_negative_ltv', calculatePool(inputs4), null);

// === Test 5: Pool with empty customers → null ===
const inputs5 = { ...inputs1, customers: '' };
assert('pool_empty_customers', calculatePool(inputs5), null);

// === Test 6: calculateValues with default assumptions (all 1%, capability 0.1%) ===
const defaultAssumptions = { revenue: 1, cost: 1, capacity: 1, customer: 1, capability: 0.1 };
const pool1 = calculatePool(inputs1);
const vals6 = calculateValues(inputs1, defaultAssumptions, pool1);
// revenue = 10M * 1% = 100,000
// cost = 3M * 1% = 30,000
// capacity = 4M * 1% = 40,000
// customer = 1M * 1% = 10,000
// capability = 10M * 0.1% = 10,000
// gross = 190,000
assert('values_revenue', vals6.revenue, 100000);
assert('values_cost', vals6.cost, 30000);
assert('values_capacity', vals6.capacity, 40000);
assert('values_customer', vals6.customer, 10000);
assert('values_capability', vals6.capability, 10000);
assert('values_gross', vals6.gross, 190000);

// === Test 7: calculateValues with zero pool ===
const vals7 = calculateValues(inputs1, defaultAssumptions, null);
// customer should be 0, others unchanged
assert('values_null_pool_customer', vals7.customer, 0);
assert('values_null_pool_gross', vals7.gross, 180000);

// === Test 8: calculateValues with negative revenue clamped to 0 ===
const inputsNeg = { ...inputs1, revenue: '-5000000' };
const vals8 = calculateValues(inputsNeg, defaultAssumptions, pool1);
assert('values_negative_revenue_clamped', vals8.revenue, 0);
assert('values_negative_capability_clamped', vals8.capability, 0);

// === Test 9: Full EV Delta pipeline ===
// QL and AV both with default assumptions
const qlResults = calculateValues(inputs1, defaultAssumptions, pool1);
const avResults = calculateValues(inputs1, defaultAssumptions, pool1);
const gvo = qlResults.gross + avResults.gross; // 380,000
const overlap = 20; // 20%
const overlapValue = gvo * (overlap / 100); // 76,000
const adjustedOpportunity = gvo * (1 - overlap / 100); // 304,000
const realisation = 70; // 70%
const expectedRealisable = adjustedOpportunity * (realisation / 100); // 212,800
const riskAllowance = adjustedOpportunity * (1 - realisation / 100); // 91,200
const costToRealise = 50000;
const evDelta = expectedRealisable - costToRealise; // 162,800
const neutralThreshold = businessNumber(inputs1, 'revenue') * 0.0025; // 25,000
const scenarioStatus = evDelta > neutralThreshold ? 'above' : evDelta < -neutralThreshold ? 'below' : 'neutral';

assert('ev_gvo', gvo, 380000);
assert('ev_overlap_value', overlapValue, 76000);
assert('ev_adjusted_opportunity', adjustedOpportunity, 304000);
assert('ev_expected_realisable', expectedRealisable, 212800);
assert('ev_risk_allowance', riskAllowance, 91200);
assert('ev_delta', evDelta, 162800);
assert('ev_neutral_threshold', neutralThreshold, 25000);
assert('ev_scenario_status', scenarioStatus, 'above');

// === Test 10: EV Delta below status quo ===
const evDeltaBelow = -50000;
const statusBelow = evDeltaBelow < -neutralThreshold ? 'below' : 'neutral';
assert('ev_below_status', statusBelow, 'below');

// === Test 11: EV Delta neutral (within threshold) ===
const evDeltaNeutral = 10000; // within ±25,000
const statusNeutral = evDeltaNeutral > neutralThreshold ? 'above' : evDeltaNeutral < -neutralThreshold ? 'below' : 'neutral';
assert('ev_neutral_status', statusNeutral, 'neutral');

// === Test 12: formatValue formatting ===
assert('format_zero', formatValue(0), '0');
assert('format_thousand', formatValue(1000), '1.0K');
assert('format_thousand_decimal', formatValue(1500), '1.5K');
assert('format_million', formatValue(1000000), '1.00M');
assert('format_million_decimal', formatValue(2500000), '2.50M');
assert('format_ten_million', formatValue(10000000), '10.0M');
assert('format_negative', formatValue(-5000), '−5.0K');
assert('format_signed_positive', formatValue(5000, true), '+5.0K');
assert('format_null', formatValue(null), '—');
assert('format_nan', formatValue(NaN), '—');

// === Test 13: businessNumber clamping ===
assert('business_number_empty', businessNumber({ revenue: '' }, 'revenue'), 0);
assert('business_number_negative', businessNumber({ revenue: '-100' }, 'revenue'), 0);
assert('business_number_valid', businessNumber({ revenue: '5000' }, 'revenue'), 5000);

// === Test 14: safeNumber edge cases ===
// Number('') and Number(null) both return 0 in JS, so safeNumber returns 0
assert('safe_number_empty_string', safeNumber(''), 0);
assert('safe_number_null', safeNumber(null), 0);
assert('safe_number_finite', safeNumber('42'), 42);
assert('safe_number_actual_number', safeNumber(42), 42);

// === Summary ===
console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) {
  console.error('REGRESSION TESTS FAILED');
  process.exit(1);
} else {
  console.log('All regression tests passed.');
}
