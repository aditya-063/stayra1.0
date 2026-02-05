import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/destinations?q={query}
 * Search worldwide destinations with autocomplete
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q') || '';

        // If no query, return popular destinations
        if (!query || query.length < 2) {
            const popularDestinations = await prisma.destination.findMany({
                where: { isPopular: true },
                take: 10,
                orderBy: { population: 'desc' },
            });

            return NextResponse.json({
                success: true,
                destinations: popularDestinations,
            });
        }

        // Search destinations by city or country
        const destinations = await prisma.destination.findMany({
            where: {
                OR: [
                    { city: { contains: query, mode: 'insensitive' } },
                    { country: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: 10,
            orderBy: [
                // Prioritize popular destinations
                { isPopular: 'desc' },
                // Then by population (larger cities first)
                { population: 'desc' },
            ],
        });

        return NextResponse.json({
            success: true,
            destinations,
        });
    } catch (error) {
        console.error('Destination search error:', error);
        return NextResponse.json(
            { error: 'An error occurred while searching destinations' },
            { status: 500 }
        );
    }
}
