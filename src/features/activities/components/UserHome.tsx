import React from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import ActivityCard from './ActivityCard';
import { useActivities, useRegisterActivity, useCancelRegistration } from '../api/activities.hooks';
import { Role } from '../../../types';
import { STORAGE_KEYS } from '../../../config';
import { toast } from 'sonner';

export const UserHome: React.FC = () => {
  const { data: activities = [], isLoading } = useActivities(false);
  const registerMutation = useRegisterActivity();
  const cancelMutation = useCancelRegistration();

  const handleRegister = async (activityId: string) => {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user?.id) {
      toast.error('You must be logged in to register.');
      return;
    }

    registerMutation.mutate({ userId: user.id, activityId }, {
      onSuccess: () => {
        toast.success('Registered successfully! See you there.');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Registration failed');
      }
    });
  };

  const handleCancel = async (activityId: string, reason: string) => {
    cancelMutation.mutate({ activityId, cancellationReason: reason }, {
      onSuccess: () => {
        toast.success('Leave request submitted.');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to submit leave request');
      }
    });
  };

  return (
    <MainLayout role={Role.USER}>
      <header className="mb-8">
        <h2 className="text-3xl font-black text-slate-900">Active Events</h2>
        <p className="text-slate-500 italic">Join a session and grow your tech skills.</p>
      </header>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map(i => <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-3xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map(act => (
            <ActivityCard key={act.id} activity={act} isRegistered={!!act.isRegistered} onRegister={handleRegister} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </MainLayout>
  );
};
