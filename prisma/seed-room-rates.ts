import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Price variation functions per partner
function getBookingPrice(basePrice: number): number {
    return basePrice + (Math.random() * 20 - 10); // -10 to +10
}

function getAgodaPrice(basePrice: number): number {
    return basePrice + (Math.random() * 30 - 15); // -15 to +15 (more variation)
}

function getExpediaPrice(basePrice: number): number {
    return basePrice + (Math.random() * 16 - 8); // -8 to +8
}

function getHotelsComPrice(basePrice: number): number {
    return basePrice + (Math.random() * 12 - 6); // -6 to +6
}

function getCancellationPolicy(refundable: boolean): string {
    if (refundable) {
        return Math.random() > 0.5
            ? 'Free cancellation until 24 hours before check-in'
            : 'Free cancellation until 48 hours before check-in';
    } else {
        return 'Non-refundable';
    }
}

async function main() {
    console.log('💰 Seeding room rates...');

    // Get all hotels
    const hotels = await prisma.hotel.findMany({
        include: {
            roomTypes: true,
        },
    });

    console.log(`Found ${hotels.length} hotels`);

    const partners = [
        { id: 'booking', priceFn: getBookingPrice },
        { id: 'agoda', priceFn: getAgodaPrice },
        { id: 'expedia', priceFn: getExpediaPrice },
        { id: 'hotelscom', priceFn: getHotelsComPrice },
    ];

    // Sample dates for the next 3 months
    const today = new Date();
    const dates = [];
    for (let i = 7; i < 90; i += 7) {
        // Every week for 3 months
        const checkin = new Date(today);
        checkin.setDate(today.getDate() + i);
        const checkout = new Date(checkin);
        checkout.setDate(checkin.getDate() + 3); // 3-night stay
        dates.push({ checkin, checkout });
    }

    let rateCount = 0;

    for (const hotel of hotels) {
        if (hotel.roomTypes.length === 0) continue;

        const roomType = hotel.roomTypes[0]; // Use first room type
        const basePrice = getBasePriceFromHotelName(hotel.canonicalName);

        for (const { checkin, checkout } of dates) {
            for (const partner of partners) {
                const price = Math.round(partner.priceFn(basePrice) * 100) / 100;
                const refundable = Math.random() > 0.4; // 60% refundable
                const taxes = Math.round(price * 0.12 * 100) / 100; // 12% tax

                await prisma.roomRate.create({
                    data: {
                        roomTypeId: roomType.id,
                        otaName: partner.id,
                        checkin,
                        checkout,
                        basePrice: price,
                        taxes,
                        currency: getCurrency(hotel.country),
                        refundable,
                        availability: Math.floor(Math.random() * 10) + 1, // 1-10 rooms
                        bookingUrl: `https://www.${partner.id}.com/hotel/${hotel.slug}`,
                    },
                });

                rateCount++;
            }
        }
    }

    console.log(`✅ Created ${rateCount} room rates across ${partners.length} partners`);
}

function getBasePriceFromHotelName(name: string): number {
    // Extract base price from hotel data (simplified)
    const priceMap: Record<string, number> = {
        'Le Grand Hotel Paris': 250,
        'Hotel Eiffel Tower View': 180,
        'Paris City Center Inn': 120,
        'Montmartre Boutique Hotel': 160,
        'The Royal London': 300,
        'Tower Bridge Hotel': 200,
        'Westminster Inn': 140,
        'Soho Boutique London': 220,
        'Manhattan Grand Hotel': 350,
        'Times Square Plaza': 250,
        'Brooklyn Heights Inn': 180,
        'Chelsea Boutique NYC': 280,
        'Tokyo Imperial Palace Hotel': 320,
        'Shibuya Crossing Hotel': 200,
        'Asakusa Traditional Ryokan': 180,
        'Ginza Business Hotel': 150,
        'Dubai Luxury Resort': 400,
        'Marina Bay Hotel Dubai': 220,
        'Old Dubai Heritage Hotel': 160,
        'Downtown Dubai Tower': 380,
    };
    return priceMap[name] || 150;
}

function getCurrency(country: string): string {
    const currencyMap: Record<string, string> = {
        France: 'EUR',
        'United Kingdom': 'GBP',
        'United States': 'USD',
        Japan: 'JPY',
        'United Arab Emirates': 'AED',
    };
    return currencyMap[country] || 'USD';
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
