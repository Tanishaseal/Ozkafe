import { createPaymentService, PaymentError } from './payment-service.js';

async function readBody(req) {
  if (req.body !== undefined) {
    const text = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(text) > 200000) throw new PaymentError('Request is too large.', 413);
    try { return JSON.parse(text); } catch { throw new PaymentError('Invalid JSON request.'); }
  }
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += Buffer.byteLength(chunk);
    if (size > 200000) throw new PaymentError('Request is too large.', 413);
    chunks.push(Buffer.from(chunk));
  }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new PaymentError('Invalid JSON request.'); }
}

export function createPaymentHandler(options = {}) {
  const service = createPaymentService(options);
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const send = (status, body) => { res.statusCode = status; res.end(JSON.stringify(body)); };
    try {
      if (req.method === 'GET') return send(200, service.config());
      if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return send(405, { error: 'Method not allowed.' }); }
      if (!req.headers['content-type']?.startsWith('application/json')) throw new PaymentError('Use application/json.', 415);
      // Browser-only mutations must come from this host. No permissive CORS.
      const origin = req.headers.origin;
      const host = req.headers.host;
      if (!origin || !host || new URL(origin).host !== host || req.headers['sec-fetch-site'] === 'cross-site') throw new PaymentError('Request origin is not allowed.', 403);
      const body = await readBody(req);
      if (!['create', 'verify', 'status'].includes(body?.action)) throw new PaymentError('Unknown payment action.');
      return send(200, await service[body.action](body));
    } catch (error) {
      return send(error instanceof PaymentError ? error.status : 500, { error: error instanceof PaymentError ? error.message : 'Checkout could not be completed. Please try again.' });
    }
  };
}
