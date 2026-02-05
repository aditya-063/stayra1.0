import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken, comparePassword, hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * POST /api/auth/change-password
 * Change password for authenticated user
 */
export async function POST(request: NextRequest) {
    try {
        // Get user from auth token
        const authHeader = request.headers.get('authorization');
        const user = await getUserFromToken(authHeader);

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'Current password and new password are required' },
                { status: 400 }
            );
        }

        // Validate new password strength
        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: 'New password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Get user's current password hash
        const userWithPassword = await prisma.user.findUnique({
            where: { id: user.id },
            select: { password: true },
        });

        if (!userWithPassword) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Verify current password
        const isValidPassword = await comparePassword(currentPassword, userWithPassword.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Current password is incorrect' },
                { status: 401 }
            );
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        return NextResponse.json({
            success: true,
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json(
            { error: 'An error occurred while changing password' },
            { status: 500 }
        );
    }
}
