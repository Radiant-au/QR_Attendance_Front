
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { Activity, ActivityStatus, Role } from '../../../types';
import { getActivities, createActivity, updateActivity, deleteActivity, updateStatus } from '../api/activities';
import { CalendarPlus, Trash2, Edit2, Scan, Play, CheckCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AdminActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAct, setEditingAct] = useState<Activity | null>(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '', location: '', status: ActivityStatus.UPCOMING });

  const fetchActivities = async () => setActivities(await getActivities());
  useEffect(() => { fetchActivities(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAct) await updateActivity(editingAct.id, form);
    else await createActivity(form);
    setShowModal(false);
    fetchActivities();
  };

  const handleStatusUpdate = async (id: string, status: ActivityStatus) => {
    await updateStatus(id, status);
    fetchActivities();
  };

  return (
    <MainLayout role={Role.ADMIN}>
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black">Activity Control</h2>
        <button onClick={() => { setEditingAct(null); setForm({title:'',description:'',date:'',time:'',location:'',status:ActivityStatus.UPCOMING}); setShowModal(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold">
          Create Activity
        </button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map(act => (
          <div key={act.id} className="bg-white p-6 rounded-[2rem] border shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-lg">{act.title}</h3>
            <p className="text-sm text-slate-500">{act.description}</p>
            <div className="flex gap-2">
               {act.status === ActivityStatus.UPCOMING && <button onClick={() => handleStatusUpdate(act.id, ActivityStatus.REGISTRATION_CLOSED)} className="flex-1 bg-amber-500 text-white py-2 rounded-xl text-xs font-bold uppercase"><Lock size={14} className="inline mr-1" /> Close Reg</button>}
               {act.status === ActivityStatus.REGISTRATION_CLOSED && <button onClick={() => handleStatusUpdate(act.id, ActivityStatus.ONGOING)} className="flex-1 bg-green-600 text-white py-2 rounded-xl text-xs font-bold uppercase"><Play size={14} className="inline mr-1" /> Start</button>}
               {act.status === ActivityStatus.ONGOING && <button onClick={() => navigate(`/admin/scan/${act.id}`)} className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-xs font-bold uppercase"><Scan size={14} className="inline mr-1" /> Scan</button>}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-6">Activity Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Title" required className="w-full p-4 border rounded-2xl" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              <textarea placeholder="Description" className="w-full p-4 border rounded-2xl" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              <div className="flex gap-4">
                <input type="date" className="flex-1 p-4 border rounded-2xl" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                <input type="time" className="flex-1 p-4 border rounded-2xl" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
              </div>
              <input placeholder="Venue" className="w-full p-4 border rounded-2xl" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 border rounded-2xl font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-bold">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
