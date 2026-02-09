
import { useEffect, useState } from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { getQRUrl } from '../api/attendance';
import { Role, type User } from '../../../types';
import { STORAGE_KEYS } from '../../../config';

export const MyQR: React.FC = () => {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(60);

  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  const currentUser: User | null = userJson ? JSON.parse(userJson) : null;

  const refreshQR = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const url = await getQRUrl(currentUser.id);
      setQrUrl(url);
      setTimeLeft(60);
    } catch (error) {
      console.error('Failed to load QR');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { refreshQR(); }, []);
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else refreshQR();
  }, [timeLeft]);

  return (
    <MainLayout role={Role.USER}>
      <div className="max-w-md mx-auto space-y-8 py-6">
        <h2 className="text-2xl font-bold text-center">My Attendance QR</h2>
        <div className="bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-100 flex flex-col items-center">
          {isLoading ? (
            <div className="w-[280px] h-[280px] flex items-center justify-center bg-slate-50 rounded-2xl">
              <div className="w-10 h-10 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            </div>
          ) : qrUrl && (
            <img src={qrUrl} alt="QR" className="w-[280px] h-[280px] rounded-2xl border-4 border-slate-900 p-2" />
          )}
          <div className="mt-8 w-full space-y-4">
            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl text-sm font-bold">
              <span>Refresh in {timeLeft}s</span>
              <button onClick={refreshQR} className="text-blue-600">Refresh</button>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl text-xs text-blue-800">Unique code for event check-in.</div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
