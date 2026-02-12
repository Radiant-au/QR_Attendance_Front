import React, { useState } from 'react';
import { UserIcon as UserIcon, Lock, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useLogin, useAdminLogin } from '../api/auth.hooks';
import { Role } from '../../../types';

interface LoginFormProps {
  onSuccess: (isAdmin: boolean, isProfileCompleted: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // We'll use a local loading state to track the combined request
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginMutation = useLogin();
  const adminLoginMutation = useAdminLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Race both login attempts. The first one to succeed wins.
      // We wrap them in promises that reject if the mutation fails, so Promise.any works.

      const loginPromise = loginMutation.mutateAsync({ username, password });
      const adminLoginPromise = adminLoginMutation.mutateAsync({ username, password });

      const result = await Promise.any([loginPromise, adminLoginPromise]);

      // If we get here, one of them succeeded
      toast.success('Login successful! Welcome back.');

      // Determine if it was an admin or user login based on the response
      // Both return AuthResponse with user object. 
      // We can check the role from the response data.
      const isAdmin = result.user.role === Role.ADMIN;
      const isProfileCompleted = result.user.isProfileCompleted === true || result.user.isProfileCompleted === 'true';

      onSuccess(isAdmin, isProfileCompleted);

    } catch (aggregateError: any) {
      // Both failed
      console.error('Login failed:', aggregateError);
      toast.error('Invalid credentials. Please check your username and password.');
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="bg-blue-600 p-8 text-center">
        <h2 className="text-white font-black text-xl uppercase tracking-widest">Welcome Back</h2>
        <p className="text-blue-100 text-sm mt-2">Sign in to access your dashboard</p>
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
          <label className="block text-xs font-black uppercase text-slate-400 tracking-widest mb-2 px-1">Password</label>
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
              Sign In
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
};
