
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { userApi } from '../services/api';
import { Role, User } from '../types';
import { STORAGE_KEYS } from '../constants';
import { RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';

const MyQR: React.FC = () => {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);

  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  const currentUser: User | null = userJson ? JSON.parse(userJson) : null;

  const refreshQR = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const url = await userApi.getQR(currentUser.id);
      setQrUrl(url);
      setTimeLeft(60);
    } catch (error) {
      console.error('Failed to load QR');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshQR();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      refreshQR();
    }
  }, [timeLeft]);

  return (
    <Layout role={Role.USER}>
      <div className="max-w-md mx-auto space-y-8 py-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">My Attendance QR</h2>
          <p className="text-slate-500 text-sm px-4">Present this code to the admin during event check-in to mark your attendance.</p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col items-center">
          <div className="relative group">
            {isLoading ? (
              <div className="w-[280px] h-[280px] flex items-center justify-center bg-slate-50 rounded-2xl">
                 <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : (
              qrUrl && (
                <div className="relative">
                   <img 
                    src={qrUrl} 
                    alt="Attendance QR" 
                    className="w-[280px] h-[280px] rounded-2xl border-4 border-slate-900 p-2 bg-white" 
                   />
                   <div className="absolute inset-0 border-[12px] border-slate-900 pointer-events-none rounded-2xl opacity-10"></div>
                </div>
              )
            )}
          </div>

          <div className="mt-8 w-full space-y-6">
             <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auto-Refresh In</p>
                      <p className="text-sm font-bold text-slate-900">{timeLeft} Seconds</p>
                   </div>
                </div>
                <button 
                  onClick={refreshQR}
                  className="text-blue-600 text-sm font-bold hover:underline"
                >
                  Refresh Now
                </button>
             </div>

             <div className="flex items-start gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <ShieldCheck size={20} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  This QR code is unique to you and valid for a limited time. Do not share it to prevent unauthorized check-ins.
                </p>
             </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-slate-400">
            User ID: <span className="font-mono">{currentUser?.id}</span>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default MyQR;
