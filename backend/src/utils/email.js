const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create the "transporter" (Think of this as the delivery truck that logs into Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// A helper function we can call from anywhere in our backend to send an email
const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: `"Job Tracker AI" <${process.env.EMAIL_USER}>`,
      to,          // Who we are sending it to
      subject,     // The title of the email
      text,        // The body of the email
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = { sendEmail };
