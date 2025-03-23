const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// This file is used for SendGrid setup and functionality

class EmailService {
  constructor() {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY is missing in .env file');
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendVerificationEmail(userEmail, verificationCode) {
    const msg = {
      to: userEmail,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Verify Your TU Lost and Found Account',
      text: `Your verification code is: ${verificationCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FFB800;">TU Lost and Found</h2>
          <p>Welcome to TU Lost and Found! Please verify your email address.</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin: 0;">Your verification code:</h3>
            <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${verificationCode}</p>
          </div>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
    };

    try {
      await sgMail.send(msg);
      return { success: true };
    } catch (error) {
      console.error('SendGrid Error:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();