
import React from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { Role } from '../../../types';
import { Users, Calendar, Activity as ActivityIcon } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'Total Students', value: '842', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
    { label: 'Active Events', value: '3', icon: ActivityIcon, bg: 'bg-green-50', color: 'text-green-600' },
    { label: 'Upcoming', value: '12', icon: Calendar, bg: 'bg-amber-50', color: 'text-amber-600' },
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
               <p className="text-3xl font-black text-slate-900">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-[2rem] border p-8 shadow-sm">
        <h3 className="font-bold text-lg mb-4">Activity Overview</h3>
        <p className="text-slate-400 text-sm">Real-time charts and reports integration coming soon...</p>
      </div>
    </MainLayout>
  );
};
