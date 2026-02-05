import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createPasswordResetToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/mailer';

const prisma = new PrismaClient();

/**
 * POST /api/auth/forgot-password
 * Initiate password reset flow
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Always return success even if user doesn't exist (security best practice)
        // This prevents email enumeration attacks
        if (!user) {
            return NextResponse.json({
                success: true,
                message: 'If an account exists with this email, a password reset link has been sent',
            });
        }

        // Generate reset token
        const token = await createPasswordResetToken(user.id);

        // Send reset email
        const sent = await sendPasswordResetEmail(email, token);

        if (!sent) {
            console.error('Failed to send password reset email to:', email);
        }

        return NextResponse.json({
            success: true,
            message: 'If an account exists with this email, a password reset link has been sent',
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing your request' },
            { status: 500 }
        );
    }
}
