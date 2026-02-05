import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth';
import { sendWelcomeEmail } from '@/lib/mailer';

const prisma = new PrismaClient();

/**
 * POST /api/auth/signup
 * Create new user account
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, mobile, password, name } = body;

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        // Check if user already exists with this email
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUserByEmail) {
            return NextResponse.json(
                { error: 'An account with this email already exists' },
                { status: 409 }
            );
        }

        // Check if mobile is provided and already exists
        if (mobile) {
            const existingUserByMobile = await prisma.user.findUnique({
                where: { mobile },
            });

            if (existingUserByMobile) {
                return NextResponse.json(
                    { error: 'An account with this mobile number already exists' },
                    { status: 409 }
                );
            }
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                mobile: mobile || null,
                password: hashedPassword,
                name: name || null,
            },
        });

        // Send welcome email (non-blocking)
        if (name) {
            sendWelcomeEmail(email, name).catch(err =>
                console.error('Failed to send welcome email:', err)
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Account created successfully',
            user: {
                id: user.id,
                email: user.email,
                mobile: user.mobile,
                name: user.name,
            },
        }, { status: 201 });
    } catch (error) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { error: 'An error occurred during signup' },
            { status: 500 }
        );
    }
}
