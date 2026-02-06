
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Activity, ActivityStatus, Role } from '../types';
import { activityApi } from '../services/api';
import { CalendarPlus, Trash2, Edit2, Scan, Play, CheckCircle } from 'lucide-react';
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
    if (confirm('Delete this activity?')) {
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
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Activity Management</h2>
            <p className="text-slate-500 text-sm">Organize workshops, hackathons, and meetings.</p>
          </div>
          <button 
            onClick={() => {
              setEditingAct(null);
              setForm({ title: '', description: '', date: '', time: '', location: '', status: ActivityStatus.UPCOMING });
              setShowModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            <CalendarPlus size={18} />
            Create New
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {isLoading ? (
            <div className="col-span-full py-20 text-center text-slate-400">Loading...</div>
          ) : activities.map(act => (
            <div key={act.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col md:flex-row gap-4 items-start md:items-center shadow-sm">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{act.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    act.status === ActivityStatus.ONGOING ? 'bg-green-100 text-green-700' : 
                    act.status === ActivityStatus.COMPLETED ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {act.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-1">{act.description}</p>
                <p className="text-xs text-slate-400">{act.date} @ {act.time} - {act.location}</p>
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                {act.status === ActivityStatus.ONGOING && (
                  <button 
                    onClick={() => navigate(`/admin/scan/${act.id}`)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-bold"
                  >
                    <Scan size={16} /> Scan
                  </button>
                )}
                
                {act.status === ActivityStatus.UPCOMING && (
                  <button 
                    onClick={() => updateStatus(act.id, ActivityStatus.ONGOING)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Start Activity"
                  >
                    <Play size={18} />
                  </button>
                )}

                {act.status === ActivityStatus.ONGOING && (
                  <button 
                    onClick={() => updateStatus(act.id, ActivityStatus.COMPLETED)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Complete Activity"
                  >
                    <CheckCircle size={18} />
                  </button>
                )}

                <button onClick={() => handleEdit(act)} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(act.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-4">{editingAct ? 'Edit Activity' : 'Create Activity'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                  <textarea rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                  <input type="date" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                  <input type="time" required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                  <input required className="w-full px-4 py-3 rounded-xl border border-slate-200" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default AdminActivities;
