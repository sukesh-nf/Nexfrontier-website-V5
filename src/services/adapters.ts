export interface FormResult {
  ok: boolean;
  message: string;
}

export interface QuietLossInputs {
  monthlyEnquiries: number;
  averageValue: number;
  responseRate: number;
}

/**
 * Stub adapters. These do NOT connect to a real backend.
 * Per Blueprint section 35: do not imply backend success if none exists.
 * Each stub returns a clearly-marked development/preview state.
 * Production launch requires these to be genuinely connected or the
 * corresponding UI action disabled/reframed.
 */

export async function submitMarketEnquiry(_payload: Record<string, string>): Promise<FormResult> {
  return { ok: false, message: 'Not connected. This form is in preview state.' };
}

export async function submitFoundationCustomerRequest(_payload: Record<string, string>): Promise<FormResult> {
  return { ok: false, message: 'Not connected. This form is in preview state.' };
}

export async function subscribeToReadingTheShift(_email: string): Promise<FormResult> {
  return { ok: false, message: 'Not connected. This form is in preview state.' };
}

export async function calculateQuietLoss(_inputs: QuietLossInputs): Promise<FormResult> {
  return { ok: false, message: 'Not connected. This form is in preview state.' };
}

/**
 * Enterprise Value Calculator report adapter.
 * Per Blueprint section 34: keep isolated so NM/backend can connect later.
 * Per Blueprint section 35: do not imply delivery when no mechanism exists.
 */
export async function sendEnterpriseValueReport(_payload: Record<string, unknown>): Promise<FormResult> {
  return { ok: false, message: 'Not connected. The report delivery mechanism is in preview state.' };
}

export async function requestQLReport(_payload: Record<string, string>): Promise<FormResult> {
  return { ok: false, message: 'Not connected. This form is in preview state.' };
}

export async function requestInvestorAccess(_payload: Record<string, string>): Promise<FormResult> {
  return { ok: false, message: 'Not connected. This form is in preview state.' };
}

export async function searchKnowledgeHub(query: string): Promise<FormResult> {
  return { ok: false, message: 'Not connected. This form is in preview state.' };
}

export function trackWebsiteEvent(_name: string, _properties?: Record<string, string>): void {
  return undefined;
}
