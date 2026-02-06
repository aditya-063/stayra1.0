"use client";

import React from "react";
import { Star, MapPin, Sparkles, Wifi, Coffee, Waves, Car, ArrowRight, Zap, Trophy, ShieldCheck, Map } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const amenityIcons: Record<string, any> = {
    'Wi-Fi': Wifi,
    'Breakfast': Coffee,
    'Infinity Pool': Waves,
    'Pool': Waves,
    'Spa': Sparkles,
    'Parking': Car,
    'Private Beach': Waves,
    'Butler Service': ShieldCheck,
    'Heritage Walk': Trophy,
    'Michelin Dining': Trophy,
    'Casino': Zap,
    'Shopping Mall': Map
};

interface HotelCardProps {
    hotel: any; // Using looser typing for mock integration ease, ideally strictly typed to Schema
    onSelectRooms: (hotel: any) => void;
}

export const HotelCard = ({ hotel, onSelectRooms }: HotelCardProps) => {
    // Find cheapest price across all room options
    const allPrices = hotel.roomOptions?.flatMap((r: any) => r.prices) || [];
    const cheapestPrice = allPrices.length > 0
        ? allPrices.reduce((min: any, p: any) => p.totalPrice < min.totalPrice ? p : min, allPrices[0])
        : null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{
                scale: 1.03,
                y: -10,
                transition: { duration: 0.4, ease: "easeOut" }
            }}
            style={{
                perspective: '2000px',
                transformStyle: 'preserve-3d'
            }}
            className="glass-3d glass-3d-collection flex flex-col lg:flex-row h-full group border-none rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:shadow-[0_50px_100px_-20px_rgba(74,4,78,0.3),0_30px_60px_-30px_rgba(251,191,36,0.4)] cursor-pointer"
            onMouseEnter={(e: any) => {
                e.currentTarget.style.transform = 'translateZ(30px) rotateX(-2deg)';
            }}
            onMouseLeave={(e: any) => {
                e.currentTarget.style.transform = 'translateZ(0px) rotateX(0deg)';
            }}
        >
            {/* Floating Image Section */}
            <div className="lg:w-[45%] relative min-h-[450px] lg:min-h-[550px] p-4 lg:p-6">
                <div className="relative w-full h-full overflow-hidden rounded-[2rem] shadow-2xl">
                    <img
                        src={hotel.primaryImageUrl}
                        alt={hotel.canonicalName}
                        className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-[2.5s] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />

                    <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                        <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 shadow-sm backdrop-blur-md border border-white/20">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-black text-white tracking-wide">{hotel.starRating} Star Luxury</span>
                        </div>
                        {hotel.qualityScore > 0 && (
                            <div className="glass-panel w-10 h-10 rounded-full flex items-center justify-center border border-white/20">
                                <Trophy className="w-4 h-4 text-yellow-200" />
                            </div>
                        )}
                    </div>

                    <div className="absolute bottom-8 left-8 right-8">
                        <p className="text-[10px] text-white/70 uppercase font-black tracking-[0.3em] mb-2">{hotel.country}</p>
                        <h3 className="text-3xl font-black text-white italic tracking-tighter leading-none mb-4">{hotel.canonicalName}</h3>

                        <div className="flex flex-wrap items-center gap-2">
                            {hotel.amenities?.slice(0, 3).map((amenity: string) => {
                                const Icon = amenityIcons[amenity] || Sparkles;
                                return (
                                    <div key={amenity} className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                                        <Icon className="w-3 h-3 text-white/80" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">{amenity}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-10 lg:pl-4 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#4a044e]/5 flex items-center justify-center text-[#4a044e]">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-black text-lg text-[#4a044e] leading-tight">{hotel.city}</h4>
                                <p className="text-xs font-bold text-neutral-400">{hotel.address}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 justify-end text-[#4a044e]">
                                <span className="font-black text-2xl">{hotel.reviewScore}</span>
                                <span className="text-xs font-bold text-neutral-400">/5</span>
                            </div>
                            <p className="text-[10px] font-bold text-neutral-400 text-right">{hotel.reviewCount} Reviews</p>
                        </div>
                    </div>

                    <p className="text-neutral-600 leading-relaxed font-medium text-sm lg:text-base opacity-90 mb-8 line-clamp-3">
                        {hotel.description}
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Price Comparison Mini-View */}
                    <div className="bg-white/40 rounded-2xl p-5 border border-white/60 shadow-sm">
                        <div className="flex items-end justify-between mb-4">
                            <div>
                                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Lowest Online Rate</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-black text-[#4a044e] tracking-tight">
                                        ₹{cheapestPrice?.totalPrice.toLocaleString() || 'N/A'}
                                    </span>
                                    {cheapestPrice && <span className="text-xs font-bold text-neutral-400">via {cheapestPrice.ota}</span>}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wide">
                                    Free Cancellation
                                </span>
                            </div>
                        </div>

                        {/* Other OTAs */}
                        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {allPrices.slice(0, 3).map((price: any, idx: number) => (
                                <div key={idx} className={cn(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold whitespace-nowrap",
                                    price.ota === cheapestPrice?.ota
                                        ? "bg-[#4a044e]/10 border-[#4a044e]/20 text-[#4a044e]"
                                        : "bg-white/30 border-neutral-200 text-neutral-500"
                                )}>
                                    <span>{price.ota}</span>
                                    <span>₹{price.totalPrice.toLocaleString()}</span>
                                </div>
                            ))}
                            {allPrices.length > 3 && (
                                <div className="px-3 py-1.5 text-xs font-bold text-neutral-400">+ {allPrices.length - 3} more</div>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectRooms(hotel)}
                            className="flex-1 bg-[#4a044e] text-white py-4 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-lg shadow-[#4a044e]/20 hover:shadow-xl hover:shadow-[#4a044e]/30 transition-all font-black tracking-widest text-sm"
                        >
                            <span>VIEW ROOMS</span>
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            className="aspect-square bg-yellow-400 text-[#4a044e] rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-yellow-400/20 hover:bg-yellow-300 transition-colors"
                        >
                            <Zap className="w-6 h-6 fill-current" />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
