import nodemailer from 'nodemailer';

// Email configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
const SMTP_FROM = process.env.SMTP_FROM || 'Stayra <no-reply@stayra.com>';

// Create reusable transporter
const transporter = nodemailer.createTransporter({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
    },
});

/**
 * Send OTP via email
 */
export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
    try {
        const mailOptions = {
            from: SMTP_FROM,
            to: email,
            subject: 'Your Stayra Login OTP',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4a044e 0%, #701a75 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #4a044e; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #4a044e; letter-spacing: 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Stayra</h1>
              <p style="margin: 10px 0 0 0;">Your Hotel Comparison Platform</p>
            </div>
            <div class="content">
              <h2>Login Verification Code</h2>
              <p>Hello,</p>
              <p>Your one-time password (OTP) for logging into Stayra is:</p>
              <div class="otp-box">
                <div class="otp-code">${otp}</div>
              </div>
              <p><strong>This code will expire in 5 minutes.</strong></p>
              <p>If you didn't request this code, please ignore this email.</p>
              <p>Best regards,<br>The Stayra Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Stayra. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending OTP email:', error);
        return false;
    }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, token: string): Promise<boolean> {
    try {
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

        const mailOptions = {
            from: SMTP_FROM,
            to: email,
            subject: 'Reset Your Stayra Password',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4a044e 0%, #701a75 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #4a044e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Stayra</h1>
              <p style="margin: 10px 0 0 0;">Password Reset Request</p>
            </div>
            <div class="content">
              <h2>Reset Your Password</h2>
              <p>Hello,</p>
              <p>We received a request to reset your password for your Stayra account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #4a044e;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
              <p>Best regards,<br>The Stayra Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Stayra. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
        const mailOptions = {
            from: SMTP_FROM,
            to: email,
            subject: 'Welcome to Stayra!',
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4a044e 0%, #701a75 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Welcome to Stayra!</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for joining Stayra, your trusted hotel comparison platform.</p>
              <p>With Stayra, you can:</p>
              <ul>
                <li>Compare hotel prices across multiple booking platforms</li>
                <li>Find the best deals for your stays</li>
                <li>Access exclusive member rates</li>
                <li>Track your bookings and preferences</li>
              </ul>
              <p>Start exploring amazing destinations and finding the best hotel deals today!</p>
              <p>Best regards,<br>The Stayra Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Stayra. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
}
