"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { User, Menu, Bell, Search, LogOut, Settings, Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface UserData {
    name: string | null;
    email: string;
}

export const Navbar = () => {
    const router = useRouter();
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        return scrollY.onChange((latest) => {
            setIsScrolled(latest > 50);
        });
    }, [scrollY]);

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

    return (
        <motion.nav
            className={cn(
                "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-6 py-4",
                isScrolled ? "py-3" : "py-6"
            )}
        >
            <motion.div
                layout
                className={cn(
                    "mx-auto max-w-7xl flex items-center justify-between transition-all duration-500",
                    isScrolled
                        ? "bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg rounded-full px-6 py-3"
                        : "bg-transparent px-0"
                )}
            >
                {/* Logo */}
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => router.push('/')}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4a044e] to-[#2e0231] border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative overflow-hidden">
                        <div className="absolute inset-0 bg-gold-gradient opacity-0 group-hover:opacity-20 transition-opacity" />
                        <span className="text-gold font-black text-xs relative z-10">S</span>
                    </div>
                    <span className={cn(
                        "font-black text-xl tracking-tight transition-colors bg-clip-text text-transparent bg-gradient-to-r from-[#4a044e] to-[#701a75]"
                    )}>
                        STAYRA
                    </span>
                </div>

                {/* Center Links (Desktop) */}
                <div className="hidden md:flex items-center gap-8">
                    {["Stays", "Flights", "Packages", "Deals"].map((item, i) => (
                        <a
                            key={item}
                            href="#"
                            className={cn(
                                "text-sm font-bold transition-all hover:scale-105",
                                i === 0 ? "text-[#4a044e]" : "text-neutral-500 hover:text-[#b45309]"
                            )}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <button className="p-2 rounded-full hover:bg-black/5 transition-colors relative">
                                <Bell className="w-5 h-5 text-neutral-600" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                            </button>

                            <div className="relative">
                                <div
                                    className="flex items-center gap-3 pl-2 border-l border-neutral-200 cursor-pointer"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <div className="flex flex-col items-end hidden sm:flex">
                                        <span className="text-xs font-black text-neutral-800">
                                            {userData?.name || 'User'}
                                        </span>
                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                            Member
                                        </span>
                                    </div>
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#4a044e] to-[#a21caf] flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <ChevronDown className={cn(
                                        "w-4 h-4 text-neutral-600 transition-transform",
                                        showDropdown && "rotate-180"
                                    )} />
                                </div>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {showDropdown && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                                        >
                                            <div className="p-4 bg-gradient-to-br from-[#4a044e] to-purple-600 text-white">
                                                <p className="font-black text-sm">{userData?.name || 'User'}</p>
                                                <p className="text-xs opacity-90 truncate">{userData?.email}</p>
                                            </div>
                                            <div className="py-2">
                                                <button
                                                    onClick={() => {
                                                        setShowDropdown(false);
                                                        router.push('/profile');
                                                    }}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                                                >
                                                    <User className="w-4 h-4 text-gray-600" />
                                                    <span className="font-semibold text-sm text-gray-800">My Profile</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowDropdown(false);
                                                        router.push('/bookings');
                                                    }}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                                                >
                                                    <Calendar className="w-4 h-4 text-gray-600" />
                                                    <span className="font-semibold text-sm text-gray-800">My Bookings</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowDropdown(false);
                                                        router.push('/settings');
                                                    }}
                                                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                                                >
                                                    <Settings className="w-4 h-4 text-gray-600" />
                                                    <span className="font-semibold text-sm text-gray-800">Settings</span>
                                                </button>
                                                <div className="border-t border-gray-100 my-2"></div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full px-4 py-3 text-left hover:bg-red-50 transition-colors flex items-center gap-3"
                                                >
                                                    <LogOut className="w-4 h-4 text-red-600" />
                                                    <span className="font-semibold text-sm text-red-600">Logout</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/login')}
                                className="px-6 py-2 text-sm font-bold text-[#4a044e] hover:bg-[#4a044e]/5 rounded-full transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => router.push('/signup')}
                                className="px-6 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#4a044e] to-purple-600 rounded-full hover:shadow-lg transition-all"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.nav>
    );
};
