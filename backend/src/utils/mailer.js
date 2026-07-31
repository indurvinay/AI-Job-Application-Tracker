const nodemailer = require('nodemailer');

const EMAIL_USER = process.env.EMAIL_USER || 'vinay20developer@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'uerh rdpt rpve wapg';

// Create Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

/**
 * Send real-time "Application Received & Confirmed" email to the user's inbox
 */
const sendConfirmationEmail = async (userEmail, jobDetails) => {
  const recipient = userEmail || EMAIL_USER;
  const company = jobDetails.company || 'Target Company';
  const role = jobDetails.role || 'Software Engineer';
  const salary = jobDetails.salary || 'Competitive';
  const matchScore = jobDetails.matchScore || 90;

  const mailOptions = {
    from: `"NexusJob AI Auto-Apply Engine" <${EMAIL_USER}>`,
    to: recipient,
    subject: `✅ Application Confirmation: ${role} at ${company}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0b0f19; color: #ffffff; padding: 24px; border-radius: 16px; border: 1px solid #1e293b;">
        <div style="text-align: center; padding-bottom: 16px; border-bottom: 1px solid #334155;">
          <h2 style="color: #6366f1; margin: 0; font-size: 24px;">NexusJob AI Career Suite</h2>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Autonomous Application Receipt Confirmation</p>
        </div>

        <div style="padding: 20px 0;">
          <h3 style="color: #10b981; font-size: 18px; margin-top: 0;">🎉 Application Submitted & Logged!</h3>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
            Your AI Auto-Apply Engine has successfully tailored your resume, filled out application details, and submitted your application for <strong>${role}</strong> at <strong>${company}</strong>.
          </p>

          <table style="width: 100%; background-color: #1e293b; border-radius: 12px; padding: 16px; margin: 16px 0; color: #f8fafc; font-size: 14px;">
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Company:</td>
              <td style="font-weight: bold; text-align: right;">${company}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Role Title:</td>
              <td style="font-weight: bold; text-align: right;">${role}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">AI Match Score:</td>
              <td style="font-weight: bold; text-align: right; color: #38bdf8;">${matchScore}% Match</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Salary Range:</td>
              <td style="font-weight: bold; text-align: right; color: #a855f7;">${salary}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #94a3b8;">Recruiter Outreach:</td>
              <td style="font-weight: bold; text-align: right; color: #10b981;">Cold Email Dispatched</td>
            </tr>
          </table>

          <p style="color: #94a3b8; font-size: 12px;">
            This job has been automatically synced to your <strong>Kanban Career Pipeline</strong> dashboard.
          </p>
        </div>

        <div style="text-align: center; padding-top: 16px; border-top: 1px solid #334155; color: #64748b; font-size: 11px;">
          © 2026 NexusJob AI Autonomous Systems. All rights reserved.
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Confirmation Email sent to ${recipient}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[MAILER ERROR] Failed to send confirmation email to ${recipient}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send cold email directly to company recruiter
 */
const sendColdEmailToRecruiter = async (recruiterEmail, applicantName, company, role, emailBody) => {
  const recipient = recruiterEmail || 'recruiter@company.com';
  
  const mailOptions = {
    from: `"${applicantName || 'Applicant'}" <${EMAIL_USER}>`,
    to: recipient,
    subject: `Application & Introduction: ${role} - ${applicantName || 'Applicant'}`,
    text: emailBody
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAILER] Cold Email sent to recruiter ${recipient}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[MAILER ERROR] Failed to send cold email to recruiter:`, error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendConfirmationEmail, sendColdEmailToRecruiter };
