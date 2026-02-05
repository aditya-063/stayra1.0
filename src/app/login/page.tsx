"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { GoldenDustEffect } from "@/components/GoldenDustEffect";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, Mail, Phone, Key, Send } from "lucide-react";
import { useRouter } from "next/navigation";

type AuthMethod = 'email' | 'mobile';
type CredentialType = 'password' | 'otp';

export default function LoginPage() {
    const router = useRouter();
    const [authMethod, setAuthMethod] = useState<AuthMethod>('email');
    const [credentialType, setCredentialType] = useState<CredentialType>('password');
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showGoldenDust, setShowGoldenDust] = useState(false);

    const handleSendOTP = async () => {
        if (!identifier) {
            setError("Please enter your " + (authMethod === 'email' ? 'email' : 'mobile number'));
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
                // Show OTP in development
                if (data.otp) {
                    console.log('Development OTP:', data.otp);
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
                    password: credentialType === 'password' ? password : undefined,
                    otp: credentialType === 'otp' ? otp : undefined,
                    method: credentialType,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store token
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Show golden dust effect
                setShowGoldenDust(true);

                // Redirect after animation
                setTimeout(() => {
                    router.push('/');
                }, 2500);
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
        <main className="min-h-screen relative">
            <Navbar />
            <GoldenDustEffect show={showGoldenDust} />

            <div className="min-h-screen flex items-center justify-center px-4 pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md glass-3d rounded-[3rem] overflow-hidden p-8 md:p-12 relative"
                >
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4a044e] to-yellow-400" />

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-[#4a044e] tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-neutral-500 font-medium">Access your exclusive member rates.</p>
                    </div>

                    {/* Auth Method Tabs */}
                    <div className="flex gap-2 mb-6 bg-white/30 p-1.5 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => {
                                setAuthMethod('email');
                                setIdentifier("");
                                setOtpSent(false);
                                setError("");
                            }}
                            className={`flex-1 py-2.5 px-4 rounded-xl font-black text-sm transition-all ${authMethod === 'email' ? 'bg-white text-[#4a044e] shadow-md' : 'text-neutral-500'}`}
                        >
                            EMAIL
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setAuthMethod('mobile');
                                setIdentifier("");
                                setOtpSent(false);
                                setError("");
                            }}
                            className={`flex-1 py-2.5 px-4 rounded-xl font-black text-sm transition-all ${authMethod === 'mobile' ? 'bg-white text-[#4a044e] shadow-md' : 'text-neutral-500'}`}
                        >
                            MOBILE
                        </button>
                    </div>

                    {/* Credential Type Tabs */}
                    <div className="flex gap-2 mb-6 bg-white/30 p-1.5 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => {
                                setCredentialType('password');
                                setOtpSent(false);
                                setOtp("");
                                setError("");
                            }}
                            className={`flex-1 py-2.5 px-4 rounded-xl font-black text-sm transition-all ${credentialType === 'password' ? 'bg-white text-[#4a044e] shadow-md' : 'text-neutral-500'}`}
                        >
                            PASSWORD
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setCredentialType('otp');
                                setPassword("");
                                setError("");
                            }}
                            className={`flex-1 py-2.5 px-4 rounded-xl font-black text-sm transition-all ${credentialType === 'otp' ? 'bg-white text-[#4a044e] shadow-md' : 'text-neutral-500'}`}
                        >
                            OTP
                        </button>
                    </div>

                    <form className="space-y-5" onSubmit={handleLogin}>
                        {/* Identifier Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">
                                {authMethod === 'email' ? 'Email Address' : 'Mobile Number'}
                            </label>
                            <div className="relative group">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                    {authMethod === 'email' ? <Mail className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                                </div>
                                <input
                                    type={authMethod === 'email' ? 'email' : 'tel'}
                                    placeholder={authMethod === 'email' ? 'you@example.com' : '+1 234 567 8900'}
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl pl-14 pr-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        {credentialType === 'password' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2"
                            >
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">Password</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl pl-14 pr-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                        required
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* OTP Section */}
                        {credentialType === 'otp' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3"
                            >
                                {!otpSent ? (
                                    <button
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={loading}
                                        className="w-full bg-white text-[#4a044e] h-14 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                    >
                                        <Send className="w-5 h-5" />
                                        <span>Send OTP</span>
                                    </button>
                                ) : (
                                    <>
                                        <div className="text-center text-sm font-bold text-green-600 bg-green-50 py-2 px-4 rounded-xl">
                                            ✓ OTP sent to your {authMethod}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">Enter OTP</label>
                                            <div className="relative group">
                                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-[#4a044e] transition-colors">
                                                    <Key className="w-5 h-5" />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="123456"
                                                    maxLength={6}
                                                    value={otp}
                                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                                    className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl pl-14 pr-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm tracking-[0.5em] text-center text-2xl"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleSendOTP}
                                            className="text-xs font-bold text-[#4a044e] hover:underline ml-4"
                                        >
                                            Resend OTP
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        )}

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

                        {/* Forgot Password */}
                        {credentialType === 'password' && (
                            <div className="flex justify-end">
                                <a href="/forgot-password" className="text-xs font-bold text-[#4a044e] hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                        )}

                        {/* Sign In Button */}
                        {(credentialType === 'password' || otpSent) && (
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#4a044e] text-white h-16 rounded-2xl font-black tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl shadow-[#4a044e]/30 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                                {!loading && <ArrowRight className="w-5 h-5" />}
                            </button>
                        )}
                    </form>

                    {/* OR Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                        <span className="text-xs font-black text-neutral-400 uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                    </div>

                    {/* Google Sign In Button */}
                    <GoogleSignInButton mode="signin" />

                    <div className="mt-8 pt-6 border-t border-black/5 text-center">
                        <p className="text-sm font-bold text-neutral-400">
                            Don't have an account? <a href="/signup" className="text-[#4a044e] hover:underline">Join Stayra</a>
                        </p>
                    </div>
                </motion.div>
            </div>
        </main>
    )
}

