'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Save, Lock, Camera, TrendingUp, Award, Activity, Clock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { FlowingWaveBackground } from '@/components/FlowingWaveBackground';

interface UserProfile {
    id: string;
    email: string;
    mobile: string | null;
    name: string | null;
    profilePicture: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    dateOfBirth: string | null;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
    createdAt: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        address: '',
        city: '',
        country: '',
        dateOfBirth: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch('/api/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    router.push('/login');
                    return;
                }
                throw new Error('Failed to fetch profile');
            }

            const data = await response.json();
            setProfile(data.user);
            setFormData({
                name: data.user.name || '',
                mobile: data.user.mobile || '',
                address: data.user.address || '',
                city: data.user.city || '',
                country: data.user.country || '',
                dateOfBirth: data.user.dateOfBirth ? data.user.dateOfBirth.split('T')[0] : '',
            });
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update profile');
            }

            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
            await fetchProfile();
        } catch (err: any) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
        } finally {
            setSaving(false);
        }
    };

    const getMemberSince = () => {
        if (!profile?.createdAt) return 'N/A';
        const date = new Date(profile.createdAt);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    const getDaysSinceJoined = () => {
        if (!profile?.createdAt) return 0;
        const joinDate = new Date(profile.createdAt);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - joinDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (loading) {
        return (
            <main className="min-h-screen relative pb-32 bg-gradient-to-br from-amber-50/30 via-yellow-50/30 to-orange-50/30">
                <FlowingWaveBackground />
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

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Hero Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center space-y-4 mb-12"
                    >
                        <h1 className="text-5xl md:text-6xl font-black text-neutral-900 tracking-tighter leading-[0.9]">
                            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4a044e] via-[#a21caf] to-[#4a044e] animate-gradient">Profile</span>
                        </h1>
                        <p className="text-lg text-neutral-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            Manage your account information and preferences
                        </p>
                    </motion.div>

                    {/* Messages */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-4xl mx-auto mb-6 glass-3d rounded-2xl p-4 border-l-4 border-red-500"
                            >
                                <p className="text-red-700 font-semibold">{error}</p>
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-4xl mx-auto mb-6 glass-3d rounded-2xl p-4 border-l-4 border-green-500"
                            >
                                <p className="text-green-700 font-semibold">{success}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {/* Analytics Cards - Left Sidebar */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Profile Summary Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="glass-3d rounded-[2.5rem] overflow-hidden p-8"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4a044e] via-yellow-400 to-[#4a044e]" />

                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-4">
                                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#4a044e] to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-xl">
                                            {profile?.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <button className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border-4 border-white">
                                            <Camera className="w-5 h-5 text-[#4a044e]" />
                                        </button>
                                    </div>

                                    <h2 className="text-2xl font-black text-neutral-900">{profile?.name || 'User'}</h2>
                                    <p className="text-sm text-neutral-600 font-semibold mt-1">{profile?.email}</p>

                                    <div className="flex gap-2 mt-4 flex-wrap justify-center">
                                        {profile?.isEmailVerified && (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                ✓ Email Verified
                                            </span>
                                        )}
                                        {profile?.isMobileVerified && (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                                ✓ Mobile Verified
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Analytics Stats */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="glass-3d rounded-[2.5rem] overflow-hidden p-6"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-orange-400" />

                                <h3 className="text-lg font-black text-neutral-900 mb-4 flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-[#4a044e]" />
                                    Account Analytics
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-neutral-500 font-semibold">Member Since</p>
                                                <p className="text-sm font-black text-neutral-900">{getMemberSince()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                                                <Activity className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-neutral-500 font-semibold">Days Active</p>
                                                <p className="text-sm font-black text-neutral-900">{getDaysSinceJoined()} days</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                                                <Award className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-neutral-500 font-semibold">Account Tier</p>
                                                <p className="text-sm font-black text-neutral-900">Standard</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Main Profile Form - Right Section */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2 glass-3d rounded-[2.5rem] overflow-hidden p-8 md:p-10"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#4a044e] via-yellow-400 to-[#4a044e]" />

                            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-8">Personal Information</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-[#4a044e] outline-none transition-all font-semibold bg-white"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* Mobile */}
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2">
                                        <Phone className="w-4 h-4" />
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.mobile}
                                        onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-[#4a044e] outline-none transition-all font-semibold bg-white"
                                        placeholder="+1234567890"
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-[#4a044e] outline-none transition-all font-semibold bg-white"
                                    />
                                </div>

                                {/* Country */}
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.country}
                                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-[#4a044e] outline-none transition-all font-semibold bg-white"
                                        placeholder="Enter your country"
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-[#4a044e] outline-none transition-all font-semibold bg-white"
                                        placeholder="Enter your city"
                                    />
                                </div>

                                {/* Address - Full Width */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-neutral-700 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 focus:border-[#4a044e] outline-none transition-all font-semibold bg-white"
                                        placeholder="Enter your full address"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 bg-gradient-to-r from-[#4a044e] to-[#701a75] text-white py-4 rounded-xl font-black tracking-wide flex items-center justify-center gap-2 hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => router.push('/settings')}
                                    className="px-8 py-4 bg-neutral-200 text-neutral-800 rounded-xl font-black tracking-wide flex items-center justify-center gap-2 hover:bg-neutral-300 transition-all"
                                >
                                    <Lock className="w-5 h-5" />
                                    Settings
                                </button>
                            </div>

                            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#4a044e] via-yellow-400 to-[#4a044e]" />
                        </motion.div>
                    </div>
                </div>
            </section>
        </main>
    );
}
