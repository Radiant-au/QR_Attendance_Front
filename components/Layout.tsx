
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, QrCode, LogOut, LayoutDashboard, Users, Calendar, Scan } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      {/* Added md:ml-64 to account for the fixed sidebar on desktop */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 flex items-center justify-between md:ml-64">
        <h1 className="text-xl font-bold text-blue-600 tracking-tight">
          Technologia<span className="text-slate-900 font-medium">QR</span>
        </h1>
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-500 hover:text-red-600 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </header>

      {/* Main Content */}
      {/* Added md:ml-64 to account for the fixed sidebar on desktop, replacing the <style jsx> block */}
      <main className="flex-1 pb-24 md:pb-6 container mx-auto px-4 py-6 md:ml-64">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-around items-center md:hidden z-50">
        {currentNav.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              location.pathname === item.path ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            <item.icon size={22} />
            <span className="text-[10px] font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Desktop Sidebar (Optional enhancement if screen is wide) */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white flex-col p-6 z-50">
         <h1 className="text-2xl font-bold text-blue-400 mb-10">Technologia</h1>
         <div className="flex-1 space-y-2">
            {currentNav.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
         </div>
         <button 
           onClick={handleLogout}
           className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 transition-colors"
         >
           <LogOut size={20} />
           <span className="font-medium">Logout</span>
         </button>
      </div>
    </div>
  );
};

export default Layout;
