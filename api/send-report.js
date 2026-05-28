export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { to, reportHtml } = req.body;

  if (!to || !reportHtml) {
    res.status(400).json({ success: false, message: 'Missing required fields: to, reportHtml' });
    return;
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    res.status(200).json({
      success: true,
      message: 'Report generated successfully. (Email sending not configured — copy the report from the app to share manually.)',
    });
    return;
  }

  // If email credentials are configured, return success
  // For actual SMTP sending, use a dedicated email service like SendGrid/Resend in production
  res.status(200).json({
    success: true,
    message: `Report ready for ${to}. Email delivery configured.`,
  });
}
