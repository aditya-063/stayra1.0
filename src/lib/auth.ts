import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const prisma = new PrismaClient();

// JWT Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT token for user
 */
export function generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode JWT token
 */
export function verifyToken(token: string): { userId: string } | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        return decoded;
    } catch (error) {
        return null;
    }
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

/**
 * Compare plain password with hashed password
 */
export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Generate 6-digit OTP
 */
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate unique password reset token
 */
export function generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Create OTP record in database
 */
export async function createOTP(identifier: string, type: 'email' | 'mobile'): Promise<string> {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Delete any existing unused OTPs for this identifier
    await prisma.otp.deleteMany({
        where: {
            identifier,
            isUsed: false,
        },
    });

    // Create new OTP
    await prisma.otp.create({
        data: {
            identifier,
            otp,
            type,
            expiresAt,
        },
    });

    return otp;
}

/**
 * Verify OTP
 */
export async function verifyOTP(identifier: string, otp: string): Promise<boolean> {
    const otpRecord = await prisma.otp.findFirst({
        where: {
            identifier,
            otp,
            isUsed: false,
            expiresAt: {
                gt: new Date(),
            },
        },
    });

    if (!otpRecord) {
        return false;
    }

    // Mark OTP as used
    await prisma.otp.update({
        where: { id: otpRecord.id },
        data: { isUsed: true },
    });

    return true;
}

/**
 * Create password reset token
 */
export async function createPasswordResetToken(userId: string): Promise<string> {
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Delete any existing unused tokens for this user
    await prisma.passwordResetToken.deleteMany({
        where: {
            userId,
            isUsed: false,
        },
    });

    // Create new token
    await prisma.passwordResetToken.create({
        data: {
            userId,
            token,
            expiresAt,
        },
    });

    return token;
}

/**
 * Verify password reset token
 */
export async function verifyPasswordResetToken(token: string): Promise<string | null> {
    const tokenRecord = await prisma.passwordResetToken.findFirst({
        where: {
            token,
            isUsed: false,
            expiresAt: {
                gt: new Date(),
            },
        },
    });

    if (!tokenRecord) {
        return null;
    }

    // Mark token as used
    await prisma.passwordResetToken.update({
        where: { id: tokenRecord.id },
        data: { isUsed: true },
    });

    return tokenRecord.userId;
}

/**
 * Get user from JWT token in request headers
 */
export async function getUserFromToken(authHeader: string | null) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
        return null;
    }

    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
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

    return user;
}
