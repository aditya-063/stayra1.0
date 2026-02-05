// Twilio SMS Integration (placeholder - requires Twilio account)
// Install with: npm install twilio

// Uncomment when Twilio credentials are available:
// import twilio from 'twilio';

// const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
// const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
// const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';

// const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/**
 * Send OTP via SMS
 * @param mobile - Mobile number in E.164 format (e.g., +11234567890)
 * @param otp - 6-digit OTP code
 */
export async function sendOTPSMS(mobile: string, otp: string): Promise<boolean> {
    try {
        // Placeholder implementation - logs to console
        console.log(`📱 SMS OTP to ${mobile}: ${otp}`);
        console.log('⚠️  SMS sending is not configured. Please add Twilio credentials to .env');

        // Uncomment when Twilio is configured:
        /*
        await client.messages.create({
          body: `Your Stayra verification code is: ${otp}. This code expires in 5 minutes.`,
          from: TWILIO_PHONE_NUMBER,
          to: mobile,
        });
        */

        // Return true in development for testing
        return process.env.NODE_ENV === 'development';
    } catch (error) {
        console.error('Error sending OTP SMS:', error);
        return false;
    }
}

/**
 * Send password reset SMS
 */
export async function sendPasswordResetSMS(mobile: string, token: string): Promise<boolean> {
    try {
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

        console.log(`📱 SMS Password Reset to ${mobile}`);
        console.log(`Reset URL: ${resetUrl}`);
        console.log('⚠️  SMS sending is not configured. Please add Twilio credentials to .env');

        // Uncomment when Twilio is configured:
        /*
        await client.messages.create({
          body: `Reset your Stayra password: ${resetUrl}`,
          from: TWILIO_PHONE_NUMBER,
          to: mobile,
        });
        */

        return process.env.NODE_ENV === 'development';
    } catch (error) {
        console.error('Error sending password reset SMS:', error);
        return false;
    }
}
