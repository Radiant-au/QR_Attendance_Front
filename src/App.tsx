
import { useEffect, type FC, type ReactNode } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

import { initDB } from './lib/db';
import { Role, User } from './types';
import { STORAGE_KEYS } from './config';

// Features
import { LoginForm } from './features/auth/components/LoginForm';
import { ProfileCompletion } from './features/auth/components/ProfileCompletion';
import { UserHome } from './features/activities/components/UserHome';
import { MyQR } from './features/attendance/components/MyQR';
import { AdminDashboard } from './features/dashboard/components/AdminDashboard';
import { AdminUsers } from './features/users/components/AdminUsers';
import { AdminActivities } from './features/activities/components/AdminActivities';
import { AdminScan } from './features/attendance/components/AdminScan';

const AuthGuard = ({ children, role }: { children?: ReactNode, role?: Role }) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  const user: User | null = userJson ? JSON.parse(userJson) : null;

  if (!token || !user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  if (user.role === Role.USER && !user.isProfileCompleted && window.location.hash !== '#/complete-profile') {
    return <Navigate to="/complete-profile" />;
  }
  return <>{children}</>;
};

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg mb-6 text-white">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">Technologia</h1>
          <p className="text-slate-500 mt-2">QR Attendance System</p>
        </div>
        <LoginForm onSuccess={(isAdmin: boolean) => {
          if (isAdmin) navigate('/admin/dashboard');
          else navigate('/home');
        }} />
      </div>
    </div>
  );
};

const App: FC = () => {
  useEffect(() => { initDB(); }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/complete-profile" element={<ProfileCompletion />} />
        <Route path="/home" element={<AuthGuard role={Role.USER}><UserHome /></AuthGuard>} />
        <Route path="/qr" element={<AuthGuard role={Role.USER}><MyQR /></AuthGuard>} />
        <Route path="/admin/dashboard" element={<AuthGuard role={Role.ADMIN}><AdminDashboard /></AuthGuard>} />
        <Route path="/admin/users" element={<AuthGuard role={Role.ADMIN}><AdminUsers /></AuthGuard>} />
        <Route path="/admin/activities" element={<AuthGuard role={Role.ADMIN}><AdminActivities /></AuthGuard>} />
        <Route path="/admin/scan" element={<AuthGuard role={Role.ADMIN}><AdminScan /></AuthGuard>} />
        <Route path="/admin/scan/:activityId" element={<AuthGuard role={Role.ADMIN}><AdminScan /></AuthGuard>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
