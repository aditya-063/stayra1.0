import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { comparePassword, generateToken, verifyOTP } from '@/lib/auth';

const prisma = new PrismaClient();

/**
 * POST /api/auth/login
 * Handle multi-method login: Email/Mobile with Password/OTP
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { identifier, password, otp, method } = body;

        // Validate input
        if (!identifier || !method) {
            return NextResponse.json(
                { error: 'Identifier and method are required' },
                { status: 400 }
            );
        }

        // Determine if identifier is email or mobile
        const isEmail = identifier.includes('@');
        const searchField = isEmail ? 'email' : 'mobile';

        // Find user
        const user = await prisma.user.findUnique({
            where: { [searchField]: identifier },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Handle different authentication methods
        if (method === 'password') {
            // Password-based login
            if (!password) {
                return NextResponse.json(
                    { error: 'Password is required' },
                    { status: 400 }
                );
            }

            const isValidPassword = await comparePassword(password, user.password);
            if (!isValidPassword) {
                return NextResponse.json(
                    { error: 'Invalid credentials' },
                    { status: 401 }
                );
            }
        } else if (method === 'otp') {
            // OTP-based login
            if (!otp) {
                return NextResponse.json(
                    { error: 'OTP is required' },
                    { status: 400 }
                );
            }

            const isValidOTP = await verifyOTP(identifier, otp);
            if (!isValidOTP) {
                return NextResponse.json(
                    { error: 'Invalid or expired OTP' },
                    { status: 401 }
                );
            }

            // Mark email/mobile as verified on successful OTP login
            if (isEmail && !user.isEmailVerified) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { isEmailVerified: true },
                });
            } else if (!isEmail && !user.isMobileVerified) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { isMobileVerified: true },
                });
            }
        } else {
            return NextResponse.json(
                { error: 'Invalid authentication method' },
                { status: 400 }
            );
        }

        // Update last login timestamp
        await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        // Generate JWT token
        const token = generateToken(user.id);

        // Return success response
        return NextResponse.json({
            success: true,
            token,
            user: {
                id: user.id,
                email: user.email,
                mobile: user.mobile,
                name: user.name,
                profilePicture: user.profilePicture,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'An error occurred during login' },
            { status: 500 }
        );
    }
}
