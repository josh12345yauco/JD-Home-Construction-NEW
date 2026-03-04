import type { APIRoute } from 'astro';

const LEAD_NOTIFY_EMAILS = (import.meta.env.LEAD_NOTIFY_EMAIL || process.env.LEAD_NOTIFY_EMAIL || '')
  .split(',')
  .map((e: string) => e.trim())
  .filter(Boolean);
const DEFAULT_NOTIFY_EMAILS = ['progresomarketingllc@gmail.com', 'JDhomellc@yahoo.com'];
const REPLY_TO_EMAIL = import.meta.env.REPLY_TO_EMAIL || process.env.REPLY_TO_EMAIL || 'JDhomellc@yahoo.com';

function esc(str: string) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildEmailHtml(data: Record<string, unknown>, dashboardLink?: string): string {
  const rows = Object.entries(data)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `
      <tr>
        <td style="padding:10px 14px;background:#f4f4f5;font-weight:600;color:#374151;width:160px;vertical-align:top;border-bottom:1px solid #e5e7eb;">${esc(k)}</td>
        <td style="padding:10px 14px;color:#111827;vertical-align:top;border-bottom:1px solid #e5e7eb;">${esc(String(v))}</td>
      </tr>`)
    .join('');
  const linkSection = dashboardLink
    ? `<p style="margin-top:28px;"><a href="${dashboardLink}" style="display:inline-block;background:#131720;color:#ffffff;padding:12px 28px;text-decoration:none;border-radius:6px;font-weight:600;font-size:14px;">View Lead in Dashboard</a></p>`
    : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>New Quote Request</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:8px;border:1px solid #e5e7eb;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#131720;padding:24px 32px;">
              <p style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">JD Home Construction</p>
              <p style="margin:4px 0 0;font-size:13px;color:#9ca3af;">New Quote Request</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 20px;font-size:15px;color:#374151;">You have received a new quote request through your website. Details are below.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden;">
                ${rows}
              </table>
              ${linkSection}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f4f4f5;padding:20px 32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#6b7280;">This is an automated notification from JD Home Construction. Do not reply to this email — use the reply-to address to contact the customer.</p>
              <p style="margin:8px 0 0;font-size:12px;color:#9ca3af;">JD Home Construction | Philadelphia, PA | jdhomeconstruction.org</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildEmailText(data: Record<string, unknown>, dashboardLink?: string): string {
  const lines = Object.entries(data)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `${k}: ${String(v)}`);
  const link = dashboardLink ? `\nView lead in dashboard: ${dashboardLink}\n` : '';
  return [
    'NEW QUOTE REQUEST — JD Home Construction',
    '==========================================',
    '',
    ...lines,
    link,
    '--',
    'JD Home Construction | Philadelphia, PA | jdhomeconstruction.org',
    'This is an automated notification. Do not reply to this address.',
  ].join('\n');
}

export const POST: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      zipCode,
      projectType,
      timeline,
      budgetRange,
      projectDetails,
      photoUrls = [],
    } = body;

    if (!name || !email || !phone || !zipCode || !projectType || !timeline || !budgetRange || !projectDetails) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const lead = {
      name,
      email,
      phone,
      zipCode,
      projectType,
      timeline,
      budgetRange,
      projectDetails,
      photoUrls: Array.isArray(photoUrls) ? photoUrls : [],
      status: 'new',
      notes: '',
    };

    // Store lead in Supabase and get id for dashboard link
    let leadId: number | null = null;
    const supabase = (await import('../../lib/supabase-server')).getSupabaseAdmin();
    if (supabase) {
      try {
        const { data: inserted, error } = await supabase
          .from('leads')
          .insert({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            zip_code: lead.zipCode,
            project_type: lead.projectType,
            timeline: lead.timeline,
            budget_range: lead.budgetRange,
            project_details: lead.projectDetails,
            photo_urls: lead.photoUrls,
            status: lead.status,
            notes: lead.notes,
          })
          .select('id')
          .single();
        if (error) throw error;
        if (inserted?.id != null) leadId = inserted.id as number;
      } catch (dbError) {
        console.error('Failed to store lead in Supabase:', dbError);
      }
    }

    // Build dashboard link for email (open this lead in admin)
    const originHeader = request.headers.get('origin');
    const hostHeader = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim();
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const siteUrl = import.meta.env.SITE_URL || process.env.SITE_URL;
    const origin = originHeader || siteUrl || (hostHeader ? `${proto}://${hostHeader}` : '');
    const dashboardLink = origin && leadId != null ? `${origin.replace(/\/$/, '')}/admin?lead=${leadId}` : undefined;

    // Send notification email via Resend (to both addresses, reply-to JDhomellc@yahoo.com)
    const resendApiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    const toAddresses = LEAD_NOTIFY_EMAILS.length > 0 ? LEAD_NOTIFY_EMAILS : DEFAULT_NOTIFY_EMAILS;
    if (resendApiKey) {
      const emailData = {
        Name: lead.name,
        Email: lead.email,
        Phone: lead.phone,
        'Zip Code': lead.zipCode,
        'Project Type': lead.projectType,
        Timeline: lead.timeline,
        'Budget Range': lead.budgetRange,
        'Project Details': lead.projectDetails,
        'Photo URLs': lead.photoUrls.length ? lead.photoUrls.join(', ') : 'None',
      };
      const emailHtml = buildEmailHtml(emailData, dashboardLink);
      const emailText = buildEmailText(emailData, dashboardLink);
      const fromAddress = import.meta.env.RESEND_FROM || process.env.RESEND_FROM || 'noreply@jdhomeconstruction.org';
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: `JD Home Construction <${fromAddress}>`,
          to: toAddresses,
          reply_to: REPLY_TO_EMAIL,
          subject: `New Quote Request from ${lead.name} - ${lead.projectType}`,
          html: emailHtml,
          text: emailText,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error('Resend error:', err);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Thank you! We will get back to you within 1 business day.' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Quote request error:', error);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again or call us.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
