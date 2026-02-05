'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Save, Lock, LogOut, Camera } from 'lucide-react';

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
            await fetchProfile();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4a044e] border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#4a044e] to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                                    {profile?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
                                    <Camera className="w-4 h-4 text-[#4a044e]" />
                                </button>
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900">{profile?.name || 'User'}</h1>
                                <p className="text-gray-600">{profile?.email}</p>
                                <div className="flex gap-2 mt-2">
                                    {profile?.isEmailVerified && (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                            ✓ Email Verified
                                        </span>
                                    )}
                                    {profile?.isMobileVerified && (
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                            ✓ Mobile Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Messages */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-4"
                    >
                        {error}
                    </motion.div>
                )}
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-2xl mb-4"
                    >
                        {success}
                    </motion.div>
                )}

                {/* Profile Form */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Personal Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4a044e] outline-none transition-colors"
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Mobile */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Mobile Number
                            </label>
                            <input
                                type="tel"
                                value={formData.mobile}
                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4a044e] outline-none transition-colors"
                                placeholder="+1234567890"
                            />
                        </div>

                        {/* Date of Birth */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4a044e] outline-none transition-colors"
                            />
                        </div>

                        {/* Country */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                Country
                            </label>
                            <input
                                type="text"
                                value={formData.country}
                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4a044e] outline-none transition-colors"
                                placeholder="Enter your country"
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                City
                            </label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4a044e] outline-none transition-colors"
                                placeholder="Enter your city"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                Address
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4a044e] outline-none transition-colors"
                                placeholder="Enter your address"
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 bg-[#4a044e] text-white py-4 rounded-xl font-black tracking-wide flex items-center justify-center gap-2 hover:bg-[#5a055e] transition-colors disabled:opacity-50"
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
                            onClick={() => router.push('/change-password')}
                            className="px-8 py-4 bg-gray-200 text-gray-800 rounded-xl font-black tracking-wide flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors"
                        >
                            <Lock className="w-5 h-5" />
                            Change Password
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
