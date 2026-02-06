"use client";

import React, { useState } from "react";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    mobile: formData.mobile || undefined,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.error || 'Signup failed');
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

            <div className="min-h-screen flex items-center justify-center px-4 py-16 relative z-10">
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
                            <h1 className="text-2xl font-black text-[#4a044e] tracking-tight mb-1.5">Join Stayra</h1>
                            <p className="text-neutral-600 font-medium text-sm">Start comparing hotel prices today.</p>
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

                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-6"
                            >
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-black text-[#4a044e] mb-1.5">Account Created!</h2>
                                <p className="text-neutral-600 font-medium text-sm">Redirecting to login...</p>
                            </motion.div>
                        ) : (
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-3">Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-white h-11 rounded-xl pl-12 pr-5 border-2 border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 focus:border-[#4a044e] transition-all font-bold text-sm text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                            style={{ boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.05)' }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-3">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                            <Mail className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-white h-11 rounded-xl pl-12 pr-5 border-2 border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 focus:border-[#4a044e] transition-all font-bold text-sm text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                            style={{ boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.05)' }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-3">
                                        Mobile Number <span className="text-neutral-400">(Optional)</span>
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                            <Phone className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            placeholder="+1 234 567 8900"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            className="w-full bg-white h-11 rounded-xl pl-12 pr-5 border-2 border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 focus:border-[#4a044e] transition-all font-bold text-sm text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                            style={{ boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.05)' }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-3">Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full bg-white h-11 rounded-xl pl-12 pr-5 border-2 border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 focus:border-[#4a044e] transition-all font-bold text-sm text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                            style={{ boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.05)' }}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-3">Confirm Password</label>
                                    <div className="relative group">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                            <Lock className="w-4 h-4" />
                                        </div>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full bg-white h-11 rounded-xl pl-12 pr-5 border-2 border-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 focus:border-[#4a044e] transition-all font-bold text-sm text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                            style={{ boxShadow: 'inset 2px 2px 5px rgba(0, 0, 0, 0.05)' }}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#4a044e] to-[#701a75] hover:shadow-xl text-white font-black h-11 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:scale-[1.02] active:scale-[0.98] text-sm"
                                >
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                    {!loading && <ArrowRight className="w-4 h-4" />}
                                </button>
                            </form>
                        )}

                        {!success && (
                            <>
                                <div className="relative my-5">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-neutral-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-[10px]">
                                        <span className="px-3 bg-gradient-to-r from-[#f5f5f5] to-[#e8e8e8] text-neutral-500 font-black uppercase tracking-widest">
                                            Or
                                        </span>
                                    </div>
                                </div>

                                <GoogleSignInButton />

                                <p className="mt-5 text-center text-xs text-neutral-600 font-medium">
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-[#4a044e] font-black hover:underline">
                                        Sign In
                                    </Link>
                                </p>
                            </>
                        )}
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
        </main>
    );
}
