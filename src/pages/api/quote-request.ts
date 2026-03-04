import type { APIRoute } from 'astro';

const LEAD_NOTIFY_EMAIL = import.meta.env.LEAD_NOTIFY_EMAIL || process.env.LEAD_NOTIFY_EMAIL || 'info@jdhomeconstruction.com';

function buildEmailHtml(data: Record<string, unknown>): string {
  const rows = Object.entries(data)
    .filter(([, v]) => v != null && v !== '')
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${String(v)}</td></tr>`)
    .join('');
  return `
    <h2>New Quote Request</h2>
    <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
      ${rows}
    </table>
    <p style="margin-top: 24px; color: #666;">Sent from JD Home Construction website.</p>
  `;
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

    // Store lead in Supabase
    const supabase = (await import('../../lib/supabase-server')).getSupabaseAdmin();
    if (supabase) {
      try {
        const { error } = await supabase.from('leads').insert({
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
        });
        if (error) throw error;
      } catch (dbError) {
        console.error('Failed to store lead in Supabase:', dbError);
      }
    }

    // Send notification email via Resend
    const resendApiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const emailHtml = buildEmailHtml({
        Name: lead.name,
        Email: lead.email,
        Phone: lead.phone,
        'Zip Code': lead.zipCode,
        'Project Type': lead.projectType,
        Timeline: lead.timeline,
        'Budget Range': lead.budgetRange,
        'Project Details': lead.projectDetails,
        'Photo URLs': lead.photoUrls.length ? lead.photoUrls.join(', ') : 'None',
      });
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: import.meta.env.RESEND_FROM || process.env.RESEND_FROM || 'noreply@jdhomeconstruction.com',
          to: LEAD_NOTIFY_EMAIL,
          subject: `New Quote Request from ${lead.name} — ${lead.projectType}`,
          html: emailHtml,
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
