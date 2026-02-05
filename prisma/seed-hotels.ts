import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🏨 Seeding hotels...');

    const hotels = [
        // PARIS hotels
        {
            canonicalName: 'Le Grand Hotel Paris',
            city: 'Paris',
            country: 'France',
            starRating: 5,
            basePrice: 250,
            description: 'Luxury 5-star hotel in the heart of Paris near the Louvre',
            propertyType: 'Hotel',
        },
        {
            canonicalName: 'Hotel Eiffel Tower View',
            city: 'Paris',
            country: 'France',
            starRating: 4,
            basePrice: 180,
            description: 'Charming 4-star hotel with stunning Eiffel Tower views',
            propertyType: 'Hotel',
        },
        {
            canonicalName: 'Paris City Center Inn',
            city: 'Paris',
            country: 'France',
            starRating: 3,
            basePrice: 120,
            description: 'Comfortable 3-star hotel in central Paris',
            propertyType: 'Hotel',
        },
        {
            canonicalName: 'Montmartre Boutique Hotel',
            city: 'Paris',
            country: 'France',
            starRating: 4,
            basePrice: 160,
            description: 'Artistic boutique hotel in charming Montmartre district',
            propertyType: 'Boutique',
        },

        // LONDON hotels
        {
            canonicalName: 'The Royal London',
            city: 'London',
            country: 'United Kingdom',
            starRating: 5,
            basePrice: 300,
            description: 'Iconic 5-star luxury hotel near Buckingham Palace',
            propertyType: 'Hotel',
        },
        {
            canonicalName: 'Tower Bridge Hotel',
            city: 'London',
            country: 'United Kingdom',
            starRating: 4,
            basePrice: 200,
            description: 'Modern hotel with views of Tower Bridge',
            propertyType: 'Hotel',
        },
        {
            canonicalName: 'Westminster Inn',
            city: 'London',
            country: 'United Kingdom',
            starRating: 3,
            basePrice: 140,
            description: 'Cozy hotel in Westminster area',
            propertyType: 'Inn',
        },
        {
            canonicalName: 'Soho Boutique London',
            city: 'London',
            country: 'United Kingdom',
            starRating: 4,
            basePrice: 220,
            description: 'Trendy boutique hotel in vibrant Soho',
            propertyType: 'Boutique',
        },

        // NEW YORK hotels
        {
            canonicalName: 'Manhattan Grand Hotel',
            city: 'New York',
            country: 'United States',
            starRating: 5,
            basePrice: 350,
            description: 'Luxury hotel in Midtown Manhattan',
            propertyType: 'Hotel',
        },
        {
            canonicalName: 'Times Square Plaza',
            city: 'New York',
            country: 'United States',
            starRating: 4,
            basePrice: 250,
            description: 'Modern hotel in the heart of Times Square',
            propertyType: 'Hotel',
        },
        {
            canonicalName: 'Brooklyn Heights Inn',
            city: 'New York',
            country: 'United States',
            starRating: 3,
            basePrice: 180,
            description: 'Charming inn in historic Brooklyn Heights',
            propertyType: 'Inn',
        },
        {
            canonicalName: 'Chelsea Boutique NYC',
            city: 'New York',
            country: 'United States',
            starRating: 4,
            basePrice: 280,
            description: 'Stylish boutique hotel in Chelsea neighborhood',
            propertyType: 'Boutique',
        },

        // TOKYO hotels
        {
            canonicalName: 'Tokyo Imperial Palace Hotel',
            city: 'Tokyo',
            country: 'Japan',
            starRating: 5,
            basePrice: 320,
            description: 'Prestigious hotel near the Imperial Palace',
            propertyType: 'Hotel',
        },
        {
            canonicalName: 'Shibuya Crossing Hotel',
            city: 'Tokyo',
            country: 'Japan',
            starRating: 4,
            basePrice: 200,
            description: 'Modern hotel overlooking famous Shibuya Crossing',
            propertyType: 'Hotel',
        },
        {
            canonicalName: 'Asakusa Traditional Ryokan',
            city: 'Tokyo',
            country: 'Japan',
            starRating: 4,
            basePrice: 180,
            description: 'Traditional Japanese inn in historic Asakusa',
            propertyType: 'Ryokan',
        },
        {
            canonicalName: 'Ginza Business Hotel',
            city: 'Tokyo',
            country: 'Japan',
            starRating: 3,
            basePrice: 150,
            description: 'Efficient business hotel in upscale Ginza',
            propertyType: 'Hotel',
        },

        // DUBAI hotels
        {
            canonicalName: 'Dubai Luxury Resort',
            city: 'Dubai',
            country: 'United Arab Emirates',
            starRating: 5,
            basePrice: 400,
            description: 'Ultra-luxury resort on the Palm Jumeirah',
            propertyType: 'Resort',
        },
        {
            canonicalName: 'Marina Bay Hotel Dubai',
            city: 'Dubai',
            country: 'United Arab Emirates',
            starRating: 4,
            basePrice: 220,
            description: 'Stunning hotel in Dubai Marina',
            propertyType: 'Hotel',
        },
        {
            canonicalName: 'Old Dubai Heritage Hotel',
            city: 'Dubai',
            country: 'United Arab Emirates',
            starRating: 3,
            basePrice: 160,
            description: 'Traditional hotel in historic Old Dubai',
            propertyType: 'Hotel',
        },
        {
            canonicalName: 'Downtown Dubai Tower',
            city: 'Dubai',
            country: 'United Arab Emirates',
            starRating: 5,
            basePrice: 380,
            description: 'Sky-high hotel near Burj Khalifa',
            propertyType: 'Hotel',
        },
    ];

    let createdCount = 0;

    for (const hotelData of hotels) {
        const slug = hotelData.canonicalName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const normalizedName = hotelData.canonicalName
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, '');

        const hotel = await prisma.hotel.create({
            data: {
                canonicalName: hotelData.canonicalName,
                normalizedName,
                slug,
                city: hotelData.city,
                country: hotelData.country,
                starRating: hotelData.starRating,
                description: hotelData.description,
                propertyType: hotelData.propertyType,
                reviewScore: Math.random() * 2 + 3, // 3.0 to 5.0
                reviewCount: Math.floor(Math.random() * 2000) + 100,
                qualityScore: Math.floor(Math.random() * 30) + 70, // 70-100
            },
        });

        // Create room type for each hotel
        await prisma.roomType.create({
            data: {
                hotelId: hotel.id,
                canonicalName: 'Deluxe King Room',
                roomClass: 'Deluxe',
                maxGuests: 2,
                bedConfiguration: '1 King Bed',
                roomSizeSqft: 350,
            },
        });

        // Create OTA mappings for each hotel
        const partners = ['booking', 'agoda', 'expedia', 'hotelscom'];
        for (const partner of partners) {
            await prisma.otaHotel.create({
                data: {
                    hotelId: hotel.id,
                    otaName: partner,
                    otaHotelId: `${partner}_${hotel.id.substring(0, 8)}`,
                    matchConfidence: 0.95,
                },
            });
        }

        createdCount++;
    }

    console.log(`✅ Created ${createdCount} hotels with room types and OTA mappings`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
