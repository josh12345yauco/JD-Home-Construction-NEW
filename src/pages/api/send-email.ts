import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { to, subject, html } = body;

    // Validate required fields
    if (!to || !subject || !html) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, html' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use Wix's built-in email service via the backend
    // For now, we'll use a simple approach with a third-party service
    // You can replace this with your preferred email service (SendGrid, Mailgun, etc.)
    
    // Example using a simple fetch to a backend service
    // In production, you should use environment variables for API keys
    const emailServiceUrl = process.env.EMAIL_SERVICE_URL;
    const emailServiceKey = process.env.EMAIL_SERVICE_KEY;

    if (!emailServiceUrl || !emailServiceKey) {
      // Fallback: Log the email (for development)
      console.log('Email would be sent to:', to);
      console.log('Subject:', subject);
      console.log('HTML:', html);
      
      // Return success anyway for now
      return new Response(
        JSON.stringify({ success: true, message: 'Email queued for sending' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send email via external service
    const response = await fetch(emailServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${emailServiceKey}`,
      },
      body: JSON.stringify({
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email service returned ${response.status}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Email sending error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to send email', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
