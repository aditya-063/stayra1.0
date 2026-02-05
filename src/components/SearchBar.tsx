"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, Calendar, Users, Zap, Map, Sparkles, ChevronLeft, ChevronRight, Minus, Plus, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isWithinInterval, startOfWeek, endOfWeek, addDays, isBefore } from "date-fns";

interface Destination {
    id: number;
    city: string;
    country: string;
    region?: string;
    isPopular: boolean;
}

interface SearchBarProps {
    onSearch: (data: any) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [query, setQuery] = useState("");
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loadingDestinations, setLoadingDestinations] = useState(false);

    // Dropdown States
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showGuestPicker, setShowGuestPicker] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Refs for clicking outside
    const suggestionRef = useRef<HTMLDivElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const guestPickerRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);

    // Filter Logic States
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date | undefined }>({
        from: addDays(new Date(), 1),
        to: addDays(new Date(), 6)
    });
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [guestConfig, setGuestConfig] = useState({
        adults: 2,
        children: 0,
        rooms: 1
    });

    const [filters, setFilters] = useState({
        priceRange: [0, 50000],
        stars: [] as number[],
        amenities: [] as string[]
    });

    // Debounced destination search
    const fetchDestinations = useCallback(async (searchQuery: string) => {
        if (searchQuery.length < 2) {
            // Fetch popular destinations for empty or short queries
            try {
                setLoadingDestinations(true);
                const response = await fetch(`/api/destinations?q=`);
                const data = await response.json();
                if (data.success) {
                    setDestinations(data.destinations);
                }
            } catch (error) {
                console.error('Failed to fetch popular destinations:', error);
            } finally {
                setLoadingDestinations(false);
            }
            return;
        }

        try {
            setLoadingDestinations(true);
            const response = await fetch(`/api/destinations?q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            if (data.success) {
                setDestinations(data.destinations);
            }
        } catch (error) {
            console.error('Failed to fetch destinations:', error);
        } finally {
            setLoadingDestinations(false);
        }
    }, []);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (showSuggestions) {
                fetchDestinations(query);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, showSuggestions, fetchDestinations]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) setShowSuggestions(false);
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) setShowDatePicker(false);
            if (guestPickerRef.current && !guestPickerRef.current.contains(event.target as Node)) setShowGuestPicker(false);
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) setShowFilters(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSuggestionClick = (city: string) => {
        setQuery(city);
        setShowSuggestions(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch({
            location: query,
            checkIn: dateRange.from,
            checkOut: dateRange.to,
            guests: guestConfig,
            rooms: guestConfig.rooms,
            filters
        });
    };

    // Calendar Helpers
    const generateCalendarDays = () => {
        const start = startOfWeek(startOfMonth(currentMonth));
        const end = endOfWeek(endOfMonth(currentMonth));
        return eachDayOfInterval({ start, end });
    };

    const handleDateClick = (day: Date) => {
        if (!dateRange.from || (dateRange.from && dateRange.to)) {
            // New range start
            setDateRange({ from: day, to: undefined });
        } else {
            // Range end
            if (isBefore(day, dateRange.from)) {
                setDateRange({ from: day, to: dateRange.from });
            } else {
                setDateRange({ ...dateRange, to: day });
                setShowDatePicker(false); // Close on complete selection
            }
        }
    };

    const toggleFilter = (type: 'stars' | 'amenities', value: any) => {
        setFilters(prev => {
            const list = prev[type] as any[];
            if (list.includes(value)) {
                return { ...prev, [type]: list.filter(i => i !== value) };
            }
            return { ...prev, [type]: [...list, value] };
        });
    };

    return (
        <div className="w-full max-w-7xl mx-auto relative px-4 z-50">
            <motion.form
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                onSubmit={handleSearch}
                className={cn(
                    "glass-3d glass-3d-main p-3 md:p-5 flex flex-col lg:flex-row gap-4 shadow-[0_40px_80px_-20px_rgba(71,0,71,0.4)] transition-all duration-700 rounded-[2.5rem] !overflow-visible",
                    isFocused ? "ring-2 ring-white/20 scale-[1.01]" : ""
                )}
            >
                {/* Location Input */}
                <div className="flex-[2] relative" ref={suggestionRef}>
                    <div className="flex items-center gap-4 bg-white/10 p-5 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all h-full">
                        <MapPin className="text-white w-6 h-6 ml-2 shrink-0" />
                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-0.5">Where to?</span>
                            <input
                                type="text"
                                placeholder="City, landmark, or hotel..."
                                className="bg-transparent border-none focus:ring-0 p-0 text-white font-bold placeholder:text-white/30 w-full text-lg outline-none"
                                value={query}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => {
                                    setIsFocused(true);
                                    setShowSuggestions(true);
                                }}
                                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                        {showSuggestions && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-[110%] left-0 right-0 glass-3d-main rounded-[2rem] shadow-2xl border border-white/10 p-4 z-[60] overflow-hidden"
                            >
                                <div className="flex items-center gap-3 px-4 py-2 mb-2 border-b border-white/5">
                                    <Sparkles className="w-4 h-4 text-gold-metallic" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">
                                        {query.length < 2 ? 'Popular Destinations' : 'Destinations'}
                                    </span>
                                    {loadingDestinations && (
                                        <div className="ml-auto">
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto">
                                    {destinations.length === 0 && !loadingDestinations ? (
                                        <div className="text-center py-8 text-white/40 text-sm">
                                            No destinations found
                                        </div>
                                    ) : (
                                        destinations.map((item, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleSuggestionClick(item.city)}
                                                className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/10 transition-colors text-left group"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                                    <Map className="w-5 h-5 text-white/40 group-hover:text-white" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-white">{item.city}</span>
                                                    <span className="text-[10px] font-bold text-white/40">{item.country}</span>
                                                </div>
                                                {item.isPopular && (
                                                    <div className="ml-auto">
                                                        <span className="text-[8px] font-black uppercase tracking-wider text-gold-metallic bg-gold-metallic/10 px-2 py-1 rounded-full">
                                                            Popular
                                                        </span>
                                                    </div>
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Date Picker */}
                <div className="flex-[1.5] relative" ref={datePickerRef}>
                    <button
                        type="button"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="w-full flex items-center gap-4 bg-white/10 p-5 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all h-full text-left"
                    >
                        <Calendar className="text-white w-6 h-6 ml-2 shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-0.5">Dates</span>
                            <span className="text-base font-bold text-white truncate">
                                {dateRange.from ? format(dateRange.from, "MMM dd") : "Select"} - {dateRange.to ? format(dateRange.to, "MMM dd") : "Checkout"}
                            </span>
                        </div>
                    </button>

                    <AnimatePresence>
                        {showDatePicker && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-[110%] left-0 lg:left-0 w-[340px] glass-3d-main rounded-[2.5rem] shadow-2xl border border-white/10 p-6 z-[60]"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))} className="p-2 hover:bg-white/10 rounded-full text-white"><ChevronLeft className="w-5 h-5" /></button>
                                    <span className="text-lg font-black text-white">{format(currentMonth, "MMMM yyyy")}</span>
                                    <button type="button" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white/10 rounded-full text-white"><ChevronRight className="w-5 h-5" /></button>
                                </div>

                                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                    {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
                                        <div key={d} className="text-[10px] font-black uppercase text-white/40">{d}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-1">
                                    {generateCalendarDays().map((day, idx) => {
                                        const isSelected = isSameDay(day, dateRange.from) || (dateRange.to && isSameDay(day, dateRange.to));
                                        const isInRange = dateRange.from && dateRange.to && isWithinInterval(day, { start: dateRange.from, end: dateRange.to });
                                        const isCurrentMonth = isSameMonth(day, currentMonth);

                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => handleDateClick(day)}
                                                className={cn(
                                                    "h-10 w-10 rounded-full text-xs font-bold flex items-center justify-center transition-all relative z-10",
                                                    !isCurrentMonth ? "text-white/10" : "text-white",
                                                    isSelected ? "bg-[#470047] text-white shadow-lg scale-110" : "hover:bg-white/10",
                                                    isInRange && !isSelected ? "bg-white/10 rounded-none" : ""
                                                )}
                                            >
                                                {format(day, "d")}
                                            </button>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Guest Picker */}
                <div className="flex-[1.2] relative" ref={guestPickerRef}>
                    <button
                        type="button"
                        onClick={() => setShowGuestPicker(!showGuestPicker)}
                        className="w-full flex items-center gap-4 bg-white/10 p-5 rounded-[2rem] border border-white/10 hover:border-white/20 transition-all h-full text-left"
                    >
                        <Users className="text-white w-6 h-6 ml-2 shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-0.5">Guests</span>
                            <span className="text-base font-bold text-white truncate">
                                {guestConfig.adults + guestConfig.children} Guest{guestConfig.adults + guestConfig.children !== 1 ? "s" : ""}, {guestConfig.rooms} Room{guestConfig.rooms !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </button>

                    <AnimatePresence>
                        {showGuestPicker && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute top-[110%] left-0 right-0 glass-3d-main rounded-[2.5rem] shadow-2xl border border-white/10 p-6 z-[60] space-y-6"
                            >
                                {[
                                    { label: "Adults", key: "adults" as const, min: 1 },
                                    { label: "Children", key: "children" as const, min: 0 },
                                    { label: "Rooms", key: "rooms" as const, min: 1 }
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between">
                                        <span className="text-base font-bold text-white">{item.label}</span>
                                        <div className="flex items-center gap-4 bg-white/5 rounded-xl p-1">
                                            <button
                                                type="button"
                                                onClick={() => setGuestConfig(prev => ({ ...prev, [item.key]: Math.max(item.min, prev[item.key] - 1) }))}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-lg font-black text-white w-4 text-center">{guestConfig[item.key]}</span>
                                            <button
                                                type="button"
                                                onClick={() => setGuestConfig(prev => ({ ...prev, [item.key]: prev[item.key] + 1 }))}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Actions Group */}
                <div className="flex gap-2">
                    {/* Filters Toggle */}
                    <div className="relative" ref={filterRef}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className={cn(
                                "h-full aspect-square rounded-[2rem] flex items-center justify-center border border-white/10 transition-all",
                                showFilters ? "bg-[#470047] text-white" : "bg-white/10 text-white hover:bg-white/20"
                            )}
                        >
                            <Filter className="w-6 h-6" />
                        </motion.button>

                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-[110%] right-0 w-[320px] glass-3d-main rounded-[2.5rem] shadow-2xl border border-white/10 p-6 z-[60] space-y-6"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Filters</span>
                                        <button onClick={() => setShowFilters(false)}><X className="w-5 h-5 text-white/50 hover:text-white" /></button>
                                    </div>

                                    {/* Price Range */}
                                    <div>
                                        <span className="text-sm font-bold text-white mb-3 block">Price Range</span>
                                        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
                                            <div className="flex items-center gap-1">
                                                <span className="text-white/40 text-xs">₹</span>
                                                <input
                                                    type="number"
                                                    placeholder="Min"
                                                    className="w-full bg-transparent text-white text-sm font-bold placeholder:text-white/30 outline-none"
                                                    value={filters.priceRange[0] || ''}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [Number(e.target.value), prev.priceRange[1]] }))}
                                                />
                                            </div>
                                            <span className="text-white/40">-</span>
                                            <div className="flex items-center gap-1 justify-end">
                                                <span className="text-white/40 text-xs">₹</span>
                                                <input
                                                    type="number"
                                                    placeholder="Max"
                                                    className="w-full bg-transparent text-white text-sm font-bold placeholder:text-white/30 outline-none text-right"
                                                    value={filters.priceRange[1] || ''}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], Number(e.target.value)] }))}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div>
                                        <span className="text-sm font-bold text-white mb-3 block">Star Rating</span>
                                        <div className="flex gap-2">
                                            {[3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => toggleFilter('stars', star)}
                                                    className={cn(
                                                        "flex-1 py-3 rounded-xl text-sm font-black border transition-all",
                                                        filters.stars.includes(star)
                                                            ? "bg-[#470047] border-[#470047] text-white"
                                                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                                    )}
                                                >
                                                    {star} Star
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div>
                                        <span className="text-sm font-bold text-white mb-3 block">Amenities</span>
                                        <div className="flex flex-wrap gap-2">
                                            {["Wi-Fi", "Pool", "Spa", "Gym", "Parking"].map(amenity => (
                                                <button
                                                    key={amenity}
                                                    type="button"
                                                    onClick={() => toggleFilter('amenities', amenity)}
                                                    className={cn(
                                                        "px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all",
                                                        filters.amenities.includes(amenity)
                                                            ? "bg-[#470047] border-[#470047] text-white"
                                                            : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                                                    )}
                                                >
                                                    {amenity}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Search Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="bg-white text-[#470047] px-8 rounded-[2rem] flex items-center justify-center gap-3 group shadow-xl transition-all duration-300 font-black tracking-widest text-lg lg:w-[140px]"
                    >
                        <span>GO</span>
                        <Zap className="w-6 h-6 fill-[#470047] animate-pulse" />
                    </motion.button>
                </div>
            </motion.form>

            {/* Trust Badges - now slightly lower to clear drop shadows */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-8 whitespace-nowrap overflow-hidden opacity-40 pointer-events-none">
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Zero Platform Fees
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                    Comparison Guaranteed
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                    <div className="w-1.5 h-1.5 bg-gold-metallic rounded-full" />
                    Direct OTA Redirect
                </div>
            </div>
        </div>
    );
};
