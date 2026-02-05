import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(
    request: Request,
    { params }: { params: { partnerId: string; hotelId: string } }
) {
    try {
        const { partnerId, hotelId } = params;

        // Log click for analytics
        const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
        const userAgent = request.headers.get('user-agent') || '';

        await logClick(hotelId, partnerId, clientIp, userAgent);

        // Get hotel info
        const hotel = await prisma.hotel.findUnique({
            where: { id: hotelId },
        });

        if (!hotel) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // Get partner redirect URL
        const redirectUrl = await getPartnerRedirectUrl(partnerId, hotelId, hotel.slug);

        return NextResponse.redirect(redirectUrl, 302);
    } catch (error) {
        console.error('Redirect error:', error);
        return NextResponse.redirect(new URL('/', request.url));
    }
}

async function logClick(
    hotelId: string,
    partner: string,
    ip: string,
    userAgent: string
) {
    try {
        const device = userAgent.includes('Mobile') ? 'mobile' : 'desktop';

        await prisma.click.create({
            data: {
                hotelId,
                ota: partner,
                affiliateLink: '/', // Placeholder
                ip,
                device,
            },
        });
    } catch (error) {
        console.error('Failed to log click:', error);
    }
}

async function getPartnerRedirectUrl(
    partnerId: string,
    hotelId: string,
    hotelSlug: string
): Promise<string> {
    // PHASE 1: Mock redirects (current)
    // Later: Replace with real affiliate links

    const mockUrls: Record<string, string> = {
        booking: `https://www.booking.com/hotel/search.html?ss=${encodeURIComponent(hotelSlug)}`,
        agoda: `https://www.agoda.com/search?city=${encodeURIComponent(hotelSlug)}`,
        expedia: `https://www.expedia.com/Hotel-Search?destination=${encodeURIComponent(hotelSlug)}`,
        hotelscom: `https://www.hotels.com/search.do?q-destination=${encodeURIComponent(hotelSlug)}`,
    };

    return mockUrls[partnerId] || 'https://www.google.com/search?q=hotel+booking';
}

// PHASE 2: Real affiliate links (future)
// async function getRealPartnerUrl(partnerId: string, hotelId: string): Promise<string> {
//   const otaMapping = await prisma.otaHotel.findFirst({
//     where: { hotelId, otaName: partnerId }
//   });
//
//   if (!otaMapping) return getFallbackUrl(partnerId);
//
//   return buildAffiliateLink(partnerId, otaMapping.otaHotelId);
// }
//
// function buildAffiliateLink(partnerId: string, otaHotelId: string): string {
//   const affiliateIds: Record<string, string> = {
//     booking: 'YOUR_BOOKING_AFFILIATE_ID',
//     agoda: 'YOUR_AGODA_AFFILIATE_ID',
//     // ... etc
//   };
//
//   // Build real affiliate URL with tracking
//   return `https://www.${partnerId}.com/hotel/${otaHotelId}?aid=${affiliateIds[partnerId]}`;
// }
