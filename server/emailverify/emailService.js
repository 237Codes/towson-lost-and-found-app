const nodemailer = require("nodemailer");
require("dotenv").config();

class EmailService {
  constructor() {
    // Create Gmail SMTP transporter
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, // towsonlostandfound@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD, // Gmail App Password
      },
    });

    // Verify transporter setup
    this.transporter.verify((error, success) => {
      if (error) {
        console.error("SMTP connection error:", error);
      } else {
        console.log("Server is ready to send emails");
      }
    });
  }

  generateVerificationCode() {
    // Generate a 6-character alphanumeric code
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async sendVerificationEmail(userEmail) {
    try {
      if (!userEmail.endsWith("@students.towson.edu")) {
        throw new Error("Must use a Towson University email address");
      }

      const verificationCode = this.generateVerificationCode();

      const mailOptions = {
        from: `"TU Lost and Found" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: "Verify Your TU Lost and Found Account",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FFB800;">Welcome to TU Lost and Found!</h2>
            <p>Please verify your email address to complete your registration.</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin: 0;">Your verification code:</h3>
              <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${verificationCode}</p>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        verificationCode,
        message: "Verification email sent successfully",
      };
    } catch (error) {
      console.error("Email sending error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async sendPasswordResetEmail(userEmail, resetToken) {
    try {
      const mailOptions = {
        from: `"TU Lost and Found" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: "Reset Your Password",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #FFB800;">Password Reset Request</h2>
            <p>We received a request to reset your password.</p>
            <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin: 0;">Your reset code:</h3>
              <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${resetToken}</p>
            </div>
            <p>This code will expire in 1 hour.</p>
            <p>If you didn't request this reset, please ignore this email.</p>
          </div>
        `,
      };

      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error("Password reset email error:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
