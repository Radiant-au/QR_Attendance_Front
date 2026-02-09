
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { getActivity } from '../../activities/api/activities';
import { type Activity } from '../../../types';

export const AdminScan = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [lastScanned, setLastScanned] = useState<{ name: string; time: string } | null>(null);
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (activityId) getActivity(activityId).then(data => data && setActivity(data));
    if (navigator.mediaDevices) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; });
    }
  }, [activityId]);

  const simulateScan = () => {
    setLastScanned({ name: `Student #${Math.floor(Math.random() * 9000) + 1000}`, time: new Date().toLocaleTimeString() });
    setTimeout(() => setLastScanned(null), 3000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900 z-[100] flex flex-col text-white">
      <header className="flex items-center justify-between p-6">
        <button onClick={() => navigate('/admin/activities')} className="p-2 bg-slate-800 rounded-xl"><ChevronLeft size={24} /></button>
        <div className="text-center">
          <h2 className="text-lg font-bold">Scanner</h2>
          <p className="text-xs text-slate-400">{activity?.title || 'Loading...'}</p>
        </div>
        <div className="w-10"></div>
      </header>
      <div className="flex-1 relative flex items-center justify-center p-8">
        <div className="w-full max-w-[400px] aspect-square relative rounded-[3rem] overflow-hidden bg-slate-800 border-4 border-slate-700">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover grayscale contrast-125" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-blue-500 rounded-3xl relative">
              <div className="w-full h-0.5 bg-blue-500 animate-[scan_2s_infinite]"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-8">
        {lastScanned ? (
          <div className="bg-green-500 rounded-2xl p-4 flex items-center gap-4 animate-in slide-in-from-bottom">
            <CheckCircle2 size={28} />
            <div><p className="text-xs font-bold">Verified</p><p className="font-bold">{lastScanned.name}</p></div>
          </div>
        ) : <button onClick={simulateScan} className="w-full py-3 bg-slate-800 rounded-full text-xs font-bold uppercase">Test Scan</button>}
      </div>
      <style>{`@keyframes scan { 0% { transform: translateY(-32px); } 100% { transform: translateY(32px); } }`}</style>
    </div>
  );
};
