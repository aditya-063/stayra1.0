import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getUserFromToken } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * GET /api/profile
 * Fetch current user profile
 */
export async function GET(request: NextRequest) {
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

        return NextResponse.json({
            success: true,
            user,
        });
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching profile' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/profile
 * Update user profile
 */
export async function PUT(request: NextRequest) {
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
        const { name, mobile, address, city, country, dateOfBirth, preferences } = body;

        // Check if mobile is being changed and if it's already taken
        if (mobile && mobile !== user.mobile) {
            const existingUser = await prisma.user.findUnique({
                where: { mobile },
            });

            if (existingUser && existingUser.id !== user.id) {
                return NextResponse.json(
                    { error: 'This mobile number is already associated with another account' },
                    { status: 409 }
                );
            }
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                ...(name !== undefined && { name }),
                ...(mobile !== undefined && { mobile }),
                ...(address !== undefined && { address }),
                ...(city !== undefined && { city }),
                ...(country !== undefined && { country }),
                ...(dateOfBirth !== undefined && { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }),
                ...(preferences !== undefined && { preferences }),
            },
            select: {
                id: true,
                email: true,
                mobile: true,
                name: true,
                profilePicture: true,
                address: true,
                city: true,
                country: true,
                dateOfBirth: true,
                preferences: true,
                isEmailVerified: true,
                isMobileVerified: true,
                lastLoginAt: true,
                createdAt: true,
            },
        });

        return NextResponse.json({
            success: true,
            user: updatedUser,
        });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'An error occurred while updating profile' },
            { status: 500 }
        );
    }
}
