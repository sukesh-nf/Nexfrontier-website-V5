const ALLOWED_ORIGINS = new Set(['https://nexfrontierlogic.nz','https://www.nexfrontierlogic.nz']);
function headers(req: Request) {
  const origin = req.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://nexfrontierlogic.nz',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'Vary': 'Origin',
  };
}
Deno.serve(async (req: Request) => {
  const origin = req.headers.get('Origin');
  if (origin && !ALLOWED_ORIGINS.has(origin)) return new Response(JSON.stringify({ok:false,code:'ORIGIN_NOT_ALLOWED',message:'Origin not allowed.'}),{status:403,headers:headers(req)});
  if (req.method === 'OPTIONS') return new Response(null,{status:200,headers:headers(req)});
  return new Response(JSON.stringify({ok:false,code:'ADMIN_BOOTSTRAP_RETIRED',message:'Initial administrator bootstrap is permanently retired. Use the authenticated Admin Console for administrator management.'}),{status:410,headers:headers(req)});
});
