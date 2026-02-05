import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyPasswordResetToken, hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * POST /api/auth/reset-password
 * Complete password reset with token
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, newPassword } = body;

        if (!token || !newPassword) {
            return NextResponse.json(
                { error: 'Token and new password are required' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Verify token and get user ID
        const userId = await verifyPasswordResetToken(token);

        if (!userId) {
            return NextResponse.json(
                { error: 'Invalid or expired reset token' },
                { status: 400 }
            );
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update user password
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });

        return NextResponse.json({
            success: true,
            message: 'Password has been reset successfully',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'An error occurred while resetting password' },
            { status: 500 }
        );
    }
}
