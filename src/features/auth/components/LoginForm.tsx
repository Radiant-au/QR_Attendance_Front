import React, { useState } from 'react';
import { UserIcon as UserIcon, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { authApi } from '../../../services/api';
import { STORAGE_KEYS } from '../../../config';
import { toast } from 'sonner';

interface LoginFormProps {
  onSuccess: (isAdmin: boolean, isProfileCompleted: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = isAdmin
        ? await authApi.loginAdmin(username, password)
        : await authApi.loginUser(username, password);

      localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);

      // TODO: Since the backend only returns a token, we need an endpoint to fetch user details.
      // For now, we'll store a placeholder or wait for further integration.
      // localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

      toast.success('Login successful! Welcome back.');
      // Placeholder: default to true for now to allow entry, or handle appropriately
      onSuccess(isAdmin, true);
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="flex border-b border-slate-100">
        <button
          onClick={() => setIsAdmin(false)}
          className={`flex-1 py-5 text-sm font-bold transition-all flex items-center justify-center gap-2 ${!isAdmin ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          <UserIcon size={18} />
          Student
        </button>
        <button
          onClick={() => setIsAdmin(true)}
          className={`flex-1 py-5 text-sm font-bold transition-all flex items-center justify-center gap-2 ${isAdmin ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          <ShieldCheck size={18} />
          Admin
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
        <div>
          <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2 px-1">Username</label>
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              required
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-medium shadow-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-100 bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all text-sm font-medium shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest py-5 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:bg-slate-300"
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
  );
};
