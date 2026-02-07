
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
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Admin Command Center</h2>
            <p className="text-slate-500 text-sm font-medium italic">Monitor club metrics and growth in real-time.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
             <button 
              onClick={() => navigate('/admin/scan')}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
             >
               <Scan size={18} />
               Scan Attendance
             </button>
             <button 
              onClick={() => navigate('/admin/activities')}
              className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3.5 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
             >
               <Plus size={18} />
               Add Activity
             </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
               <div className={`w-16 h-16 rounded-[1.25rem] ${stat.bg} ${stat.color} flex items-center justify-center shrink-0`}>
                  <stat.icon size={32} />
               </div>
               <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                 <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
               </div>
            </div>
          ))}
        </div>

        {/* Quick Management Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* User Management Preview */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
             <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                   <Users size={20} className="text-blue-600" />
                   Recent Activity
                </h3>
                <button 
                  onClick={() => navigate('/admin/users')}
                  className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline"
                >
                  View All
                </button>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead>
                      <tr className="bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest">
                         <th className="px-8 py-4">Student Name</th>
                         <th className="px-8 py-4">Current Event</th>
                         <th className="px-8 py-4">Logged Time</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {[1, 2, 3, 4, 5].map(i => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-5 font-bold text-slate-700">Student #{1024 + i}</td>
                           <td className="px-8 py-5 text-slate-500 font-medium italic">Python Workshop</td>
                           <td className="px-8 py-5 text-slate-400 font-bold">{i * 12} mins ago</td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Activity Management Preview */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
             <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                   <Calendar size={20} className="text-blue-600" />
                   Status Tracker
                </h3>
                <button 
                  onClick={() => navigate('/admin/activities')}
                  className="text-blue-600 text-xs font-black uppercase tracking-widest hover:underline"
                >
                  Manage Events
                </button>
             </div>
             <div className="p-6 space-y-4">
                {[
                  { name: 'Hackathon 2024', status: 'Ongoing', count: '120/150' },
                  { name: 'ML/AI Workshop', status: 'Ongoing', count: '45/50' },
                  { name: 'Open Source Day', status: 'Draft', count: '0/100' },
                ].map((act, i) => (
                  <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-100 transition-colors group">
                     <div>
                       <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{act.name}</p>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{act.count} Participants</p>
                     </div>
                     <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
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
