import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🏨 Seeding partners...');

    const partners = [
        {
            id: 'booking',
            name: 'Booking.com',
            logo: '🏨',
            bookingType: 'redirect',
            baseUrl: 'https://www.booking.com',
            isActive: true,
            priority: 1,
        },
        {
            id: 'agoda',
            name: 'Agoda',
            logo: '🌐',
            bookingType: 'redirect',
            baseUrl: 'https://www.agoda.com',
            isActive: true,
            priority: 2,
        },
        {
            id: 'expedia',
            name: 'Expedia',
            logo: '✈️',
            bookingType: 'redirect',
            baseUrl: 'https://www.expedia.com',
            isActive: true,
            priority: 3,
        },
        {
            id: 'hotelscom',
            name: 'Hotels.com',
            logo: '🏢',
            bookingType: 'redirect',
            baseUrl: 'https://www.hotels.com',
            isActive: true,
            priority: 4,
        },
    ];

    for (const partner of partners) {
        await prisma.partner.upsert({
            where: { id: partner.id },
            update: partner,
            create: partner,
        });
    }

    console.log(`✅ Created ${partners.length} partners`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
