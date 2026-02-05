'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Star, MapPin, TrendingUp } from 'lucide-react';

interface HotelOffer {
    partner: string;
    partnerName: string;
    price: number;
    currency: string;
    totalPrice: number;
    cancellation: string;
    refundable: boolean;
    deeplink: string;
}

interface Hotel {
    hotelId: string;
    name: string;
    slug: string;
    rating: number;
    reviewCount: number;
    starRating: number;
    city: string;
    country: string;
    description: string;
    primaryImage: string;
    propertyType: string;
    lowestPrice: {
        amount: number;
        currency: string;
        partner: string;
    } | null;
    offers: HotelOffer[];
}

interface SearchResponse {
    searchId: string;
    city: string;
    checkin: string;
    checkout: string;
    guests: number;
    count: number;
    hotels: Hotel[];
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const city = searchParams.get('city') || '';
    const checkin = searchParams.get('checkin') || '';
    const checkout = searchParams.get('checkout') || '';
    const guests = searchParams.get('guests') || '2';

    const [results, setResults] = useState<SearchResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (city) {
            searchHotels();
        }
    }, [city, checkin, checkout, guests]);

    async function searchHotels() {
        setLoading(true);
        setError('');

        try {
            const params = new URLSearchParams({
                city,
                ...(checkin && { checkin }),
                ...(checkout && { checkout }),
                ...(guests && { guests }),
            });

            const response = await fetch(`/api/hotels/search?${params}`);
            if (!response.ok) throw new Error('Search failed');

            const data = await response.json();
            setResults(data);
        } catch (err) {
            setError('Failed to search hotels. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const getPartnerLogo = (partnerId: string) => {
        const logos: Record<string, string> = {
            booking: '🏨',
            agoda: '🌐',
            expedia: '✈️',
            hotelscom: '🏢',
        };
        return logos[partnerId] || '🏨';
    };

    if (!city) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
                <div className="text-center text-white">
                    <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h1 className="text-2xl font-bold mb-2">No Search Query</h1>
                    <p className="text-purple-200">Please start a search from the home page.</p>
                    <Link
                        href="/"
                        className="inline-block mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg transition"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
            {/* Header */}
            <div className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-2xl font-bold text-white">
                            Stayra
                        </Link>
                        <div className="text-white text-sm">
                            {results && <span>{results.count} hotels found</span>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search Summary */}
                <div className="mb-6 bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                    <div className="flex items-center gap-4 text-white flex-wrap">
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5" />
                            <span className="font-semibold">{city}</span>
                        </div>
                        {checkin && checkout && (
                            <div className="text-sm text-purple-200">
                                {new Date(checkin).toLocaleDateString()} → {new Date(checkout).toLocaleDateString()}
                            </div>
                        )}
                        <div className="text-sm text-purple-200">{guests} guests</div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                        <p className="text-white mt-4">Searching hotels...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/20 backdrop-blur border border-red-500/50 rounded-lg p-4 text-white">
                        {error}
                    </div>
                )}

                {/* Results */}
                {!loading && results && results.hotels.length === 0 && (
                    <div className="text-center py-12 text-white">
                        <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h2 className="text-2xl font-bold mb-2">No Hotels Found</h2>
                        <p className="text-purple-200">Try searching for a different city.</p>
                    </div>
                )}

                {!loading && results && results.hotels.length > 0 && (
                    <div className="space-y-4">
                        {results.hotels.map((hotel) => (
                            <div
                                key={hotel.hotelId}
                                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition"
                            >
                                <div className="p-6">
                                    <div className="flex gap-6 flex-col md:flex-row">
                                        {/* Hotel Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-1">
                                                        {hotel.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 text-sm text-purple-200">
                                                        <span className="flex items-center gap-1">
                                                            {'⭐'.repeat(hotel.starRating || 0)}
                                                        </span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                            {hotel.rating.toFixed(1)}
                                                        </span>
                                                        <span>•</span>
                                                        <span>{hotel.reviewCount} reviews</span>
                                                    </div>
                                                    <p className="text-purple-100 text-sm mt-1">{hotel.propertyType}</p>
                                                </div>
                                            </div>

                                            <p className="text-white/80 text-sm mb-4 line-clamp-2">
                                                {hotel.description}
                                            </p>

                                            {/* Partner Offers */}
                                            <div className="space-y-2">
                                                <p className="text-sm font-semibold text-white mb-2">
                                                    Compare prices from {hotel.offers.length} partners:
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                                                    {hotel.offers.slice(0, 4).map((offer) => (
                                                        <a
                                                            key={offer.partner}
                                                            href={offer.deeplink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="bg-white/5 hover:bg-white/10 backdrop-blur border border-white/20 rounded-lg p-3 transition group"
                                                        >
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-lg">{getPartnerLogo(offer.partner)}</span>
                                                                <span className="text-xs text-purple-200">
                                                                    {offer.partnerName}
                                                                </span>
                                                            </div>
                                                            <div className="text-white font-bold text-lg">
                                                                {offer.currency} {offer.price.toFixed(0)}
                                                            </div>
                                                            <div className="text-xs text-purple-200">
                                                                {offer.refundable ? '✓ Free cancellation' : 'Non-refundable'}
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lowest Price CTA */}
                                        {hotel.lowestPrice && (
                                            <div className="md:w-48 flex flex-col justify-center">
                                                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-4 text-center border-2 border-yellow-400">
                                                    <p className="text-xs text-purple-200 mb-1 flex items-center justify-center gap-1">
                                                        <TrendingUp className="w-3 h-3" />
                                                        Best Deal
                                                    </p>
                                                    <div className="text-3xl font-bold text-white mb-1">
                                                        {hotel.lowestPrice.currency} {hotel.lowestPrice.amount.toFixed(0)}
                                                    </div>
                                                    <p className="text-xs text-purple-200 mb-3">per night</p>
                                                    <Link
                                                        href={`/hotels/${hotel.slug}`}
                                                        className="block w-full bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-bold py-2 px-4 rounded-lg transition"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
