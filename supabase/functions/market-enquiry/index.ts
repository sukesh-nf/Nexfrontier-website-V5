// verify_jwt: true (platform-level JWT gate enabled)
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

const ALLOWED_ENQUIRY_TYPES = [
  'foundation-customer',
  'investor',
  'partnership',
  'market-customer',
  'other',
];

const ALLOWED_REVENUE_RANGES = [
  'Under $2m',
  '$2m – $5m',
  '$5m – $20m',
  '$20m – $100m',
  '$100m+',
  'Prefer not to say',
];

const MAX_FIELD_LENGTH: Record<string, number> = {
  name: 200,
  email: 320,
  organisation: 300,
  role: 200,
  enquiryType: 50,
  revenueRange: 50,
  message: 5000,
  website: 2000,
};

function sanitize(value: string, maxLength: number): string {
  return value.slice(0, maxLength).trim();
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320;
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

    const name = sanitize(String(body.name ?? ''), MAX_FIELD_LENGTH.name);
    const email = sanitize(String(body.email ?? ''), MAX_FIELD_LENGTH.email);
    const organisation = sanitize(String(body.organisation ?? ''), MAX_FIELD_LENGTH.organisation);
    const role = sanitize(String(body.role ?? ''), MAX_FIELD_LENGTH.role);
    const enquiryType = sanitize(String(body.enquiryType ?? ''), MAX_FIELD_LENGTH.enquiryType);
    const revenueRange = sanitize(String(body.revenueRange ?? ''), MAX_FIELD_LENGTH.revenueRange);
    const message = sanitize(String(body.message ?? ''), MAX_FIELD_LENGTH.message);
    const website = sanitize(String(body.website ?? ''), MAX_FIELD_LENGTH.website);
    const consent = body.consent === true;

    if (!name || !email || !enquiryType) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Please complete the required fields.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Please provide a valid email address.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (!ALLOWED_ENQUIRY_TYPES.includes(enquiryType)) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Invalid enquiry type.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (enquiryType === 'foundation-customer' && !organisation) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Organisation is required for Foundation Customer enquiries.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (revenueRange && !ALLOWED_REVENUE_RANGES.includes(revenueRange)) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Invalid revenue range.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (!consent) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Please confirm you understand how NexFrontier will use your information.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { data, error } = await supabase
      .from('market_enquiries')
      .insert({
        name,
        email,
        organisation: organisation || null,
        role: role || null,
        enquiry_type: enquiryType,
        revenue_range: revenueRange || null,
        message: message || null,
        website: website || null,
        consent,
        status: 'pending',
      })
      .select('id')
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ ok: false, message: 'Unable to submit enquiry at this time.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Your enquiry has been received. A member of the NexFrontier team will be in touch.',
        enquiryId: data.id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, message: 'An unexpected error occurred.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
