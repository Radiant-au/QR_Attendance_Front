import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { Role, type RegisterAttendanceResponseDTO } from '../../../types';
import { useActivity, useActivityAttendance } from '../api/activities.hooks';
import { ChevronLeft, Users, CheckCircle2, XCircle, Calendar, GraduationCap, Clock } from 'lucide-react';

export const ActivityDetails: React.FC = () => {
    const { activityId } = useParams<{ activityId: string }>();
    const navigate = useNavigate();

    const { data: activity, isLoading: activityLoading } = useActivity(activityId || '');
    const { data: attendanceData, isLoading: attendanceLoading } = useActivityAttendance(activityId || '');

    const typedData = attendanceData as RegisterAttendanceResponseDTO | undefined;

    if (activityLoading || attendanceLoading) {
        return (
            <MainLayout role={Role.ADMIN}>
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-64 bg-slate-200 rounded-3xl"></div>
                </div>
            </MainLayout>
        );
    }

    if (!activity) {
        return (
            <MainLayout role={Role.ADMIN}>
                <div className="text-center py-12">
                    <p className="text-slate-500">Activity not found</p>
                </div>
            </MainLayout>
        );
    }

    const registrationCount = typedData?.registration?.length || 0;
    const attendanceCount = typedData?.attendance?.filter(a => a.isPresent)?.length || 0;

    return (
        <MainLayout role={Role.ADMIN}>
            {/* Header */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/admin/activities')}
                    className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
                >
                    <ChevronLeft size={20} />
                    <span className="font-medium">Back</span>
                </button>
                <h2 className="text-3xl font-black text-slate-900">{activity.title}</h2>
                <p className="text-slate-500 italic mt-2">{activity.description}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-[2rem] p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Users size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-bold opacity-90">Total Registrations</p>
                            <p className="text-4xl font-black">{registrationCount}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-[2rem] p-6 text-white shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <CheckCircle2 size={32} />
                        </div>
                        <div>
                            <p className="text-sm font-bold opacity-90">Total Attendance</p>
                            <p className="text-4xl font-black">{attendanceCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Registered Users */}
            <div className="bg-white rounded-[2rem] border shadow-sm p-8 mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Users size={24} className="text-blue-600" />
                    Registered Users ({registrationCount})
                </h3>

                {typedData?.registration && typedData.registration.length > 0 ? (
                    <div className="space-y-3">
                        {typedData.registration.map((reg, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                        {reg.fullName?.charAt(0) || reg.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{reg.fullName || reg.username}</p>
                                        <p className="text-sm text-slate-500">@{reg.username}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <GraduationCap size={16} />
                                        <span>{reg.major}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Calendar size={16} />
                                        <span>{reg.year}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Clock size={16} />
                                        <span>{new Date(reg.registeredAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                            <Users size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">No registrations yet</p>
                        <p className="text-sm text-slate-400 mt-1">Users will appear here once they register</p>
                    </div>
                )}
            </div>

            {/* Attendance Records */}
            <div className="bg-white rounded-[2rem] border shadow-sm p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <CheckCircle2 size={24} className="text-green-600" />
                    Attendance Records ({attendanceCount})
                </h3>

                {typedData?.attendance && typedData.attendance.length > 0 ? (
                    <div className="space-y-3">
                        {typedData.attendance.map((att) => (
                            <div
                                key={att.id}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${att.isPresent
                                    ? 'border-green-200 bg-green-50/50 hover:border-green-300'
                                    : 'border-red-200 bg-red-50/50 hover:border-red-300'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${att.isPresent
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-red-100 text-red-600'
                                            }`}
                                    >
                                        {att.isPresent ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{att.userName}</p>
                                        <p className="text-sm text-slate-500">
                                            {att.attendanceType} {att.notes && `• ${att.notes}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <GraduationCap size={16} />
                                        <span>{att.major}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Calendar size={16} />
                                        <span>{att.year}</span>
                                    </div>
                                    <div
                                        className={`px-3 py-1 rounded-lg font-bold text-xs ${att.isPresent
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {att.isPresent ? 'Present' : 'Absent'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">No attendance records yet</p>
                        <p className="text-sm text-slate-400 mt-1">Attendance will appear here once the activity starts</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};
