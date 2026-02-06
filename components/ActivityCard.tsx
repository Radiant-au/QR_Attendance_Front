
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, Info, Users, ArrowRight, XCircle, FileText } from 'lucide-react';
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
  const [leaveRequested, setLeaveRequested] = useState(false);

  const statusColors = {
    [ActivityStatus.UPCOMING]: 'bg-blue-100 text-blue-700 border-blue-200',
    [ActivityStatus.REGISTRATION_CLOSED]: 'bg-amber-100 text-amber-700 border-amber-200',
    [ActivityStatus.ONGOING]: 'bg-green-100 text-green-700 border-green-200',
    [ActivityStatus.COMPLETED]: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onCancel && cancelReason) {
      onCancel(activity.id, cancelReason);
      setLeaveRequested(true);
      setShowCancelDialog(false);
      setCancelReason('');
    }
  };

  const isOngoing = activity.status === ActivityStatus.ONGOING;
  const isClosed = activity.status === ActivityStatus.REGISTRATION_CLOSED;
  const canRegister = activity.status === ActivityStatus.UPCOMING;
  
  // Allow leave request if registration is closed or ongoing, and user hasn't already requested it.
  const canSubmitLeave = (isClosed || isOngoing) && !leaveRequested;

  return (
    <div className={`group relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${isOngoing ? 'ring-2 ring-green-500 ring-offset-2' : ''}`}>
      {/* Accent strip */}
      <div className={`h-2 w-full ${isOngoing ? 'bg-green-500' : isClosed ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest ${statusColors[activity.status]}`}>
            {activity.status}
          </span>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold">
            <Users size={14} className="text-slate-300" />
            {activity.registeredCount} Joined
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
          {activity.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed">
          {activity.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 bg-slate-50 p-4 rounded-2xl">
          <div className="flex items-center gap-3 text-slate-600 text-sm">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-500">
              <Calendar size={16} />
            </div>
            <span className="font-medium">{activity.date}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600 text-sm">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-500">
              <Clock size={16} />
            </div>
            <span className="font-medium">{activity.time}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600 text-sm sm:col-span-2">
            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-blue-500">
              <MapPin size={16} />
            </div>
            <span className="font-medium truncate">{activity.location}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {leaveRequested ? (
            <div className="flex items-center justify-center gap-2 py-4 px-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm font-bold animate-in fade-in zoom-in">
              <XCircle size={18} />
              Leave Request Submitted
            </div>
          ) : (
            <>
              {/* Registration Status for unregistered users */}
              {!isRegistered && (
                <>
                  {canRegister ? (
                    <button
                      onClick={() => onRegister?.(activity.id)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-200 text-sm flex items-center justify-center gap-2"
                    >
                      Join Activity
                      <ArrowRight size={18} />
                    </button>
                  ) : (
                    <div className="w-full py-3.5 bg-slate-100 text-slate-400 rounded-2xl text-center text-xs font-black uppercase tracking-widest border border-slate-200 mb-1">
                      Registration Closed
                    </div>
                  )}
                </>
              )}

              {/* Attendance Status for registered users */}
              {isRegistered && (
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-center gap-2 py-3.5 px-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-700 text-sm font-bold">
                    <CheckCircle2 size={18} />
                    You are Registered
                  </div>

                  {isOngoing && (
                    <button className="w-full p-4 bg-green-600 text-white rounded-2xl flex flex-col items-center gap-1 shadow-xl shadow-green-200 hover:bg-green-700 transition-all group/btn">
                      <p className="text-[10px] font-black uppercase tracking-widest text-green-100">Live Attendance</p>
                      <p className="text-sm font-bold flex items-center gap-2">
                        Check-in at Club Now
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </p>
                    </button>
                  )}
                </div>
              )}

              {/* ALWAYS SHOW LEAVE BUTTON IF CLOSED/ONGOING (FOR EVERYONE) */}
              {canSubmitLeave && (
                <button
                  onClick={() => setShowCancelDialog(true)}
                  className="w-full flex items-center justify-center gap-2 bg-white text-slate-600 hover:text-red-600 hover:bg-red-50 border-2 border-slate-200 hover:border-red-100 rounded-2xl text-sm font-bold transition-all py-3.5"
                >
                  <FileText size={18} />
                  Submit Leave Reason
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {showCancelDialog && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6">
               <Info size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Request Absence</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Please provide a valid reason for missing <span className="font-bold text-slate-800">"{activity.title}"</span>. This will be reviewed by administrators.
            </p>
            <form onSubmit={handleCancelSubmit}>
              <div className="mb-6">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 px-1">Detailed Reason</label>
                <textarea
                  required
                  autoFocus
                  className="w-full border-2 border-slate-100 bg-white rounded-2xl p-4 text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all min-h-[140px]"
                  placeholder="Explain why you cannot attend (e.g., medical leave, exam conflict)..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1 py-4 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                  Confirm Absence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
