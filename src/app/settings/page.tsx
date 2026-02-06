'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { FlowingWaveBackground } from '@/components/FlowingWaveBackground';
import { motion } from 'framer-motion';
import { User, Calendar, Save, Key, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserProfile {
    id: string;
    name: string | null;
    email: string;
    createdAt: string;
}

export default function SettingsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const response = await fetch('/api/profile', {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                setFormData({
                    name: data.user.name || '',
                    email: data.user.email || '',
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                router.push('/login');
            }
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: formData.name,
                }),
            });

            if (response.ok) {
                setSuccess('Profile updated successfully!');
                fetchUserData();
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to update profile');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setSaving(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            if (response.ok) {
                setSuccess('Password changed successfully!');
                setFormData({
                    ...formData,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to change password');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen relative">
                <Navbar />
                <div className="pt-40 flex justify-center">
                    <div className="w-12 h-12 border-4 border-[#4a044e]/20 border-t-[#4a044e] rounded-full animate-spin" />
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen relative pb-32 bg-gradient-to-br from-amber-50/30 via-yellow-50/30 to-orange-50/30">
            <FlowingWaveBackground />
            <Navbar />

            <section className="relative pt-40 pb-20 px-4">
                <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-[#4a044e]/5 to-transparent pointer-events-none" />

                <div className="max-w-5xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4 mb-12"
                    >
                        <h1 className="text-5xl md:text-6xl font-black text-neutral-900 tracking-tighter leading-[0.9]">
                            Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a044e] via-[#a21caf] to-[#4a044e] animate-gradient">Settings</span>
                        </h1>
                        <p className="text-lg text-neutral-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            Manage your profile and security preferences
                        </p>
                    </motion.div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl text-sm font-bold"
                        >
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-6 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-2xl text-sm font-bold"
                        >
                            {success}
                        </motion.div>
                    )}

                    {/* Profile Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-3d rounded-[3rem] overflow-hidden p-8 md:p-10 mb-6 relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4a044e] to-yellow-400" />

                        <h2 className="text-2xl font-black text-[#4a044e] mb-6 flex items-center gap-2">
                            <User className="w-6 h-6" />
                            Profile Information
                        </h2>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl px-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        disabled
                                        className="w-full bg-white/30 backdrop-blur-md h-14 rounded-2xl pl-14 pr-6 border border-white/60 font-bold text-neutral-500 shadow-sm cursor-not-allowed"
                                    />
                                </div>
                                <p className="text-xs text-neutral-400 ml-4 font-medium">Email cannot be changed</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">Member Since</label>
                                <div className="flex items-center gap-2 text-neutral-600 font-bold px-4">
                                    <Calendar className="w-5 h-5" />
                                    {new Date(user?.createdAt || '').toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </div>
                            </div>

                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="w-full bg-gradient-to-r from-[#4a044e] to-[#701a75] hover:shadow-xl text-white font-black h-14 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md mt-6"
                            >
                                <Save className="w-5 h-5" />
                                {saving ? 'Saving...' : 'Save Profile'}
                            </button>
                        </div>
                    </motion.div>

                    {/* Password Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-3d rounded-[3rem] overflow-hidden p-8 md:p-10 relative"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#4a044e] to-yellow-400" />

                        <h2 className="text-2xl font-black text-[#4a044e] mb-6 flex items-center gap-2">
                            <Key className="w-6 h-6" />
                            Change Password
                        </h2>

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">Current Password</label>
                                <input
                                    type="password"
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl px-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                    placeholder="Enter current password"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">New Password</label>
                                <input
                                    type="password"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl px-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-4">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    className="w-full bg-white/50 backdrop-blur-md h-14 rounded-2xl px-6 border border-white/60 focus:outline-none focus:ring-2 focus:ring-[#4a044e]/20 transition-all font-bold text-neutral-800 placeholder:text-neutral-400/80 shadow-sm"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <button
                                onClick={handleChangePassword}
                                disabled={saving}
                                className="w-full bg-gradient-to-r from-[#4a044e] to-[#701a75] hover:shadow-xl text-white font-black h-14 rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md mt-6"
                            >
                                <Key className="w-5 h-5" />
                                {saving ? 'Changing...' : 'Change Password'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
