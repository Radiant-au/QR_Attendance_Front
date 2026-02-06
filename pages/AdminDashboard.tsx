
import React from 'react';
import Layout from '../components/Layout';
import { Role } from '../types';
import { Users, Calendar, Activity as ActivityIcon, Scan, Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const stats = [
    { label: 'Total Students', value: '842', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Active Events', value: '3', icon: ActivityIcon, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Upcoming', value: '12', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <Layout role={Role.ADMIN}>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Command Center</h2>
            <p className="text-slate-500 text-sm">Overview of club activities and member management.</p>
          </div>
          <div className="flex gap-3">
             <button 
              onClick={() => navigate('/admin/scan')}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
             >
               <Scan size={18} />
               Scan Attendance
             </button>
             <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all">
               <Plus size={18} />
               Create Activity
             </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
               <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                  <stat.icon size={28} />
               </div>
               <div>
                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 <p className="text-2xl font-black text-slate-900">{stat.value}</p>
               </div>
            </div>
          ))}
        </div>

        {/* Quick Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Management Preview */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                   <Users size={18} className="text-blue-600" />
                   Recent Registrations
                </h3>
                <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
             </div>
             <div className="flex-1">
                <table className="w-full text-left text-sm">
                   <thead>
                      <tr className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                         <th className="px-6 py-3">Student</th>
                         <th className="px-6 py-3">Activity</th>
                         <th className="px-6 py-3">Time</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {[1, 2, 3, 4, 5].map(i => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-6 py-4 font-medium text-slate-700">Student #{1024 + i}</td>
                           <td className="px-6 py-4 text-slate-500">Workshop Python</td>
                           <td className="px-6 py-4 text-slate-400">2h ago</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Activity Management Preview */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
             <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                   <Calendar size={18} className="text-blue-600" />
                   Active Activities
                </h3>
                <button className="text-blue-600 text-sm font-bold hover:underline">Manage All</button>
             </div>
             <div className="p-4 space-y-4">
                {[
                  { name: 'Hackathon 2024', status: 'Ongoing', count: '120/150' },
                  { name: 'ML/AI Workshop', status: 'Ongoing', count: '45/50' },
                  { name: 'Open Source Day', status: 'Draft', count: '0/100' },
                ].map((act, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50">
                     <div>
                       <p className="font-bold text-slate-900">{act.name}</p>
                       <p className="text-xs text-slate-400">{act.count} Participants</p>
                     </div>
                     <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                       act.status === 'Ongoing' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                     }`}>
                       {act.status}
                     </span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
