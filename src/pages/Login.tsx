
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, User as UserIcon } from 'lucide-react';
import { authApi } from '../services/api';
import { STORAGE_KEYS } from '../constants';
import { Role } from '../types';

const Login: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = isAdmin 
        ? await authApi.loginAdmin(email, password)
        : await authApi.loginUser(email, password);
      
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
      
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        if (!response.user.isProfileCompleted) {
          navigate('/complete-profile');
        } else {
          navigate('/home');
        }
      }
    } catch (error) {
      alert('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[440px]">
        {/* Brand */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 mb-6">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Technologia
          </h1>
          <p className="text-slate-500 mt-2 font-medium">QR Attendance System</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Tab Selection */}
          <div className="flex border-b border-slate-100">
            <button
              onClick={() => setIsAdmin(false)}
              className={`flex-1 py-5 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                !isAdmin ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <UserIcon size={18} />
              Student
            </button>
            <button
              onClick={() => setIsAdmin(true)}
              className={`flex-1 py-5 text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                isAdmin ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <ShieldCheck size={18} />
              Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
            <div>
              <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2 px-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  placeholder="name@university.edu"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-medium shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2 px-1">Secret Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-medium shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:shadow-none"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-xs text-slate-400 font-bold uppercase tracking-widest">
          © 2024 Technologia Club
        </p>
      </div>
    </div>
  );
};

export default Login;
