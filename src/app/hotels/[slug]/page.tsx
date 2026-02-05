'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, ArrowLeft, ExternalLink, CheckCircle, XCircle, Users, Home } from 'lucide-react';

interface HotelOffer {
    partner: string;
    partnerName: string;
    roomType: string;
    price: number;
    currency: string;
    taxes: number;
    totalPrice: number;
    cancellation: string;
    refundable: boolean;
    availability?: number;
    deeplink: string;
}

interface HotelDetails {
    hotelId: string;
    name: string;
    slug: string;
    rating: number;
    reviewCount: number;
    starRating: number;
    city: string;
    country: string;
    address?: string;
    description: string;
    propertyType: string;
    primaryImage: string;
    images: Array<{ url: string; isPrimary: boolean }>;
    amenities: string[];
    offers: HotelOffer[];
    lowestPrice: number | null;
}

export default function HotelDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [hotel, setHotel] = useState<HotelDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (slug) {
            fetchHotelBySlug();
        }
    }, [slug]);

    async function fetchHotelBySlug() {
        setLoading(true);
        setError('');

        try {
            // First, we need to get the hotel ID from the slug
            // For now, we'll fetch all hotels and find by slug
            // In production, you'd have a dedicated API endpoint
            const response = await fetch(`/api/hotels/search?city=${slug.split('-').pop()}`);
            if (!response.ok) throw new Error('Hotel not found');

            const data = await response.json();
            const hotelMatch = data.hotels.find((h: any) => h.slug === slug);

            if (!hotelMatch) {
                setError('Hotel not found');
                setLoading(false);
                return;
            }

            // Fetch detailed hotel info
            const detailResponse = await fetch(`/api/hotels/${hotelMatch.hotelId}`);
            if (!detailResponse.ok) throw new Error('Failed to fetch hotel details');

            const detailData = await detailResponse.json();
            setHotel(detailData);
        } catch (err) {
            setError('Failed to load hotel details. Please try again.');
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                    <p>Loading hotel details...</p>
                </div>
            </div>
        );
    }

    if (error || !hotel) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center p-4">
                <div className="text-center text-white">
                    <Home className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h1 className="text-2xl font-bold mb-2">Hotel Not Found</h1>
                    <p className="text-purple-200 mb-6">{error || 'The hotel you are looking for does not exist.'}</p>
                    <Link
                        href="/"
                        className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur rounded-lg transition"
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
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 text-white hover:text-purple-200 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Results
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Hotel Header */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-6">
                    <div className="flex items-start justify-between flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-white mb-2">{hotel.name}</h1>
                            <div className="flex items-center gap-4 text-sm text-purple-200 mb-2">
                                <span className="flex items-center gap-1">
                                    {'⭐'.repeat(hotel.starRating || 0)} {hotel.starRating}-Star
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    {hotel.rating.toFixed(1)} ({hotel.reviewCount} reviews)
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {hotel.city}, {hotel.country}
                                </span>
                            </div>
                            {hotel.address && (
                                <p className="text-white/70 text-sm mb-3">{hotel.address}</p>
                            )}
                            <p className="text-white/90 text-sm">{hotel.description}</p>
                        </div>
                        {hotel.lowestPrice && (
                            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-4 border-2 border-yellow-400 min-w-[180px]">
                                <p className="text-xs text-purple-200 mb-1 text-center">From</p>
                                <div className="text-3xl font-bold text-white text-center">
                                    {hotel.offers[0]?.currency} {hotel.lowestPrice.toFixed(0)}
                                </div>
                                <p className="text-xs text-purple-200 text-center mt-1">per night</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Amenities */}
                {hotel.amenities && hotel.amenities.length > 0 && (
                    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-6">
                        <h2 className="text-xl font-bold text-white mb-4">Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {hotel.amenities.map((amenity, index) => (
                                <div key={index} className="flex items-center gap-2 text-white text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                    {amenity}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price Comparison Table */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
                    <h2 className="text-2xl font-bold text-white mb-4">
                        Compare Prices from {hotel.offers.length} Partners
                    </h2>
                    <p className="text-purple-200 text-sm mb-6">
                        All prices are for the same room type. Click "View Deal" to book on the partner site.
                    </p>

                    {/* Desktop Table */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-3 px-4 text-white font-semibold">Partner</th>
                                    <th className="text-left py-3 px-4 text-white font-semibold">Room Type</th>
                                    <th className="text-right py-3 px-4 text-white font-semibold">Base Price</th>
                                    <th className="text-right py-3 px-4 text-white font-semibold">Taxes</th>
                                    <th className="text-right py-3 px-4 text-white font-semibold">Total</th>
                                    <th className="text-center py-3 px-4 text-white font-semibold">Cancellation</th>
                                    <th className="text-center py-3 px-4 text-white font-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hotel.offers.map((offer, index) => (
                                    <tr
                                        key={offer.partner}
                                        className={`border-b border-white/10 hover:bg-white/5 transition ${index === 0 ? 'bg-green-500/10' : ''
                                            }`}
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl">{getPartnerLogo(offer.partner)}</span>
                                                <span className="text-white font-medium">{offer.partnerName}</span>
                                                {index === 0 && (
                                                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                                                        Best Price
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-purple-200">{offer.roomType}</td>
                                        <td className="py-3 px-4 text-right text-white font-semibold">
                                            {offer.currency} {offer.price.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 text-right text-purple-200">
                                            {offer.currency} {offer.taxes.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 text-right text-white font-bold text-lg">
                                            {offer.currency} {offer.totalPrice.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                {offer.refundable ? (
                                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-400" />
                                                )}
                                                <span className="text-xs text-purple-200">
                                                    {offer.refundable ? 'Free' : 'Non-refundable'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <a
                                                href={offer.deeplink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg transition font-medium"
                                            >
                                                View Deal
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                        {hotel.offers.map((offer, index) => (
                            <div
                                key={offer.partner}
                                className={`bg-white/5 backdrop-blur border border-white/20 rounded-lg p-4 ${index === 0 ? 'ring-2 ring-green-400' : ''
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{getPartnerLogo(offer.partner)}</span>
                                        <span className="text-white font-medium">{offer.partnerName}</span>
                                    </div>
                                    {index === 0 && (
                                        <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">
                                            Best Price
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2 mb-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-purple-200">Base Price:</span>
                                        <span className="text-white font-semibold">
                                            {offer.currency} {offer.price.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-purple-200">Taxes:</span>
                                        <span className="text-white">
                                            {offer.currency} {offer.taxes.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-lg border-t border-white/20 pt-2">
                                        <span className="text-white font-semibold">Total:</span>
                                        <span className="text-white font-bold">
                                            {offer.currency} {offer.totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {offer.refundable ? (
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-400" />
                                        )}
                                        <span className="text-xs text-purple-200">
                                            {offer.refundable ? 'Free cancellation' : 'Non-refundable'}
                                        </span>
                                    </div>
                                    <a
                                        href={offer.deeplink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        View Deal
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Savings Info */}
                    {hotel.offers.length > 1 && (
                        <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                            <p className="text-green-400 text-center">
                                💰 You could save up to{' '}
                                <span className="font-bold">
                                    {hotel.offers[0]?.currency}{' '}
                                    {(
                                        hotel.offers[hotel.offers.length - 1]?.totalPrice -
                                        hotel.offers[0]?.totalPrice
                                    ).toFixed(2)}
                                </span>{' '}
                                by choosing the best deal!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
