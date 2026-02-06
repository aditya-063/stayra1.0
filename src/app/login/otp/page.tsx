"use client";

import React, { useState } from "react";
import { GoldenDustEffect } from "@/components/GoldenDustEffect";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OTPLoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showGoldenDust, setShowGoldenDust] = useState(false);

    const handleSendOTP = async () => {
        if (!identifier) {
            setError("Please enter your email or mobile number");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch('/api/auth/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier }),
            });

            const data = await response.json();

            if (response.ok) {
                setOtpSent(true);
                setError("");
                if (data.otp) {
                    alert(`Development OTP: ${data.otp}`);
                }
            } else {
                setError(data.error || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    identifier,
                    otp,
                    method: 'otp',
                }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setShowGoldenDust(true);
                setTimeout(() => router.push('/'), 2500);
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative bg-gradient-to-br from-amber-50/30 via-yellow-50/30 to-orange-50/30">
            <div className="absolute top-6 left-6 z-20">
                <Link href="/" className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#4a044e] to-[#2e0231] border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-20 transition-opacity" />
                        <span className="text-yellow-400 font-black text-base relative z-10">S</span>
                    </div>
                    <span className="font-black text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#4a044e] to-[#701a75]">
                        STAYRA
                    </span>
                </Link>
            </div>

            <div className="fixed inset-0 overflow-hidden z-0">
                {[0, 1, 2, 3, 4, 5].map((waveIndex) => (
                    <motion.div
                        key={waveIndex}
                        className="absolute inset-x-0"
                        style={{
                            top: `${10 + waveIndex * 12}%`,
                            height: '50%',
                            opacity: 0.4 - waveIndex * 0.05,
                            zIndex: 6 - waveIndex,
                        }}
                    >
                        <svg className="absolute w-full h-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ filter: 'blur(2px)' }}>
                            <motion.path
                                d={`M0,${160 + waveIndex * 15} C240,${120 + waveIndex * 10} 360,${200 + waveIndex * 10} 720,${160 + waveIndex * 15} C1080,${120 + waveIndex * 20} 1200,${200 + waveIndex * 10} 1440,${160 + waveIndex * 15} L1440,320 L0,320 Z`}
                                fill={`url(#paleGradient${waveIndex})`}
                                animate={{
                                    d: [
                                        `M0,${160 + waveIndex * 15} C240,${120 + waveIndex * 10} 360,${200 + waveIndex * 10} 720,${160 + waveIndex * 15} C1080,${120 + waveIndex * 20} 1200,${200 + waveIndex * 10} 1440,${160 + waveIndex * 15} L1440,320 L0,320 Z`,
                                        `M0,${160 + waveIndex * 15} C240,${200 + waveIndex * 10} 360,${120 + waveIndex * 10} 720,${160 + waveIndex * 15} C1080,${200 + waveIndex * 10} 1200,${120 + waveIndex * 20} 1440,${160 + waveIndex * 15} L1440,320 L0,320 Z`,
                                        `M0,${160 + waveIndex * 15} C240,${120 + waveIndex * 10} 360,${200 + waveIndex * 10} 720,${160 + waveIndex * 15} C1080,${120 + waveIndex * 20} 1200,${200 + waveIndex * 10} 1440,${160 + waveIndex * 15} L1440,320 L0,320 Z`,
                                    ]
                                }}
                                transition={{ duration: 10 + waveIndex * 2, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <defs>
                                <linearGradient id={`paleGradient${waveIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.3" />
                                    <stop offset="25%" stopColor="#fde68a" stopOpacity="0.4" />
                                    <stop offset="50%" stopColor="#fcd34d" stopOpacity="0.5" />
                                    <stop offset="75%" stopColor="#fde68a" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#fef3c7" stopOpacity="0.3" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </motion.div>
                ))}

                {Array.from({ length: 100 }).map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute rounded-full"
                        style={{
                            width: `${2 + Math.random() * 4}px`,
                            height: `${2 + Math.random() * 4}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${15 + Math.random() * 70}%`,
                            background: `radial-gradient(circle, ${i % 4 === 0 ? '#fbbf24' : i % 4 === 1 ? '#f59e0b' : i % 4 === 2 ? '#fcd34d' : '#fb923c'
                                }, transparent)`,
                            boxShadow: `0 0 ${12 + Math.random() * 16}px ${i % 4 === 0 ? 'rgba(251, 191, 36, 0.9)' : i % 4 === 1 ? 'rgba(245, 158, 11, 0.9)' : i % 4 === 2 ? 'rgba(252, 211, 77, 0.9)' : 'rgba(251, 146, 60, 0.9)'
                                }`,
                            zIndex: 10,
                        }}
                        animate={{
                            x: [0, -25 + Math.random() * 50],
                            y: [0, -35 + Math.random() * 70],
                            opacity: [0, 0.9, 0.7, 0],
                            scale: [0.5, 2.5 + Math.random() * 1.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 3.5 + Math.random() * 3.5,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>

            <div className="min-h-screen flex items-center justify-center px-4 pt-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-xl relative"
                    style={{ perspective: '1000px' }}
                >
                    <div
                        className="relative rounded-[2.5rem] overflow-hidden px-6 py-8 md:px-10 md:py-10"
                        style={{
                            background: 'linear-gradient(145deg, #e8e8e8, #f5f5f5)',
                            boxShadow: `
                                0 20px 40px -10px rgba(0, 0, 0, 0.25),
                                0 -8px 24px -4px rgba(0, 0, 0, 0.1),
                                20px 0 40px -10px rgba(0, 0, 0, 0.15),
                                -20px 0 40px -10px rgba(0, 0, 0, 0.15),
                                inset 2px 2px 5px rgba(255, 255, 255, 0.5),
                                inset -2px -2px 5px rgba(0, 0, 0, 0.05)
                            `,
                            transform: 'translateZ(40px)',
                            border: '1px solid rgba(255, 255, 255, 0.6)',
                        }}
                    >
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4a044e] via-yellow-400 to-[#4a044e]" />
                        <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#4a044e] via-yellow-400 to-[#4a044e]" />

                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-black text-[#4a044e] tracking-tight mb-1.5">Sign In with OTP</h1>
                            <p className="text-neutral-600 font-medium text-sm">We'll send you a one-time password</p>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-5 bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs font-bold"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-3">
                                    Email or Mobile Number
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <input
                                        type="text"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder="you@example.com or +1 234 567 8900"
                                        className="w-full bg-white h-11 rounded-xl pl-12 pr-5 border-2 border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 focus:border-[#4a044e] transition-all font-bold text-sm text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                        style={{ boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.05)' }}
                                        required
                                        disabled={otpSent}
                                    />
                                </div>
                            </div>

                            {!otpSent ? (
                                <button
                                    type="button"
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#4a044e] to-[#701a75] hover:shadow-xl text-white font-black h-11 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:scale-[1.02] active:scale-[0.98] text-sm"
                                >
                                    {loading ? 'Sending...' : 'Send OTP'}
                                    {!loading && <Send className="w-4 h-4" />}
                                </button>
                            ) : (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-3">
                                            Enter OTP
                                        </label>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="••••••"
                                            className="w-full bg-white h-11 rounded-xl px-5 border-2 border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 focus:border-[#4a044e] transition-all font-black text-neutral-800 placeholder:text-neutral-400/80 shadow-sm text-center text-xl tracking-widest"
                                            style={{ boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.05)' }}
                                            maxLength={6}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-[#4a044e] to-[#701a75] hover:shadow-xl text-white font-black h-11 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:scale-[1.02] active:scale-[0.98] text-sm"
                                    >
                                        {loading ? 'Verifying...' : 'Verify & Sign In'}
                                        {!loading && <ArrowRight className="w-4 h-4" />}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => { setOtpSent(false); setOtp(""); }}
                                        className="w-full text-neutral-600 hover:text-[#4a044e] text-xs font-bold transition"
                                    >
                                        Change number / Resend OTP
                                    </button>
                                </>
                            )}
                        </form>

                        <p className="mt-5 text-center text-xs text-neutral-600 font-medium">
                            <Link href="/login" className="text-[#4a044e] font-black hover:underline">
                                ← Back to Password Login
                            </Link>
                        </p>
                    </div>

                    <div
                        className="absolute inset-0 rounded-[2.5rem] -z-10"
                        style={{
                            background: 'linear-gradient(145deg, rgba(0,0,0,0.05), rgba(0,0,0,0.15))',
                            filter: 'blur(20px)',
                            transform: 'translateY(12px)',
                        }}
                    />
                </motion.div>
            </div>

            {showGoldenDust && <GoldenDustEffect />}
        </main>
    );
}
