
import React, { useState } from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { type Activity, ActivityStatus, Role } from '../../../types';
import { useActivities, useCreateActivity, useUpdateActivity, useUpdateActivityStatus, useDeleteActivity } from '../api/activities.hooks';
import { Scan, Loader2, Edit, Info, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const normalizeStatus = (status: string): string => {
  const value = status.toLowerCase();
  if (value === ActivityStatus.UPCOMING || value === 'upcoming') return ActivityStatus.UPCOMING;
  if (value === ActivityStatus.REGISTRATION_CLOSED || value === 'registration closed' || value === 'closed') return ActivityStatus.REGISTRATION_CLOSED;
  if (value === ActivityStatus.ONGOING || value === 'ongoing') return ActivityStatus.ONGOING;
  if (value === ActivityStatus.COMPLETED || value === 'completed') return ActivityStatus.COMPLETED;
  return status;
};

const getStatusLabel = (status: string): string => {
  const normalized = normalizeStatus(status);
  if (normalized === ActivityStatus.REGISTRATION_CLOSED) return 'Closed';
  if (normalized === ActivityStatus.ONGOING) return 'Ongoing';
  if (normalized === ActivityStatus.COMPLETED) return 'Completed';
  if (normalized === ActivityStatus.UPCOMING) return 'Upcoming';
  return status;
};

export const AdminActivities: React.FC = () => {
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

  const { data: activities = [], isLoading: isFetching } = useActivities();
  const createActivityMutation = useCreateActivity();
  const updateActivityMutation = useUpdateActivity();
  const updateStatusMutation = useUpdateActivityStatus();
  const deleteActivityMutation = useDeleteActivity();

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      deleteActivityMutation.mutate(id, {
        onSuccess: () => {
          toast.success('Activity deleted successfully');
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to delete activity');
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = {
      ...form,
      startDateTime: new Date(form.startDateTime),
    };

    if (form.endDateTime) {
      data.endDateTime = new Date(form.endDateTime);
    } else {
      delete data.endDateTime;
    }

    const mutation = editingAct ? updateActivityMutation : createActivityMutation;
    const mutationArgs = editingAct ? { id: editingAct.id, data } : data;

    (mutation as any).mutate(mutationArgs, {
      onSuccess: () => {
        toast.success(`Activity ${editingAct ? 'updated' : 'created'} successfully!`);
        setShowModal(false);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Action failed');
      }
    });
  };

  const handleEdit = (act: Activity) => {
    const formatDateForInput = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, 16);
      return localISOTime;
    };

    setEditingAct(act);
    setForm({
      title: act.title,
      description: act.description,
      startDateTime: formatDateForInput(act.startDateTime),
      endDateTime: act.endDateTime ? formatDateForInput(act.endDateTime) : '',
      location: act.location,
      status: act.status
    });
    setShowModal(true);
  };

  const handleStatusUpdate = async (activityId: string, status: string) => {
    updateStatusMutation.mutate({ activityId, status }, {
      onSuccess: () => {
        toast.success(`Status updated to ${status}`);
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update status');
      }
    });
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
        {isFetching ? (
          <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <span className="font-black uppercase tracking-widest text-slate-400">Loading Events...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="col-span-full py-20 text-center text-slate-400">
            <span className="font-black uppercase tracking-widest">No Events Found</span>
          </div>
        ) : activities.map(act => (
          <div key={act.id} className="bg-white p-6 rounded-[2rem] border shadow-sm flex flex-col gap-4">
            <h3 className="font-bold text-lg">{act.title}</h3>
            <p className="text-sm text-slate-500">{act.description}</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</span>
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                  {getStatusLabel(act.status)}
                </span>
              </div>
              <select
                value={normalizeStatus(act.status)}
                onChange={(e) => handleStatusUpdate(act.id, e.target.value)}
                disabled={updateStatusMutation.isPending && updateStatusMutation.variables?.activityId === act.id}
                className="w-full bg-white border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {normalizeStatus(act.status) === ActivityStatus.UPCOMING && (
                  <option value={ActivityStatus.UPCOMING}>Upcoming</option>
                )}
                <option value={ActivityStatus.REGISTRATION_CLOSED}>Closed</option>
                <option value={ActivityStatus.ONGOING}>Ongoing</option>
                <option value={ActivityStatus.COMPLETED}>Completed</option>
              </select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {normalizeStatus(act.status) === ActivityStatus.ONGOING && (
                <button onClick={() => navigate(`/admin/scan/${act.id}`)} className="bg-slate-900 text-white py-2 rounded-xl text-xs font-bold uppercase hover:bg-black transition-all">
                  <Scan size={14} className="inline mr-1" /> Scan
                </button>
              )}
              <button
                onClick={() => navigate(`/admin/activity/${act.id}`)}
                className="bg-blue-100 text-blue-600 py-2 rounded-xl text-xs font-bold uppercase hover:bg-blue-200 transition-all"
              >
                <Info size={14} className="inline mr-1" /> Details
              </button>
              <button
                onClick={() => handleEdit(act)}
                className="bg-slate-100 text-slate-600 py-2 rounded-xl text-xs font-bold uppercase hover:bg-slate-200 transition-all"
              >
                <Edit size={14} className="inline mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(act.id)}
                disabled={deleteActivityMutation.isPending && deleteActivityMutation.variables === act.id}
                className="bg-red-100 text-red-600 py-2 rounded-xl text-xs font-bold uppercase hover:bg-red-200 transition-all disabled:opacity-50"
              >
                <Trash2 size={14} className="inline mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-black mb-6">{editingAct ? 'Edit Activity' : 'Activity Entry'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Title" required className="w-full p-4 border rounded-2xl" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <textarea placeholder="Description" className="w-full p-4 border rounded-2xl" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Start Date & Time</label>
                  <input type="datetime-local" required className="w-full p-4 border rounded-2xl" value={form.startDateTime} onChange={e => setForm({ ...form, startDateTime: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">End Date & Time (Optional)</label>
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
