
import { useEffect, useState } from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { Role, type User } from '../../../types';
import { STORAGE_KEYS } from '../../../config';
import { useQR } from '../api/attendance.hooks';

export const MyQR: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  const currentUser: User | null = userJson ? JSON.parse(userJson) : null;

  const { data: qrToken, isLoading, refetch, error } = useQR(currentUser?.id || '');

  const getExpirationTime = (token: string): number | null => {
    try {
      const payload = JSON.parse(atob(token));
      return payload.expiresAt || null;
    } catch (e) {
      console.error('Failed to decode QR token:', e);
      return null;
    }
  };

  useEffect(() => {
    if (!qrToken) return;

    const expiresAt = getExpirationTime(qrToken);
    if (!expiresAt) {
      setTimeLeft(600);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.floor((expiresAt - now) / 1000);
      if (diff <= 0) {
        setTimeLeft(0);
        refreshQR();
      } else {
        setTimeLeft(diff);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [qrToken]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const refreshQR = () => {
    refetch();
  };

  const qrImageUrl = qrToken
    ? `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${qrToken}`
    : '';

  return (
    <MainLayout role={Role.USER}>
      <div className="max-w-md mx-auto space-y-8 py-6">
        <h2 className="text-2xl font-bold text-center">My Attendance QR</h2>
        <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-100 flex flex-col items-center">
          {isLoading ? (
            <div className="w-[280px] h-[280px] flex items-center justify-center bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : qrImageUrl ? (
            <img src={qrImageUrl} alt="QR Code" className="w-[280px] h-[280px] rounded-2xl border-4 border-slate-900 p-2" />
          ) : error ? (
            <div className="w-[280px] h-[280px] flex flex-col items-center justify-center bg-red-50 rounded-2xl text-red-600 p-6 text-center">
              <span className="text-sm font-bold mb-2">Failed to load QR</span>
              <p className="text-xs opacity-80">{error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
          ) : (
            <div className="w-[280px] h-[280px] flex items-center justify-center bg-slate-50 rounded-2xl text-slate-400 text-sm">
              Failed to load QR
            </div>
          )}
          <div className="mt-8 w-full space-y-4">
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl text-sm font-bold">
              <span>Expires in {formatTime(timeLeft)}</span>
              <button onClick={refreshQR} className="text-blue-600">Refresh Now</button>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl text-xs text-blue-800">
              This QR is valid for 10 minutes. Please show it at the check-in desk.
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
