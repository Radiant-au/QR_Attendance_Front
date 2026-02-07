
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ActivityCard from '../components/ActivityCard';
import { activityApi, registrationApi } from '../services/api';
import { Activity, Role } from '../types';

const UserHome: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await activityApi.getActivities();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegister = async (id: string) => {
    try {
      await registrationApi.register(id);
      setRegisteredIds(prev => new Set([...Array.from(prev), id]));
      setActivities(prev => prev.map(a => a.id === id ? { ...a, registeredCount: a.registeredCount + 1 } : a));
    } catch (error) {
      alert('Failed to register.');
    }
  };

  const handleCancel = async (id: string, reason: string) => {
    try {
      await registrationApi.cancel(id, reason);
      // Logic for cancellation if needed, but here we just update UI state for the card
    } catch (error) {
      alert('Failed to submit leave.');
    }
  };

  return (
    <Layout role={Role.USER}>
      <div className="space-y-8">
        <header>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Active Events</h2>
          <p className="text-slate-500 text-sm font-medium italic">Join a session and grow your tech skills.</p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[300px] bg-slate-200 animate-pulse rounded-[2rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {activities.map(activity => (
              <ActivityCard 
                key={activity.id} 
                activity={activity} 
                isRegistered={registeredIds.has(activity.id)}
                onRegister={handleRegister}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}
        
        {activities.length === 0 && !isLoading && (
          <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
            <p className="text-slate-400 font-black uppercase tracking-widest">No activities detected in radar.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserHome;
