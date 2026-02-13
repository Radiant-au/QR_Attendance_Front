
import React from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { ActivityStatus, Role } from '../../../types';
import { Users, Calendar, Activity as ActivityIcon } from 'lucide-react';
import { useUsers } from '../../users/api/users.hooks';
import { useActivities } from '../../activities/api/activities.hooks';

const normalizeStatus = (status?: string): string => {
  if (!status) return '';
  const value = status.toLowerCase();

  if (value === ActivityStatus.UPCOMING || value === 'upcoming') return ActivityStatus.UPCOMING;
  if (value === ActivityStatus.REGISTRATION_CLOSED || value === 'registration closed' || value === 'closed') return ActivityStatus.REGISTRATION_CLOSED;
  if (value === ActivityStatus.ONGOING || value === 'ongoing') return ActivityStatus.ONGOING;
  if (value === ActivityStatus.COMPLETED || value === 'completed') return ActivityStatus.COMPLETED;

  return value;
};

export const AdminDashboard: React.FC = () => {
  const { data: users = [], isLoading: isUsersLoading, isError: isUsersError } = useUsers();
  const { data: activities = [], isLoading: isActivitiesLoading, isError: isActivitiesError } = useActivities();

  const totalStudents = users.filter((user) => user.role === Role.USER).length;
  const activeEvents = activities.filter((activity) => normalizeStatus(activity.status) === ActivityStatus.ONGOING).length;
  const upcomingEvents = activities.filter((activity) => normalizeStatus(activity.status) === ActivityStatus.UPCOMING).length;

  const isLoading = isUsersLoading || isActivitiesLoading;
  const hasError = isUsersError || isActivitiesError;

  const stats = [
    { label: 'Total Students', value: totalStudents.toString(), icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Active Events', value: activeEvents.toString(), icon: ActivityIcon, bg: 'bg-green-50', color: 'text-green-600' },
    { label: 'Upcoming', value: upcomingEvents.toString(), icon: Calendar, bg: 'bg-amber-50', color: 'text-amber-600' },
  ];

  return (
    <MainLayout role={Role.ADMIN}>
      <header className="mb-8">
        <h2 className="text-3xl font-black text-slate-900">Admin Command Center</h2>
        <p className="text-slate-500 italic">Monitor club metrics and growth in real-time.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border shadow-sm flex items-center gap-5">
            <div className={`w-16 h-16 rounded-[1.25rem] ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}><stat.icon size={32} /></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900">{isLoading ? '...' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-[2rem] border p-8 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Activity Overview</h3>
        {hasError ? (
          <p className="text-red-500 text-sm">Some dashboard data failed to load. Please refresh the page.</p>
        ) : (
          <p className="text-slate-400 text-sm">Real-time charts and reports integration coming soon...</p>
        )}
      </div>
    </MainLayout>
  );
};
