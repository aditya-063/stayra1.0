'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { FlowingWaveBackground } from '@/components/FlowingWaveBackground';
import { motion } from 'framer-motion';
import { Search, Star, MapPin, TrendingUp, Calendar, Users } from 'lucide-react';

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
            <main className="min-h-screen relative">
                <Navbar />
                <div className="pt-40 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-3d rounded-[3rem] overflow-hidden p-12 md:p-16 text-center relative max-w-md"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4a044e] to-yellow-400" />
                        <Search className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                        <h1 className="text-2xl font-black text-[#4a044e] mb-2">No Search Query</h1>
                        <p className="text-neutral-500 font-medium mb-6">Please start a search from the home page.</p>
                        <Link
                            href="/"
                            className="bg-gradient-to-r from-[#4a044e] to-[#701a75] hover:shadow-xl text-white font-black h-12 px-6 rounded-2xl transition-all inline-flex items-center gap-2 shadow-md"
                        >
                            Go Home
                        </Link>
                    </motion.div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen relative pb-32">
            <Navbar />

            <section className="relative pt-40 pb-20 px-4">
                <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-[#4a044e]/5 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Search Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4 mb-8"
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tighter leading-[0.9]">
                            Hotels in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a044e] via-[#a21caf] to-[#4a044e] animate-gradient">{city}</span>
                        </h1>
                        {results && (
                            <p className="text-lg text-neutral-500 font-medium">
                                {results.count} {results.count === 1 ? 'hotel' : 'hotels'} found
                            </p>
                        )}
                    </motion.div>

                    {/* Search Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-3d rounded-2xl p-4 mb-8 relative overflow-hidden"
                    >
                        <div className="flex items-center gap-6 text-neutral-600 flex-wrap font-medium">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#4a044e]" />
                                <span className="font-black">{city}</span>
                            </div>
                            {checkin && checkout && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-[#4a044e]" />
                                    <span>{new Date(checkin).toLocaleDateString()} → {new Date(checkout).toLocaleDateString()}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-[#4a044e]" />
                                <span>{guests} guests</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-[#4a044e]/20 border-t-[#4a044e] rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-neutral-500 font-bold">Scanning 50+ OTAs...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold mb-6"
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Empty Results */}
                    {!loading && results && results.hotels.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-3d rounded-[3rem] overflow-hidden p-12 md:p-16 text-center relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4a044e] to-yellow-400" />
                            <Search className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                            <h2 className="text-2xl font-black text-neutral-900 mb-2">No Hotels Found</h2>
                            <p className="text-neutral-500 font-medium mb-6">Try searching for a different city.</p>
                            <Link
                                href="/"
                                className="bg-gradient-to-r from-[#4a044e] to-[#701a75] hover:shadow-xl text-white font-black h-12 px-6 rounded-2xl transition-all inline-flex items-center gap-2 shadow-md"
                            >
                                New Search
                            </Link>
                        </motion.div>
                    )}

                    {/* Results */}
                    {!loading && results && results.hotels.length > 0 && (
                        <div className="space-y-6">
                            {results.hotels.map((hotel, index) => (
                                <motion.div
                                    key={hotel.hotelId}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1, duration: 0.5, ease: "backOut" }}
                                    className="glass-3d rounded-[3rem] overflow-hidden p-6 md:p-8 relative hover:shadow-xl transition-all group"
                                >
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4a044e] to-yellow-400" />

                                    <div className="flex gap-6 flex-col lg:flex-row">
                                        {/* Hotel Info */}
                                        <div className="flex-1">
                                            <div className="mb-3">
                                                <h3 className="text-2xl font-black text-[#4a044e] mb-2">{hotel.name}</h3>
                                                <div className="flex items-center gap-3 text-sm text-neutral-600 font-medium flex-wrap">
                                                    <span className="flex items-center gap-1">
                                                        {'⭐'.repeat(hotel.starRating || 0)} {hotel.starRating}-Star
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        {hotel.rating.toFixed(1)} ({hotel.reviewCount} reviews)
                                                    </span>
                                                    <span>•</span>
                                                    <span className="font-black">{hotel.propertyType}</span>
                                                </div>
                                            </div>

                                            <p className="text-neutral-600 text-sm mb-4 line-clamp-2 font-medium">
                                                {hotel.description}
                                            </p>

                                            {/* Partner Offers */}
                                            <div className="space-y-3">
                                                <p className="text-sm font-black text-neutral-800">
                                                    Compare {hotel.offers.length} partner prices:
                                                </p>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                    {hotel.offers.slice(0, 4).map((offer, idx) => (
                                                        <a
                                                            key={offer.partner}
                                                            href={offer.deeplink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`bg-white/50 hover:bg-white/70 backdrop-blur border border-white/60 rounded-2xl p-3 transition-all group/card ${idx === 0 ? 'ring-2 ring-green-500' : ''
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className="text-xl">{getPartnerLogo(offer.partner)}</span>
                                                                {idx === 0 && (
                                                                    <span className="text-[9px] bg-green-500 text-white px-2 py-0.5 rounded font-black">
                                                                        BEST
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-[#4a044e] font-black text-lg">
                                                                {offer.currency} {offer.price.toFixed(0)}
                                                            </div>
                                                            <div className="text-xs text-neutral-500 font-medium">
                                                                {offer.refundable ? '✓ Refundable' : 'Non-refundable'}
                                                            </div>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Lowest Price CTA */}
                                        {hotel.lowestPrice && (
                                            <div className="lg:w-52 flex flex-col justify-center">
                                                <div className="bg-gradient-to-br from-[#4a044e] to-[#701a75] rounded-2xl p-6 text-center border-2 border-yellow-400 shadow-lg">
                                                    <p className="text-xs text-purple-200 mb-2 flex items-center justify-center gap-1 font-black uppercase tracking-wider">
                                                        <TrendingUp className="w-3 h-3" />
                                                        Best Deal
                                                    </p>
                                                    <div className="text-4xl font-black text-white mb-1">
                                                        {hotel.lowestPrice.currency} {hotel.lowestPrice.amount.toFixed(0)}
                                                    </div>
                                                    <p className="text-xs text-purple-200 mb-4 font-medium">per night</p>
                                                    <Link
                                                        href={`/hotels/${hotel.slug}`}
                                                        className="block w-full bg-yellow-400 hover:bg-yellow-500 text-[#4a044e] font-black py-3 px-4 rounded-xl transition shadow-md"
                                                    >
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
