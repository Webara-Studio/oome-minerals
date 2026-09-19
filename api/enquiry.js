const MAX_BODY_BYTES = 12_000;
const MAX_FIELD_LENGTHS = {
  name: 120,
  organisation: 160,
  email: 254,
  interest: 100,
  message: 4_000,
};

function asText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  }[character]));
}

function invalid(res, message = 'Please review the highlighted information and try again.') {
  return res.status(400).json({ ok: false, message });
}

function buildText({ name, organisation, email, interest, message }) {
  return [
    'New OOME Minerals website enquiry',
    '',
    `Name: ${name}`,
    `Organisation: ${organisation}`,
    `Business email: ${email}`,
    `Enquiry type: ${interest}`,
    '',
    'Commercial context:',
    message,
  ].join('\n');
}

function buildHtml(fields) {
  const rows = [
    ['Name', fields.name],
    ['Organisation', fields.organisation],
    ['Business email', fields.email],
    ['Enquiry type', fields.interest],
  ].map(([label, value]) => `<tr><th align="left" style="padding:0 16px 10px 0;color:#655c4d">${label}</th><td style="padding:0 0 10px">${escapeHtml(value)}</td></tr>`).join('');

  return `<!doctype html><html><body style="margin:0;padding:24px;font-family:Arial,sans-serif;color:#1f1c17"><h2 style="margin:0 0 20px">New OOME Minerals website enquiry</h2><table cellpadding="0" cellspacing="0" role="presentation">${rows}</table><h3 style="margin:24px 0 8px">Commercial context</h3><p style="white-space:pre-wrap;margin:0">${escapeHtml(fields.message)}</p></body></html>`;
}

module.exports = async function enquiry(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  }

  if (Number(req.headers['content-length'] || 0) > MAX_BODY_BYTES) {
    return res.status(413).json({ ok: false, message: 'Your enquiry is too large. Please keep it concise.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch (_) {
    return invalid(res);
  }
  if (asText(body.website)) {
    // Honeypot: acknowledge without delivering anything to discourage automated retries.
    return res.status(202).json({ ok: true });
  }

  const fields = Object.fromEntries(Object.keys(MAX_FIELD_LENGTHS).map(key => [key, asText(body[key])]));
  for (const [key, max] of Object.entries(MAX_FIELD_LENGTHS)) {
    if (!fields[key] || fields[key].length > max) return invalid(res);
  }
  if (!/^\S+@\S+\.\S+$/.test(fields.email) || body.consent !== true) return invalid(res);

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error('Contact service is not configured.');
    return res.status(503).json({ ok: false, message: 'The contact service is temporarily unavailable. Please try again later.' });
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'OOME Minerals <admin@oomeminerals.com>',
      to: [process.env.CONTACT_TO || 'admin@oomeminerals.com'],
      reply_to: fields.email,
      subject: `New OOME enquiry: ${fields.interest} — ${fields.name}`,
      text: buildText(fields),
      html: buildHtml(fields),
    }),
  });

  if (!response.ok) {
    console.error(`Resend delivery request failed with HTTP ${response.status}.`);
    return res.status(502).json({ ok: false, message: 'We could not send your enquiry at present. Please try again shortly.' });
  }

  return res.status(202).json({ ok: true, message: 'Thank you. Your enquiry has been sent to OOME for review.' });
};

module.exports._private = { asText, escapeHtml, buildText, buildHtml };
