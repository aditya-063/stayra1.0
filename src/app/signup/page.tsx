"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Lock, User, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

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

        // Validate passwords match
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
        <main className="min-h-screen relative">
            <Navbar />

            <div className="min-h-screen flex items-center justify-center px-4 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md glass-3d rounded-[3rem] overflow-hidden p-8 md:p-12 relative"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4a044e] to-yellow-400" />

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-[#4a044e] tracking-tight mb-2">Join Stayra</h1>
                        <p className="text-neutral-500 font-medium">Start comparing hotel prices today.</p>
                    </div>

                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-black text-[#4a044e] mb-2">Account Created!</h2>
                            <p className="text-neutral-500 font-medium">Redirecting to login...</p>
                        </motion.div>
                    ) : (
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">Full Name</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl pl-14 pr-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl pl-14 pr-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Mobile */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">
                                    Mobile Number <span className="text-neutral-300">(Optional)</span>
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        placeholder="+1 234 567 8900"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl pl-14 pr-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">Password</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl pl-14 pr-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <p className="text-xs text-neutral-400 ml-4">Minimum 8 characters</p>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl pl-14 pr-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm font-bold text-red-600 bg-red-50 py-2 px-4 rounded-xl text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#4a044e] text-white h-16 rounded-2xl font-black tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl shadow-[#4a044e]/30 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                                {!loading && <ArrowRight className="w-5 h-5" />}
                            </button>
                        </form>
                    )}

                    {/* OR Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                        <span className="text-xs font-black text-neutral-400 uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                    </div>

                    {/* Google Sign Up Button */}
                    <GoogleSignInButton mode="signup" />

                    <div className="mt-8 pt-6 border-t border-black/5 text-center">
                        <p className="text-sm font-bold text-neutral-400">
                            Already have an account? <a href="/login" className="text-[#4a044e] hover:underline">Sign In</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
