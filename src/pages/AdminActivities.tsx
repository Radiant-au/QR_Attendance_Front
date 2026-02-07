
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Activity, ActivityStatus, Role } from '../types';
import { activityApi } from '../services/api';
// Fix: Added missing Calendar and MapPin imports from lucide-react
import { CalendarPlus, Trash2, Edit2, Scan, Play, CheckCircle, Lock, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAct, setEditingAct] = useState<Activity | null>(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    status: ActivityStatus.UPCOMING
  });

  const fetchActivities = async () => {
    setIsLoading(true);
    const data = await activityApi.getActivities();
    setActivities(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAct) {
      await activityApi.updateActivity(editingAct.id, form);
    } else {
      await activityApi.createActivity(form);
    }
    setShowModal(false);
    setEditingAct(null);
    setForm({ title: '', description: '', date: '', time: '', location: '', status: ActivityStatus.UPCOMING });
    fetchActivities();
  };

  const handleEdit = (act: Activity) => {
    setEditingAct(act);
    setForm({ ...act });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this activity permanently?')) {
      await activityApi.deleteActivity(id);
      fetchActivities();
    }
  };

  const updateStatus = async (id: string, status: ActivityStatus) => {
    await activityApi.updateStatus(id, status);
    fetchActivities();
  };

  return (
    <Layout role={Role.ADMIN}>
      <div className="space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Activity Control</h2>
            <p className="text-slate-500 text-sm font-medium italic">Command center for your club events.</p>
          </div>
          <button 
            onClick={() => {
              setEditingAct(null);
              setForm({ title: '', description: '', date: '', time: '', location: '', status: ActivityStatus.UPCOMING });
              setShowModal(true);
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            <CalendarPlus size={20} />
            Create Activity
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-400 gap-4">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="font-bold text-sm tracking-widest uppercase">Initializing Registry...</p>
            </div>
          ) : activities.map(act => (
            <div key={act.id} className="bg-white p-6 rounded-[2rem] border border-slate-200 flex flex-col gap-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-lg text-slate-900 truncate max-w-[200px]">{act.title}</h3>
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                    act.status === ActivityStatus.ONGOING ? 'bg-green-100 text-green-700' : 
                    act.status === ActivityStatus.REGISTRATION_CLOSED ? 'bg-amber-100 text-amber-700' :
                    act.status === ActivityStatus.COMPLETED ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {act.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{act.description}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-slate-400">
                   <div className="flex items-center gap-1"><Calendar size={12}/> {act.date}</div>
                   <div className="flex items-center gap-1"><MapPin size={12}/> {act.location}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                {act.status === ActivityStatus.ONGOING && (
                  <button 
                    onClick={() => navigate(`/admin/scan/${act.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-200"
                  >
                    <Scan size={16} /> Scan
                  </button>
                )}
                
                {act.status === ActivityStatus.UPCOMING && (
                  <button 
                    onClick={() => updateStatus(act.id, ActivityStatus.REGISTRATION_CLOSED)}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest"
                    title="Close Registration"
                  >
                    <Lock size={16} /> Close Reg
                  </button>
                )}

                {act.status === ActivityStatus.REGISTRATION_CLOSED && (
                  <button 
                    onClick={() => updateStatus(act.id, ActivityStatus.ONGOING)}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest"
                  >
                    <Play size={16} /> Start Now
                  </button>
                )}

                {act.status === ActivityStatus.ONGOING && (
                  <button 
                    onClick={() => updateStatus(act.id, ActivityStatus.COMPLETED)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest"
                  >
                    <CheckCircle size={16} /> Finish
                  </button>
                )}

                <div className="flex gap-1 ml-auto">
                   <button onClick={() => handleEdit(act)} className="p-3 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
                     <Edit2 size={18} />
                   </button>
                   <button onClick={() => handleDelete(act.id)} className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                     <Trash2 size={18} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300 shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900 mb-6">{editingAct ? 'Modify' : 'Launch'} Activity</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 px-1">Event Title</label>
                  <input required className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 px-1">Detailed Description</label>
                  <textarea rows={3} className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 font-medium focus:ring-4 focus:ring-blue-100 transition-all outline-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 px-1">Date</label>
                  <input type="date" required className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold outline-none" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 px-1">Starting Time</label>
                  <input type="time" required className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold outline-none" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 px-1">Venue / Room</label>
                  <input required className="w-full px-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 font-bold outline-none" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700">Submit Registry</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminActivities;
