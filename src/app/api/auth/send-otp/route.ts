import { NextRequest, NextResponse } from 'next/server';
import { createOTP } from '@/lib/auth';
import { sendOTPEmail } from '@/lib/mailer';
import { sendOTPSMS } from '@/lib/sms';

/**
 * POST /api/auth/send-otp
 * Generate and send OTP to email or mobile
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { identifier } = body;

        if (!identifier) {
            return NextResponse.json(
                { error: 'Email or mobile number is required' },
                { status: 400 }
            );
        }

        // Determine if identifier is email or mobile
        const isEmail = identifier.includes('@');
        const type = isEmail ? 'email' : 'mobile';

        // Generate OTP
        const otp = await createOTP(identifier, type);

        // Send OTP
        let sent = false;
        if (isEmail) {
            sent = await sendOTPEmail(identifier, otp);
        } else {
            sent = await sendOTPSMS(identifier, otp);
        }

        if (!sent) {
            return NextResponse.json(
                { error: `Failed to send OTP to ${type}` },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: `OTP sent to ${type}`,
            // In development, return OTP for testing (REMOVE IN PRODUCTION)
            ...(process.env.NODE_ENV === 'development' && { otp }),
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { error: 'An error occurred while sending OTP' },
            { status: 500 }
        );
    }
}
