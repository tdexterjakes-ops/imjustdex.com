// Netlify Function: /api/subscribe → Mailchimp
// Replaces the edge-function + proxy-redirect pair that was 500ing on POST.
//
// Env vars required (set in Netlify UI):
//   MAILCHIMP_API_KEY       (secret)
//   MAILCHIMP_AUDIENCE_ID   e.g. 216fb11473
//   MAILCHIMP_SERVER_PREFIX e.g. us20

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60000;
const HONEYPOT_FIELD = 'b_41b4a69d61d7e6d50724373f0_216fb11473';

const hits = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const bucket = hits.get(ip) || [];
  const recent = bucket.filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length <= RATE_LIMIT;
}

function parseBody(event) {
  const ct = (event.headers['content-type'] || event.headers['Content-Type'] || '').toLowerCase();
  const raw = event.body || '';
  if (ct.includes('application/json')) {
    try { return JSON.parse(raw); } catch { return {}; }
  }
  const params = new URLSearchParams(raw);
  const out = {};
  for (const [k, v] of params) out[k] = v;
  return out;
}

function isEmail(s) {
  return typeof s === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'method_not_allowed' });
  }

  const ip =
    event.headers['x-nf-client-connection-ip'] ||
    (event.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    'unknown';

  if (!rateLimit(ip)) {
    return json(429, { ok: false, error: 'rate_limited' });
  }

  const body = parseBody(event);

  if (body[HONEYPOT_FIELD]) {
    return json(200, { ok: true, message: 'subscribed' });
  }

  const email = (body.EMAIL || body.email || '').trim();
  if (!isEmail(email)) {
    return json(400, { ok: false, error: 'invalid_email' });
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const server = process.env.MAILCHIMP_SERVER_PREFIX;

  if (!apiKey || !audienceId || !server) {
    return json(500, { ok: false, error: 'server_not_configured' });
  }

  const url = `https://${server}.api.mailchimp.com/3.0/lists/${audienceId}/members`;
  const auth = 'Basic ' + Buffer.from(`anystring:${apiKey}`).toString('base64');

  const payload = {
    email_address: email,
    status: 'subscribed',
    tags: ['phase-0'],
    merge_fields: { SOURCE: 'phase0-landing' },
  };

  let res, data;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      body: JSON.stringify(payload),
    });
    data = await res.json().catch(() => ({}));
  } catch (err) {
    return json(502, { ok: false, error: 'upstream_unreachable' });
  }

  if (res.ok) {
    return json(200, { ok: true, message: 'subscribed' });
  }

  if (res.status === 400 && data && data.title === 'Member Exists') {
    return json(200, { ok: true, message: 'already_subscribed' });
  }

  console.error('Mailchimp error', res.status, data);
  return json(502, { ok: false, error: 'upstream_error', status: res.status });
};
