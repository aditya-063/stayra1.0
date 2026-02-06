'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { FlowingWaveBackground } from '@/components/FlowingWaveBackground';
import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, ExternalLink, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Booking {
    id: string;
    hotelName: string;
    city: string;
    checkIn: string;
    checkOut: string;
    partner: string;
    price: number;
    status: string;
    bookedAt: string;
}

export default function BookingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            // For now, use mock data since we don't have bookings table yet
            // In production, this would call /api/bookings
            setBookings([]);
            setLoading(false);
        } catch (err) {
            console.error('Failed to load bookings:', err);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen relative">
                <Navbar />
                <div className="pt-40 flex justify-center">
                    <div className="w-12 h-12 border-4 border-[#4a044e]/20 border-t-[#4a044e] rounded-full animate-spin" />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen relative pb-32 bg-gradient-to-br from-amber-50/30 via-yellow-50/30 to-orange-50/30">
            <FlowingWaveBackground />
            <Navbar />

            <section className="relative pt-40 pb-20 px-4">
                <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-[#4a044e]/5 to-transparent pointer-events-none" />

                <div className="max-w-5xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4 mb-12"
                    >
                        <h1 className="text-5xl md:text-6xl font-black text-neutral-900 tracking-tighter leading-[0.9]">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a044e] via-[#a21caf] to-[#4a044e] animate-gradient">Bookings</span>
                        </h1>
                        <p className="text-lg text-neutral-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            View and manage your hotel reservations
                        </p>
                    </motion.div>

                    {bookings.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-3d rounded-[3rem] overflow-hidden p-12 md:p-16 text-center relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4a044e] to-yellow-400" />

                            <Calendar className="w-20 h-20 text-neutral-300 mx-auto mb-6" />
                            <h2 className="text-3xl font-black text-neutral-900 mb-3">No Bookings Yet</h2>
                            <p className="text-neutral-500 font-medium mb-8 max-w-md mx-auto">
                                Start exploring and book your perfect stay across all platforms
                            </p>
                            <button
                                onClick={() => router.push('/')}
                                className="bg-gradient-to-r from-[#4a044e] to-[#701a75] hover:shadow-xl text-white font-black h-14 px-8 rounded-2xl transition-all inline-flex items-center gap-2 shadow-md"
                            >
                                <Search className="w-5 h-5" />
                                Search Hotels
                            </button>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {bookings.map((booking, index) => (
                                <motion.div
                                    key={booking.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="glass-3d rounded-[3rem] overflow-hidden p-6 md:p-8 hover:shadow-xl transition-all relative group"
                                >
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4a044e] to-yellow-400" />

                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-black text-[#4a044e] mb-3">{booking.hotelName}</h3>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600 font-medium">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4" />
                                                    {booking.city}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4" />
                                                    ${booking.price.toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center  gap-2">
                                                <span className="text-xs bg-gradient-to-r from-[#4a044e] to-[#701a75] text-white px-3 py-1 rounded-full font-black">
                                                    {booking.partner}
                                                </span>
                                                <span className={`text-xs px-3 py-1 rounded-full font-black ${booking.status === 'confirmed'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>
                                        <button className="bg-white/50 backdrop-blur-md hover:bg-white/70 border border-white/60 font-black h-12 px-6 rounded-2xl transition-all inline-flex items-center gap-2 shadow-sm text-neutral-800">
                                            View Details
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
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
