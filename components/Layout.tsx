
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, QrCode, LogOut, LayoutDashboard, Users, Calendar } from 'lucide-react';
import { Role } from '../types';
import { STORAGE_KEYS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  role: Role;
}

const Layout: React.FC<LayoutProps> = ({ children, role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    navigate('/');
  };

  const userNav = [
    { name: 'Home', icon: Home, path: '/home' },
    { name: 'My QR', icon: QrCode, path: '/qr' },
  ];

  const adminNav = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'Users', icon: Users, path: '/admin/users' },
    { name: 'Activities', icon: Calendar, path: '/admin/activities' },
  ];

  const currentNav = role === Role.ADMIN ? adminNav : userNav;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex-col p-6 z-50">
         <div className="mb-10 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">Technologia</h1>
         </div>
         <nav className="flex-1 space-y-2">
            {currentNav.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
         </nav>
         <button 
           onClick={handleLogout}
           className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-400 transition-colors mt-auto"
         >
           <LogOut size={20} />
           <span className="font-medium">Logout</span>
         </button>
      </aside>

      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col md:pl-64">
        {/* Mobile/Tablet Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
               <span className="text-white font-bold text-xs">T</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              Technologia
            </h1>
          </div>
          <div className="hidden md:block">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {location.pathname.split('/').pop()?.replace('-', ' ') || 'Home'}
            </h2>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-600 transition-colors md:hidden"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </header>

        {/* Content Area */}
        <main className="flex-1 pb-24 md:pb-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 px-6 py-3 flex justify-around items-center md:hidden z-50">
          {currentNav.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                location.pathname === item.path ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <item.icon size={22} />
              <span className="text-[10px] font-bold">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Layout;
