
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import UserHome from './pages/UserHome';
import MyQR from './pages/MyQR';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminActivities from './pages/AdminActivities';
import AdminScan from './pages/AdminScan';
import ProfileCompletion from './pages/ProfileCompletion';
import { Role, User } from './types';
import { STORAGE_KEYS } from './constants';

// Fix: Changed children to optional in the type definition to resolve TS missing property errors when wrapping content
const AuthGuard = ({ children, role }: { children?: React.ReactNode, role?: Role }) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  const user: User | null = userJson ? JSON.parse(userJson) : null;

  if (!token || !user) {
    return <Navigate to="/" />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" />;
  }

  if (user.role === Role.USER && !user.isProfileCompleted && window.location.hash !== '#/complete-profile') {
    return <Navigate to="/complete-profile" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/complete-profile" element={<ProfileCompletion />} />

        <Route 
          path="/home" 
          element={
            <AuthGuard role={Role.USER}>
              <UserHome />
            </AuthGuard>
          } 
        />
        <Route 
          path="/qr" 
          element={
            <AuthGuard role={Role.USER}>
              <MyQR />
            </AuthGuard>
          } 
        />

        <Route 
          path="/admin/dashboard" 
          element={
            <AuthGuard role={Role.ADMIN}>
              <AdminDashboard />
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <AuthGuard role={Role.ADMIN}>
              <AdminUsers />
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/activities" 
          element={
            <AuthGuard role={Role.ADMIN}>
              <AdminActivities />
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/scan" 
          element={
            <AuthGuard role={Role.ADMIN}>
              <AdminScan />
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/scan/:activityId" 
          element={
            <AuthGuard role={Role.ADMIN}>
              <AdminScan />
            </AuthGuard>
          } 
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
