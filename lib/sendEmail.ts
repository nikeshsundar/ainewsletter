import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || '');

interface SendEmailParams {
  to: string;
  subject: string;
  htmlContent: string;
}

export async function sendEmail({ to, subject, htmlContent }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing environment variable: RESEND_API_KEY');
  }

  // Create a premium, clean email container for the AI-generated newsletter
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body {
            background-color: #f9fafb;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            color: #1f2937;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            overflow: hidden;
            margin-top: 20px;
            margin-bottom: 20px;
          }
          .header {
            background: linear-gradient(135deg, #4f46e5 0%, #312e81 100%);
            padding: 30px 20px;
            text-align: center;
          }
          .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: 700;
            letter-spacing: -0.025em;
          }
          .header p {
            color: #c7d2fe;
            margin: 5px 0 0 0;
            font-size: 14px;
          }
          .content {
            padding: 30px 25px;
            line-height: 1.6;
            font-size: 16px;
          }
          .footer {
            background-color: #f3f4f6;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
          }
          .footer a {
            color: #4f46e5;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your AI Personal Digest</h1>
            <p>Curated and written by AI based on your interests</p>
          </div>
          <div class="content">
            ${htmlContent}
          </div>
          <div class="footer">
            <p>You received this because you subscribed to AI Personal Digest.</p>
            <p>To unsubscribe or update your preferences, click <a href="#" target="_blank">here</a>.</p>
            <p>&copy; ${new Date().getFullYear()} AI Personal Digest. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    console.log(`[Resend] Sending email to: ${to} with subject: "${subject}"`);
    
    // Note: Resend's free tier restricted sending is:
    // From address must be "onboarding@resend.dev" if a custom domain is not verified.
    const response = await resend.emails.send({
      from: 'AI News Digest <onboarding@resend.dev>',
      to: to,
      subject: subject,
      html: fullHtml,
    });

    if (response.error) {
      throw new Error(`Resend error: ${JSON.stringify(response.error)}`);
    }

    console.log(`[Resend] Email sent successfully. ID: ${response.data?.id}`);
    return response.data;
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    throw error;
  }
}
