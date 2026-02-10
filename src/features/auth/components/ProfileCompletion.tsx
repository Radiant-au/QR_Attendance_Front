
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, ChevronRight } from 'lucide-react';
import { useUpdateProfile } from '../api/auth.hooks';
import { STORAGE_KEYS } from '../../../config';
import { type User, type Major, type Year } from '../../../types';
import { toast } from 'sonner';

export const ProfileCompletion: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [major, setMajor] = useState<Major | ''>('');
  const [year, setYear] = useState<Year | ''>('');
  const navigate = useNavigate();

  const updateProfileMutation = useUpdateProfile();
  const isLoading = updateProfileMutation.isPending;

  const userJson = localStorage.getItem(STORAGE_KEYS.USER);
  const currentUser: User | null = userJson ? JSON.parse(userJson) : null;

  useEffect(() => {
    if (!currentUser) navigate('/');
    else if (currentUser.isProfileCompleted === 'true' || currentUser.isProfileCompleted === true) {
      navigate('/home');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    updateProfileMutation.mutate({
      id: currentUser.id,
      data: {
        fullName,
        major: major as Major,
        year: year as Year,
        isProfileCompleted: true
      }
    }, {
      onSuccess: () => {
        toast.success('Profile updated successfully!');
        navigate('/home');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to update profile.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 md:justify-center">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 text-blue-600 mb-6 border-4 border-blue-100">
            <UserIcon size={36} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Full Name</label>
              <input required type="text" className="w-full px-4 py-4 bg-slate-50 rounded-2xl outline-none" value={fullName} onChange={e => setFullName(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Major</label>
              <select required className="w-full px-4 py-4 bg-slate-50 rounded-2xl outline-none" value={major} onChange={e => setMajor(e.target.value as Major)}>
                <option value="">Select Major</option>
                <option value="IS">IS (Information Science)</option>
                <option value="CE">CE (Civil Engineering)</option>
                <option value="EcE">EcE (Electronic Engineering)</option>
                <option value="PrE">PrE (Probationary Engineering?)</option>
                <option value="AME">AME (Aerospace Engineering?)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Year</label>
              <select required className="w-full px-4 py-4 bg-slate-50 rounded-2xl outline-none" value={year} onChange={e => setYear(e.target.value as Year)}>
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
                <option value="5th">5th Year</option>
                <option value="6th">6th Year</option>
              </select>
            </div>
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-2">
            {isLoading ? 'Saving...' : 'Get Started'} <ChevronRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};
