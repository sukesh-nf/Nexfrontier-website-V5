// verify_jwt: true (platform-level JWT gate enabled)
import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const ALLOWED_ORIGINS = new Set(['https://nexfrontierlogic.nz','https://www.nexfrontierlogic.nz']);
function cors(req: Request) {
  const origin = req.headers.get('Origin') || '';
  const allowed = ALLOWED_ORIGINS.has(origin) ? origin : 'https://nexfrontierlogic.nz';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
    'Vary': 'Origin',
  };
}
async function sha256(msg: string): Promise<string> {
  const data = new TextEncoder().encode(msg);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}
const ALLOWED_ENQUIRY_TYPES = ['foundation-customer','investor','partnership','market-customer','other'];
const ALLOWED_REVENUE_RANGES = ['Under $2m','$2m – $5m','$5m – $20m','$20m – $100m','$100m+','Prefer not to say'];
const MAX_FIELD_LENGTH: Record<string, number> = { name:200,email:320,organisation:300,role:200,enquiryType:50,revenueRange:50,message:5000,website:2000 };
function sanitize(value: string, maxLength: number) { return value.slice(0, maxLength).trim(); }
function isValidEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320; }

Deno.serve(async (req: Request) => {
  const headers = cors(req);
  const origin = req.headers.get('Origin');
  if (origin && !ALLOWED_ORIGINS.has(origin)) return new Response(JSON.stringify({ok:false,message:'Origin not allowed.'}), {status:403,headers:{...headers,'Content-Type':'application/json'}});
  if (req.method === 'OPTIONS') return new Response(null,{status:200,headers});
  if (req.method !== 'POST') return new Response(JSON.stringify({ok:false,message:'Method not allowed.'}),{status:405,headers:{...headers,'Content-Type':'application/json'}});
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const body = await req.json();
    const name = sanitize(String(body.name ?? ''),MAX_FIELD_LENGTH.name);
    const email = sanitize(String(body.email ?? ''),MAX_FIELD_LENGTH.email).toLowerCase();
    const organisation = sanitize(String(body.organisation ?? ''),MAX_FIELD_LENGTH.organisation);
    const role = sanitize(String(body.role ?? ''),MAX_FIELD_LENGTH.role);
    const enquiryType = sanitize(String(body.enquiryType ?? ''),MAX_FIELD_LENGTH.enquiryType);
    const revenueRange = sanitize(String(body.revenueRange ?? ''),MAX_FIELD_LENGTH.revenueRange);
    const message = sanitize(String(body.message ?? ''),MAX_FIELD_LENGTH.message);
    const website = sanitize(String(body.website ?? ''),MAX_FIELD_LENGTH.website);
    const consent = body.consent === true;
    if (!name || !email || !enquiryType) return new Response(JSON.stringify({ok:false,message:'Please complete the required fields.'}),{status:422,headers:{...headers,'Content-Type':'application/json'}});
    if (!isValidEmail(email)) return new Response(JSON.stringify({ok:false,message:'Please provide a valid email address.'}),{status:422,headers:{...headers,'Content-Type':'application/json'}});
    if (!ALLOWED_ENQUIRY_TYPES.includes(enquiryType)) return new Response(JSON.stringify({ok:false,message:'Invalid enquiry type.'}),{status:422,headers:{...headers,'Content-Type':'application/json'}});
    if (enquiryType === 'foundation-customer' && !organisation) return new Response(JSON.stringify({ok:false,message:'Organisation is required for Foundation Customer enquiries.'}),{status:422,headers:{...headers,'Content-Type':'application/json'}});
    if (revenueRange && !ALLOWED_REVENUE_RANGES.includes(revenueRange)) return new Response(JSON.stringify({ok:false,message:'Invalid revenue range.'}),{status:422,headers:{...headers,'Content-Type':'application/json'}});
    if (!consent) return new Response(JSON.stringify({ok:false,message:'Please confirm you understand how NexFrontier will use your information.'}),{status:422,headers:{...headers,'Content-Type':'application/json'}});

    const ip = (req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown').split(',')[0].trim();
    const fingerprintHash = await sha256(`${email}|${ip}`);
    const windowStart = new Date(Date.now() - 60*60*1000).toISOString();
    const { count } = await supabase.from('public_form_rate_limit').select('*',{count:'exact',head:true}).eq('form_name','market-enquiry').eq('fingerprint_hash',fingerprintHash).gte('created_at',windowStart);
    if ((count || 0) >= 5) return new Response(JSON.stringify({ok:false,message:'Too many submissions. Please try again later.'}),{status:429,headers:{...headers,'Content-Type':'application/json'}});

    const { data, error } = await supabase.from('market_enquiries').insert({ name,email,organisation:organisation||null,role:role||null,enquiry_type:enquiryType,revenue_range:revenueRange||null,message:message||null,website:website||null,consent,status:'pending' }).select('id').single();
    if (error) return new Response(JSON.stringify({ok:false,message:'Unable to submit enquiry at this time.'}),{status:500,headers:{...headers,'Content-Type':'application/json'}});
    await supabase.from('public_form_rate_limit').insert({form_name:'market-enquiry',fingerprint_hash:fingerprintHash});
    return new Response(JSON.stringify({ok:true,message:'Your enquiry has been received. A member of the NexFrontier team will be in touch.',enquiryId:data.id}),{status:200,headers:{...headers,'Content-Type':'application/json'}});
  } catch {
    return new Response(JSON.stringify({ok:false,message:'An unexpected error occurred.'}),{status:500,headers:{...headers,'Content-Type':'application/json'}});
  }
});
