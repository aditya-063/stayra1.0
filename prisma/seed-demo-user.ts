import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedDemoUser() {
    console.log('🔑 Seeding demo user...');

    const demoEmail = 'demo@stayra.com';
    const demoPassword = 'demo1234';

    try {
        // Check if demo user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: demoEmail },
        });

        if (existingUser) {
            console.log('ℹ️  Demo user already exists!');
            console.log('📧 Email:', demoEmail);
            console.log('🔐 Password:', demoPassword);
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(demoPassword, salt);

        // Create demo user
        const user = await prisma.user.create({
            data: {
                email: demoEmail,
                password: hashedPassword,
                name: 'Demo User',
                mobile: '+1234567890',
                isEmailVerified: true,
                isMobileVerified: true,
            },
        });

        console.log('✅ Demo user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', demoEmail);
        console.log('🔐 Password:', demoPassword);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🎯 You can now login at http://localhost:3000/login');
    } catch (error) {
        console.error('❌ Error seeding demo user:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedDemoUser();
