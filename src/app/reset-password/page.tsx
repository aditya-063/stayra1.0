"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Lock, Save } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing reset token");
        }
    }, [token]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (formData.newPassword !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!token) {
            setError("Invalid reset token");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    newPassword: formData.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.error || 'Failed to reset password');
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
                        <h1 className="text-3xl font-black text-[#4a044e] tracking-tight mb-2">Reset Password</h1>
                        <p className="text-neutral-500 font-medium">Enter your new password below.</p>
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
                            <h2 className="text-xl font-black text-[#4a044e] mb-2">Password Reset!</h2>
                            <p className="text-neutral-500 font-medium">Redirecting to login...</p>
                        </motion.div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">New Password</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        placeholder="••••••••"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl pl-14 pr-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                        required
                                        minLength={8}
                                    />
                                </div>
                                <p className="text-xs text-neutral-400 ml-4">Minimum 8 characters</p>
                            </div>

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

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm font-bold text-red-600 bg-red-50 py-2 px-4 rounded-xl text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !token}
                                className="w-full bg-[#4a044e] text-white h-16 rounded-2xl font-black tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl shadow-[#4a044e]/30 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                <span>{loading ? 'Resetting...' : 'Reset Password'}</span>
                                {!loading && <Save className="w-5 h-5" />}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 pt-6 border-t border-black/5 text-center">
                        <p className="text-sm font-bold text-neutral-400">
                            Remember your password? <a href="/login" className="text-[#4a044e] hover:underline">Sign In</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
