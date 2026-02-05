import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { hotelId: string } }
) {
    try {
        const { hotelId } = params;

        const hotel = await prisma.hotel.findUnique({
            where: { id: hotelId },
            include: {
                roomTypes: {
                    include: {
                        rates: {
                            orderBy: {
                                basePrice: 'asc',
                            },
                            take: 50,
                        },
                    },
                },
                images: true,
                amenities: {
                    include: {
                        amenity: true,
                    },
                },
            },
        });

        if (!hotel) {
            return NextResponse.json(
                { error: 'Hotel not found' },
                { status: 404 }
            );
        }

        // Aggregate rates by partner
        const allRates = hotel.roomTypes.flatMap((rt) => rt.rates);
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
                    availability: rate.availability,
                    deeplink: `/api/partners/${rate.otaName}/redirect/${hotel.id}`,
                };
            }
        });

        const offers = Object.values(offersByPartner).sort((a, b) => a.price - b.price);

        return NextResponse.json({
            hotelId: hotel.id,
            name: hotel.canonicalName,
            slug: hotel.slug,
            rating: Number(hotel.reviewScore) || 4.0,
            reviewCount: hotel.reviewCount || 0,
            starRating: hotel.starRating,
            city: hotel.city,
            country: hotel.country,
            address: hotel.address,
            description: hotel.description,
            propertyType: hotel.propertyType,
            primaryImage: hotel.primaryImageUrl || '/images/hotel-placeholder.jpg',
            images: hotel.images.map((img) => ({
                url: img.imageUrl,
                isPrimary: img.isPrimary,
            })),
            amenities: hotel.amenities.map((ha) => ha.amenity.name),
            offers,
            lowestPrice: offers.length > 0 ? offers[0].price : null,
        });
    } catch (error) {
        console.error('Hotel details error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hotel details' },
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
