"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { User, Menu, Bell, Search, LogOut, Settings, Calendar, ChevronDown, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

interface UserData {
    name: string | null;
    email: string;
}

export const Navbar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [canGoBack, setCanGoBack] = useState(false);

    // Check if navbar should be hidden
    const hideNavbar = pathname === '/login' || pathname === '/signup' || pathname === '/login/otp' || pathname?.startsWith('/search');

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);

    useEffect(() => {
        // Check if browser can go back
        setCanGoBack(window.history.length > 1);
    }, [pathname]);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
            fetchUserData(token);
        }
    }, []);

    const fetchUserData = async (token: string) => {
        try {
            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserData({
                    name: data.user.name,
                    email: data.user.email,
                });
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserData(null);
        setShowDropdown(false);
        router.push('/login');
    };

    if (hideNavbar) {
        return null;
    }

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6",
                isScrolled ? "py-3" : "py-6"
            )}
        >
            <motion.div
                layout
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                    "mx-auto max-w-7xl flex items-center justify-between transition-all duration-500",
                    isScrolled
                        ? "bg-white/80 backdrop-blur-2xl border border-white/60 shadow-2xl rounded-full px-6 py-3"
                        : "bg-white/50 backdrop-blur-md border border-white/40 shadow-lg rounded-full px-6 py-4"
                )}
            >
                {/* Logo */}
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => router.push('/')}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4a044e] to-[#2e0231] border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-20 transition-opacity" />
                        <span className="text-yellow-400 font-black text-xs relative z-10">S</span>
                    </div>
                    <span className="font-black text-xl tracking-tight transition-colors bg-clip-text text-transparent bg-gradient-to-r from-[#4a044e] to-[#701a75]">
                        STAYRA
                    </span>
                </div>

                {/* Center Navigation Links (Desktop) */}
                <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8">
                    {canGoBack && pathname !== '/' && (
                        <motion.button
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            onClick={() => router.back()}
                            className="text-sm font-bold transition-all hover:scale-105 text-neutral-500 hover:text-[#4a044e] flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </motion.button>
                    )}
                    <a
                        href="/"
                        className="text-sm font-bold transition-all hover:scale-105 text-[#4a044e]"
                    >
                        Stays
                    </a>
                    <div className="relative">
                        <a
                            href="#"
                            className="text-sm font-bold transition-all hover:scale-105 text-neutral-500 hover:text-[#b45309]"
                        >
                            Flights
                        </a>
                        <span className="absolute -top-2 -right-12 text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-purple-600 to-purple-800 text-white px-2 py-0.5 rounded">
                            Coming Soon
                        </span>
                    </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-2 hover:bg-white/50 rounded-full transition-colors"
                            >
                                <Bell className="w-5 h-5 text-neutral-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                            </motion.button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <div
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4a044e] to-[#a21caf] flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <ChevronDown className={cn(
                                        "w-4 h-4 text-neutral-600 transition-transform duration-300",
                                        showDropdown && "rotate-180"
                                    )} />
                                </div>

                                {/* 3D Neumorphic Dropdown */}
                                <AnimatePresence>
                                    {showDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                            className="absolute right-0 mt-4 w-60"
                                            style={{ perspective: '1000px' }}
                                        >
                                            <div
                                                className="relative rounded-[1.5rem] overflow-hidden p-5"
                                                style={{
                                                    background: '#ffffff',
                                                    boxShadow: `
                                                        0 20px 40px -10px rgba(0, 0, 0, 0.25),
                                                        0 -8px 24px -4px rgba(0, 0, 0, 0.1),
                                                        15px 0 30px -10px rgba(0, 0, 0, 0.15),
                                                        -15px 0 30px -10px rgba(0, 0, 0, 0.15),
                                                        inset 2px 2px 5px rgba(255, 255, 255, 0.5),
                                                        inset -2px -2px 5px rgba(0, 0, 0, 0.05)
                                                    `,
                                                    transform: 'translateZ(20px)',
                                                    border: '1px solid rgba(255, 255, 255, 0.6)',
                                                }}
                                            >
                                                {/* Top Gradient Strip */}
                                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4a044e] via-yellow-400 to-[#4a044e]" />

                                                {/* User Info */}
                                                <div className="mb-4 pb-4 border-b border-neutral-200">
                                                    <p className="font-black text-base text-[#4a044e]">{userData?.name || 'User'}</p>
                                                    <p className="text-sm text-neutral-600 font-semibold truncate mt-1">{userData?.email}</p>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="space-y-1">
                                                    <button
                                                        onClick={() => {
                                                            setShowDropdown(false);
                                                            router.push('/profile');
                                                        }}
                                                        className="w-full px-4 py-3 text-left hover:bg-neutral-100 rounded-xl transition-all flex items-center gap-3 group"
                                                    >
                                                        <User className="w-5 h-5 text-neutral-600 group-hover:text-[#4a044e] transition-colors" />
                                                        <span className="font-bold text-sm text-neutral-800 group-hover:text-[#4a044e] transition-colors">My Profile</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowDropdown(false);
                                                            router.push('/bookings');
                                                        }}
                                                        className="w-full px-4 py-3 text-left hover:bg-neutral-100 rounded-xl transition-all flex items-center gap-3 group"
                                                    >
                                                        <Calendar className="w-5 h-5 text-neutral-600 group-hover:text-[#4a044e] transition-colors" />
                                                        <span className="font-bold text-sm text-neutral-800 group-hover:text-[#4a044e] transition-colors">My Bookings</span>
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowDropdown(false);
                                                            router.push('/settings');
                                                        }}
                                                        className="w-full px-4 py-3 text-left hover:bg-neutral-100 rounded-xl transition-all flex items-center gap-3 group"
                                                    >
                                                        <Settings className="w-5 h-5 text-neutral-600 group-hover:text-[#4a044e] transition-colors" />
                                                        <span className="font-bold text-sm text-neutral-800 group-hover:text-[#4a044e] transition-colors">Settings</span>
                                                    </button>
                                                    {/* 3D Neumorphic Divider */}
                                                    <div className="relative my-2">
                                                        <div
                                                            className="h-px"
                                                            style={{
                                                                background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.1) 50%, transparent)',
                                                                boxShadow: '0 1px 0 rgba(255,255,255,0.5)'
                                                            }}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full px-3 py-2.5 text-left hover:bg-red-50 rounded-xl transition-all flex items-center gap-3 group"
                                                    >
                                                        <LogOut className="w-5 h-5 text-red-600" />
                                                        <span className="font-bold text-sm text-red-600">Logout</span>
                                                    </button>
                                                </div>

                                                {/* Bottom Gradient Strip */}
                                                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#4a044e] via-yellow-400 to-[#4a044e]" />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/login')}
                                className="text-sm font-bold text-neutral-700 hover:text-[#4a044e] transition-colors"
                            >
                                Sign In
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/signup')}
                                className="bg-gradient-to-r from-[#4a044e] to-[#701a75] text-white px-5 py-2 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all"
                            >
                                Sign Up
                            </motion.button>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.nav>
    );
};
