"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { FlowingWaveBackground } from "@/components/FlowingWaveBackground";
import { SearchBar } from "@/components/SearchBar";
import { HotelCard } from "@/components/HotelCard";
import { RoomComparisonModal } from "@/components/RoomComparisonModal";
import { mockHotels } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [selectedHotel, setSelectedHotel] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>(mockHotels);
  const [allHotels, setAllHotels] = useState<any[]>(mockHotels);
  const [loading, setLoading] = useState(false);

  // Fetch real data (Progressive Enhancement)
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/hotels');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.length > 0) {
          setAllHotels(data);
          setSearchResults(data);
        }
      } catch (e) {
        console.log("Using mock data due to API/DB unreachability");
      }
    }
    fetchData();
  }, []);

  const handleSearch = (data: any) => {
    setLoading(true);
    // Simulate API latency for effect only, filtering is now client-side on fetched data
    // Real app would pass params to API
    setTimeout(() => {
      const { location, filters } = data;
      let filtered = allHotels;

      if (location) {
        filtered = filtered.filter(h =>
          h.city.toLowerCase().includes(location.toLowerCase()) ||
          h.canonicalName.toLowerCase().includes(location.toLowerCase())
        );
      }

      if (filters?.priceRange) {
        filtered = filtered.filter(h => {
          const cheapest = Math.min(...h.roomOptions.flatMap((r: any) => r.prices.map((p: any) => p.totalPrice)));
          return cheapest >= filters.priceRange[0] && cheapest <= filters.priceRange[1];
        });
      }

      setSearchResults(filtered);
      setLoading(false);
    }, 600);
  };

  return (
    <main className="min-h-screen relative pb-32 bg-gradient-to-br from-amber-50/30 via-yellow-50/30 to-orange-50/30">
      <FlowingWaveBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4">
        <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-[#4a044e]/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col items-center gap-10 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center space-y-4"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-black text-neutral-900 tracking-tighter leading-[0.9] cursor-default"
              whileHover={{
                scale: 1.05,
                y: -5,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
            >
              Find your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a044e] via-[#a21caf] to-[#4a044e] animate-gradient">perfect stay</span>
              <br />across all platforms.
            </motion.h1>
            <p className="text-lg text-neutral-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Stayra aggregates real-time prices from Booking.com, Agoda, Expedia, and more to ensure you never overpay for luxury.
            </p>
          </motion.div>

          <motion.div
            className="w-full"
            style={{ perspective: '1000px' }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3, ease: 'easeOut' }
            }}
          >
            <div
              style={{
                transformStyle: 'preserve-3d',
                transition: 'transform 0.3s ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateZ(20px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateZ(0px)';
              }}
            >
              <SearchBar onSearch={handleSearch} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-4 max-w-7xl mx-auto">
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-64 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#4a044e]/20 border-t-[#4a044e] rounded-full animate-spin" />
              <span className="text-sm font-bold text-[#4a044e] animate-pulse">Scanning 50+ OTAs...</span>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            <AnimatePresence mode="popLayout">
              {searchResults.length > 0 ? (
                searchResults.map((hotel, idx) => (
                  <motion.div
                    key={hotel.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.5, ease: "backOut" }}
                  >
                    <HotelCard
                      hotel={hotel}
                      onSelectRooms={setSelectedHotel}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <h3 className="text-2xl font-black text-neutral-300">No hotels found.</h3>
                  <p className="text-neutral-400">Try adjusting your dates or location.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>

      <RoomComparisonModal
        isOpen={!!selectedHotel}
        onClose={() => setSelectedHotel(null)}
        hotel={selectedHotel}
      />
    </main>
  );
}
