import React, { useState } from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { Role, type Major, type Year } from '../../../types';
import { STORAGE_KEYS } from '../../../config';
import { useUser, useUpdateUser } from '../api/users.hooks';
import { toast } from 'sonner';
import { User, GraduationCap, Calendar, CheckCircle2, XCircle, Edit2, Save } from 'lucide-react';

export const Profile: React.FC = () => {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    const currentUser = userJson ? JSON.parse(userJson) : null;
    const userId = currentUser?.id;

    const { data: user, isLoading } = useUser(userId);
    const updateMutation = useUpdateUser();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        major: '' as Major,
        year: '' as Year,
    });

    React.useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                major: user.major || '' as Major,
                year: user.year || '' as Year,
            });
        }
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.fullName || !formData.major || !formData.year) {
            toast.error('Please fill in all fields');
            return;
        }

        updateMutation.mutate(
            { id: userId, data: { ...formData, isProfileCompleted: true } },
            {
                onSuccess: (updatedUser) => {
                    toast.success('Profile updated successfully!');
                    setIsEditing(false);
                    // Update localStorage
                    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
                },
                onError: (error: any) => {
                    toast.error(error.message || 'Failed to update profile');
                },
            }
        );
    };

    if (isLoading) {
        return (
            <MainLayout role={Role.USER}>
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-64 bg-slate-200 rounded-3xl"></div>
                </div>
            </MainLayout>
        );
    }

    if (!user) {
        return (
            <MainLayout role={Role.USER}>
                <div className="text-center py-12">
                    <p className="text-slate-500">User not found</p>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout role={Role.USER}>
            <header className="mb-8">
                <h2 className="text-3xl font-black text-slate-900">My Profile</h2>
                <p className="text-slate-500 italic">Manage your account and view attendance</p>
            </header>

            {/* Profile Info Card */}
            <div className="bg-white rounded-[2rem] border shadow-sm p-8 mb-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-slate-900">Profile Information</h3>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            <Edit2 size={16} />
                            <span className="font-medium">Edit</span>
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Major</label>
                            <select
                                value={formData.major}
                                onChange={(e) => setFormData({ ...formData, major: e.target.value as Major })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Major</option>
                                <option value="IS">Information Systems (IS)</option>
                                <option value="CE">Computer Engineering (CE)</option>
                                <option value="EcE">Electrical Engineering (EcE)</option>
                                <option value="PrE">Production Engineering (PrE)</option>
                                <option value="AME">Applied Mechanics Engineering (AME)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Year</label>
                            <select
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: e.target.value as Year })}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Year</option>
                                <option value="1st">1st Year</option>
                                <option value="2nd">2nd Year</option>
                                <option value="3rd">3rd Year</option>
                                <option value="4th">4th Year</option>
                                <option value="5th">5th Year</option>
                                <option value="6th">6th Year</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                <Save size={16} />
                                <span className="font-bold">{updateMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-bold"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase">Username</p>
                                <p className="text-lg font-bold text-slate-900">{user.username}</p>
                            </div>
                        </div>

                        {user.fullName && (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Full Name</p>
                                    <p className="text-lg font-bold text-slate-900">{user.fullName}</p>
                                </div>
                            </div>
                        )}

                        {user.major && (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                    <GraduationCap size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Major</p>
                                    <p className="text-lg font-bold text-slate-900">{user.major}</p>
                                </div>
                            </div>
                        )}

                        {user.year && (
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Year</p>
                                    <p className="text-lg font-bold text-slate-900">{user.year}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Attendance History */}
            <div className="bg-white rounded-[2rem] border shadow-sm p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Attendance History</h3>

                {user.attendances && user.attendances.length > 0 ? (
                    <div className="space-y-4">
                        {user.attendances.map((attendance, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${attendance.isPresent
                                        ? 'bg-green-50 text-green-600'
                                        : 'bg-red-50 text-red-600'
                                        }`}>
                                        {attendance.isPresent ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{attendance.actvityName}</p>
                                        <p className="text-sm text-slate-500">
                                            {attendance.isPresent ? 'Present' : 'Absent'} • {attendance.scanMethod}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                            <Calendar size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">No attendance records yet</p>
                        <p className="text-sm text-slate-400 mt-1">Your attendance will appear here once you attend events</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
