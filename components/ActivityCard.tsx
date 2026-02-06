
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { Activity, ActivityStatus } from '../types';

interface ActivityCardProps {
  activity: Activity;
  isRegistered?: boolean;
  onRegister?: (id: string) => void;
  onCancel?: (id: string, reason: string) => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  activity, 
  isRegistered = false, 
  onRegister, 
  onCancel 
}) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const statusColors = {
    [ActivityStatus.UPCOMING]: 'bg-blue-100 text-blue-700 border-blue-200',
    [ActivityStatus.ONGOING]: 'bg-green-100 text-green-700 border-green-200',
    [ActivityStatus.COMPLETED]: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCancel && cancelReason) {
      onCancel(activity.id, cancelReason);
      setShowCancelDialog(false);
      setCancelReason('');
    }
  };

  const canRegister = activity.status === ActivityStatus.UPCOMING;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[activity.status]}`}>
            {activity.status}
          </span>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
            <Users size={14} />
            {activity.registeredCount} Registered
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{activity.title}</h3>
        <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {activity.description}
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Calendar size={14} className="text-blue-500" />
            {activity.date}
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Clock size={14} className="text-blue-500" />
            {activity.time}
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <MapPin size={14} className="text-blue-500" />
            {activity.location}
          </div>
        </div>

        <div className="flex gap-2">
          {!isRegistered ? (
            canRegister ? (
              <button
                onClick={() => onRegister?.(activity.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors shadow-sm text-sm"
              >
                Register Now
              </button>
            ) : (
              <div className="flex-1 py-2.5 bg-slate-100 text-slate-400 rounded-xl text-center text-sm font-medium border border-slate-200">
                Registration Closed
              </div>
            )
          ) : (
            <div className="w-full flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2 py-2 px-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                <CheckCircle2 size={16} />
                Registered
              </div>
              {activity.status === ActivityStatus.ONGOING && (
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="w-full text-red-600 text-sm font-medium hover:underline py-1"
                >
                  Submit Leave Request
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showCancelDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold mb-4">Leave Request</h2>
            <p className="text-slate-600 text-sm mb-4">
              Please provide a reason for cancelling your registration for "{activity.title}".
            </p>
            <form onSubmit={handleCancelSubmit}>
              <textarea
                required
                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-4 min-h-[100px]"
                placeholder="Reason (e.g. Health issue, Class conflict)"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Users = ({ size, className }: { size?: number; className?: string }) => (
  <svg 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default ActivityCard;
