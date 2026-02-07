
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import ActivityCard from './ActivityCard';
import { getActivities, registerForActivity, submitLeaveRequest } from '../api/activities';
import { Activity, Role } from '../../../types';

export const UserHome: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getActivities().then(data => {
      setActivities(data);
      setIsLoading(false);
    });
  }, []);

  const handleRegister = async (id: string) => {
    await registerForActivity(id);
    setRegisteredIds(prev => new Set([...prev, id]));
    setActivities(prev => prev.map(a => a.id === id ? { ...a, registeredCount: a.registeredCount + 1 } : a));
  };

  const handleCancel = async (id: string, reason: string) => {
    await submitLeaveRequest(id, reason);
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
            <ActivityCard key={act.id} activity={act} isRegistered={registeredIds.has(act.id)} onRegister={handleRegister} onCancel={handleCancel} />
          ))}
        </div>
      )}
    </MainLayout>
  );
};
