
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { type Activity, ActivityStatus, Role } from '../../../types';
import { getActivities, createActivity, updateActivity, updateStatus } from '../api/activities';
import { Scan, Play, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const AdminActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAct, setEditingAct] = useState<Activity | null>(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    location: '',
    status: 'Upcoming'
  });

  const fetchActivities = async () => {
    try {
      const data = await getActivities(true);
      setActivities(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch activities');
    }
  };
  useEffect(() => { fetchActivities(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        startDateTime: new Date(form.startDateTime).toISOString(),
        endDateTime: new Date(form.endDateTime || form.startDateTime).toISOString()
      };

      if (editingAct) {
        await updateActivity(editingAct.id, data);
        toast.success('Activity updated successfully!');
      } else {
        await createActivity(data);
        toast.success('Activity created successfully!');
      }
      setShowModal(false);
      fetchActivities();
    } catch (error: any) {
      toast.error(error.message || 'Action failed');
    }
  };

  const handleStatusUpdate = async (activityId: string, status: string) => {
    try {
      await updateStatus(activityId, status);
      toast.success(`Status updated to ${status}`);
      fetchActivities();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  return (
    <MainLayout role={Role.ADMIN}>
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black">Activity Control</h2>
        <button onClick={() => {
          setEditingAct(null);
          setForm({ title: '', description: '', startDateTime: '', endDateTime: '', location: '', status: 'Upcoming' });
          setShowModal(true);
        }} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold">
          Create Activity
        </button>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map(act => (
          <div key={act.id} className="bg-white p-6 rounded-[2rem] border shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-lg">{act.title}</h3>
            <p className="text-sm text-slate-500">{act.description}</p>
            <div className="flex gap-2">
              {(act.status === ActivityStatus.UPCOMING || act.status === 'Upcoming') && <button onClick={() => handleStatusUpdate(act.id, ActivityStatus.REGISTRATION_CLOSED)} className="flex-1 bg-amber-500 text-white py-2 rounded-xl text-xs font-bold uppercase"><Lock size={14} className="inline mr-1" /> Close Reg</button>}
              {(act.status === ActivityStatus.REGISTRATION_CLOSED || act.status === 'Registration Closed') && <button onClick={() => handleStatusUpdate(act.id, ActivityStatus.ONGOING)} className="flex-1 bg-green-600 text-white py-2 rounded-xl text-xs font-bold uppercase"><Play size={14} className="inline mr-1" /> Start</button>}
              {(act.status === ActivityStatus.ONGOING || act.status === 'Ongoing') && <button onClick={() => navigate(`/admin/scan/${act.id}`)} className="flex-1 bg-slate-900 text-white py-2 rounded-xl text-xs font-bold uppercase"><Scan size={14} className="inline mr-1" /> Scan</button>}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-black mb-6">Activity Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Title" required className="w-full p-4 border rounded-2xl" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <textarea placeholder="Description" className="w-full p-4 border rounded-2xl" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Start Date & Time</label>
                  <input type="datetime-local" required className="w-full p-4 border rounded-2xl" value={form.startDateTime} onChange={e => setForm({ ...form, startDateTime: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">End Date & Time</label>
                  <input type="datetime-local" className="w-full p-4 border rounded-2xl" value={form.endDateTime} onChange={e => setForm({ ...form, endDateTime: e.target.value })} />
                </div>
              </div>
              <input placeholder="Venue" className="w-full p-4 border rounded-2xl" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
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
