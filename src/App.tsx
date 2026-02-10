
import { useEffect, type FC, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';


import { Role, type User } from './types';
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
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  const user: User | null = userJson ? JSON.parse(userJson) : null;
  const location = useLocation();

  if (!user) return <Navigate to="/" replace />;

  // Case-insensitive role check
  const userRole = user.role?.toString().toUpperCase();
  const requiredRole = role?.toString().toUpperCase();

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  const isProfileCompleted = user.isProfileCompleted === true || user.isProfileCompleted === 'true';
  if (userRole === Role.USER && !isProfileCompleted && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }
  return <>{children}</>;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  const user: User | null = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    if (user) {
      const isProfileCompleted = user.isProfileCompleted === true || user.isProfileCompleted === 'true';
      const role = user.role?.toString().toUpperCase();

      if (role === Role.ADMIN) {
        navigate('/admin/dashboard', { replace: true });
      } else if (!isProfileCompleted) {
        navigate('/complete-profile', { replace: true });
      } else {
        navigate('/home', { replace: true });
      }
    }
  }, [user, navigate]);

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
        <LoginForm onSuccess={(isAdmin, isProfileCompleted) => {
          if (isAdmin) {
            navigate('/admin/dashboard', { replace: true });
          } else if (!isProfileCompleted) {
            navigate('/complete-profile', { replace: true });
          } else {
            navigate('/home', { replace: true });
          }
        }} />
      </div>
    </div>
  );
};

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" expand={false} richColors />
      <BrowserRouter>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
