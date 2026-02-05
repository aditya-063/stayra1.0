import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

interface SearchParams {
    city?: string;
    checkin?: string;
    checkout?: string;
    guests?: string;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const city = searchParams.get('city') || '';
        const checkin = searchParams.get('checkin') || '';
        const checkout = searchParams.get('checkout') || '';
        const guests = parseInt(searchParams.get('guests') || '2');

        if (!city) {
            return NextResponse.json(
                { error: 'City parameter is required' },
                { status: 400 }
            );
        }

        // Parse dates
        const checkinDate = checkin ? new Date(checkin) : new Date();
        const checkoutDate = checkout
            ? new Date(checkout)
            : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // +3 days

        // Search hotels in the city
        const hotels = await prisma.hotel.findMany({
            where: {
                city: {
                    contains: city,
                    mode: 'insensitive',
                },
            },
            include: {
                roomTypes: {
                    include: {
                        rates: {
                            where: {
                                checkin: {
                                    gte: checkinDate,
                                    lte: new Date(checkinDate.getTime() + 7 * 24 * 60 * 60 * 1000),
                                },
                            },
                            orderBy: {
                                basePrice: 'asc',
                            },
                        },
                    },
                },
            },
            take: 20,
        });

        // Format response
        const results = hotels.map((hotel) => {
            const allRates = hotel.roomTypes.flatMap((rt) => rt.rates);

            // Group rates by partner
            const offersByPartner: Record<string, any> = {};
            allRates.forEach((rate) => {
                if (!offersByPartner[rate.otaName] || rate.basePrice < offersByPartner[rate.otaName].price) {
                    offersByPartner[rate.otaName] = {
                        partner: rate.otaName,
                        partnerName: getPartnerDisplayName(rate.otaName),
                        roomType: 'Deluxe King Room',
                        price: Number(rate.basePrice),
                        currency: rate.currency,
                        taxes: Number(rate.taxes || 0),
                        totalPrice: Number(rate.basePrice) + Number(rate.taxes || 0),
                        cancellation: rate.refundable
                            ? 'Free cancellation'
                            : 'Non-refundable',
                        refundable: rate.refundable,
                        deeplink: `/api/partners/${rate.otaName}/redirect/${hotel.id}`,
                    };
                }
            });

            const offers = Object.values(offersByPartner);
            const lowestOffer = offers.length > 0
                ? offers.reduce((min, offer) => (offer.price < min.price ? offer : min))
                : null;

            return {
                hotelId: hotel.id,
                name: hotel.canonicalName,
                slug: hotel.slug,
                rating: Number(hotel.reviewScore) || 4.0,
                reviewCount: hotel.reviewCount || 0,
                starRating: hotel.starRating,
                city: hotel.city,
                country: hotel.country,
                primaryImage: hotel.primaryImageUrl || '/images/hotel-placeholder.jpg',
                description: hotel.description,
                propertyType: hotel.propertyType,
                lowestPrice: lowestOffer
                    ? {
                        amount: lowestOffer.price,
                        currency: lowestOffer.currency,
                        partner: lowestOffer.partner,
                    }
                    : null,
                offers: offers.sort((a, b) => a.price - b.price), // Sort by price low to high
            };
        });

        // Sort hotels by lowest price
        results.sort((a, b) => {
            if (!a.lowestPrice) return 1;
            if (!b.lowestPrice) return -1;
            return a.lowestPrice.amount - b.lowestPrice.amount;
        });

        return NextResponse.json({
            searchId: `s_${Date.now()}`,
            city,
            checkin: checkinDate.toISOString().split('T')[0],
            checkout: checkoutDate.toISOString().split('T')[0],
            guests,
            count: results.length,
            hotels: results,
        });
    } catch (error) {
        console.error('Hotel search error:', error);
        return NextResponse.json(
            { error: 'Failed to search hotels' },
            { status: 500 }
        );
    }
}

function getPartnerDisplayName(partnerId: string): string {
    const names: Record<string, string> = {
        booking: 'Booking.com',
        agoda: 'Agoda',
        expedia: 'Expedia',
        hotelscom: 'Hotels.com',
    };
    return names[partnerId] || partnerId;
}
