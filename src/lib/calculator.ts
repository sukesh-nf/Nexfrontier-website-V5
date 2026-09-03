/**
 * NexFrontier v4 Enterprise Value Calculator Logic
 *
 * Extracted from v3 App.tsx and preserved unchanged.
 * Per Blueprint section 79: preserve calculator logic for later migration.
 * Per Blueprint section 80.1: do not alter calculator formulas.
 *
 * Provenance: REUSED from v3 App.tsx (lines 155-178).
 * This module contains the pure calculation functions only.
 * UI components will be built in later Blueprint stages.
 */

export type BusinessInputs = {
  revenue: string;
  nonPeopleCost: string;
  peopleCost: string;
  ebitda: string;
  customers: string;
  ltv: string;
  lifetime: string;
};

export type Assumptions = {
  revenue: number;
  cost: number;
  capacity: number;
  customer: number;
  capability: number;
};

export type ValueResults = {
  revenue: number;
  cost: number;
  capacity: number;
  customer: number;
  capability: number;
  gross: number;
};

export const emptyBusinessInputs: BusinessInputs = {
  revenue: '',
  nonPeopleCost: '',
  peopleCost: '',
  ebitda: '',
  customers: '',
  ltv: '',
  lifetime: '',
};

export const defaultAssumptions: Assumptions = {
  revenue: 1,
  cost: 1,
  capacity: 1,
  customer: 1,
  capability: 0.1,
};

export function safeNumber(value: string | number): number | null {
  const number = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

export function positiveNumber(value: string): number | null {
  const number = safeNumber(value);
  return number !== null && number > 0 ? number : null;
}

export function formatValue(value: number | null, signed = false): string {
  if (value === null || !Number.isFinite(value)) return '—';
  const sign = signed && value > 0 ? '+' : '';
  const absolute = Math.abs(value);
  const prefix = value < 0 ? '−' : sign;
  if (absolute >= 1000000) return `${prefix}${(absolute / 1000000).toFixed(absolute >= 10000000 ? 1 : 2)}M`;
  if (absolute >= 1000) return `${prefix}${(absolute / 1000).toFixed(absolute >= 100000 ? 0 : 1)}K`;
  return `${prefix}${Math.round(absolute).toLocaleString('en-US')}`;
}

export function formatPercent(value: number): string {
  return `${Number.isInteger(value) ? value : value.toFixed(2).replace(/0$/, '')}%`;
}

export function formatPP(value: number): string {
  return `${value.toFixed(1)} pp`;
}

export function businessNumber(inputs: BusinessInputs, key: keyof BusinessInputs): number {
  return Math.max(0, safeNumber(inputs[key]) ?? 0);
}

export function calculatePool(inputs: BusinessInputs): number | null {
  const customers = positiveNumber(inputs.customers);
  const lifetime = positiveNumber(inputs.lifetime);
  const ltv = safeNumber(inputs.ltv);
  return customers !== null && lifetime !== null && ltv !== null && ltv >= 0
    ? customers * (ltv / lifetime)
    : null;
}

export function calculateValues(
  inputs: BusinessInputs,
  assumptions: Assumptions,
  pool: number | null,
): ValueResults {
  const revenue = (businessNumber(inputs, 'revenue') * assumptions.revenue) / 100;
  const cost = (businessNumber(inputs, 'nonPeopleCost') * assumptions.cost) / 100;
  const capacity = (businessNumber(inputs, 'peopleCost') * assumptions.capacity) / 100;
  const customer = ((pool ?? 0) * assumptions.customer) / 100;
  const capability = (businessNumber(inputs, 'revenue') * assumptions.capability) / 100;
  return { revenue, cost, capacity, customer, capability, gross: revenue + cost + capacity + customer + capability };
}

/**
 * The canonical five ORBIT Enterprise Value dimensions.
 * Per Blueprint section 8: these are the only canonical five-value dimensions in v4.
 */
export const orbitDimensions = [
  'Revenue',
  'Cost',
  'Capacity',
  'Customer Value',
  'Enterprise Capability',
] as const;
