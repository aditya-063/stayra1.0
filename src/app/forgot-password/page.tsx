"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { Mail, Send } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setSent(true);
            } else {
                setError(data.error || 'Failed to send reset email');
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
                        <h1 className="text-3xl font-black text-[#4a044e] tracking-tight mb-2">Forgot Password?</h1>
                        <p className="text-neutral-500 font-medium">
                            {sent ? "Check your email for reset instructions." : "We'll send you a reset link."}
                        </p>
                    </div>

                    {sent ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-8"
                        >
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-[#4a044e]" />
                            </div>
                            <h2 className="text-xl font-black text-[#4a044e] mb-2">Email Sent!</h2>
                            <p className="text-neutral-500 font-medium mb-6">
                                If an account exists with <strong>{email}</strong>, you'll receive a password reset link shortly.
                            </p>
                            <a
                                href="/login"
                                className="inline-block bg-[#4a044e] text-white px-8 py-3 rounded-full font-black hover:scale-105 transition-transform"
                            >
                                Back to Login
                            </a>
                        </motion.div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
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
                                disabled={loading}
                                className="w-full bg-[#4a044e] text-white h-16 rounded-2xl font-black tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl shadow-[#4a044e]/30 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                                {!loading && <Send className="w-5 h-5" />}
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
