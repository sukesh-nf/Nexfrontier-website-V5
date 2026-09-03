// verify_jwt: true (platform-level JWT gate enabled)
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const ALLOWED_REVENUE_BANDS = [
  'under_10m',
  '10m_50m',
  '50m_250m',
  '250m_1b',
  'over_1b',
  'prefer_not_to_say',
];

const ALLOWED_ROLE_CATEGORIES = [
  'ceo_md',
  'founder_owner',
  'board',
  'finance',
  'operations',
  'strategy',
  'technology',
  'marketing_customer_commercial',
  'gm_business_unit',
  'transformation_innovation',
  'investor_portfolio',
  'other_senior_leader',
  'advisor_consultant',
  'other',
];

const ALLOWED_SOURCES = [
  'email',
  'linkedin',
  'website_prompt',
  'the_shift',
  'intelligence',
  'about',
  'direct',
  'footer',
  'market_signals',
  'enterprise_value',
  'other',
];

const SURVEY_VERSION = 'v1';

const FORBIDDEN_MIDPOINT = 3;

function isForcedChoice(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 5 && value !== FORBIDDEN_MIDPOINT;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const body = await req.json();

    const q1 = body.q1_see;
    const q2 = body.q2_understand;
    const q3 = body.q3_navigate;
    const revenueBand = String(body.revenue_band ?? '');
    const roleCategory = String(body.role_category ?? '');
    const source = String(body.source ?? 'direct');

    // Validate all required fields (forced-choice: 3 is not accepted)
    if (!isForcedChoice(q1) || !isForcedChoice(q2) || !isForcedChoice(q3)) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Each question requires a response of 1, 2, 4, or 5.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (!ALLOWED_REVENUE_BANDS.includes(revenueBand)) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Please select a revenue band.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (!ALLOWED_ROLE_CATEGORIES.includes(roleCategory)) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Please select your role.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    let normalizedSource = source;
    if (!ALLOWED_SOURCES.includes(normalizedSource)) {
      normalizedSource = 'other';
    }

    const { error } = await supabase
      .from('leadership_pulse_responses')
      .insert({
        q1_see: q1,
        q2_understand: q2,
        q3_navigate: q3,
        revenue_band: revenueBand,
        role_category: roleCategory,
        survey_version: SURVEY_VERSION,
        source: normalizedSource,
      });

    if (error) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Unable to submit your response at this time.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ ok: true, message: 'Your perspective has been recorded.' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, message: 'An unexpected error occurred.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
