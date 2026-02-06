
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
      // In a real app, update activity count from server
      setActivities(prev => prev.map(a => a.id === id ? { ...a, registeredCount: a.registeredCount + 1 } : a));
    } catch (error) {
      alert('Failed to register.');
    }
  };

  const handleCancel = async (id: string, reason: string) => {
    try {
      await registrationApi.cancel(id, reason);
      setRegisteredIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setActivities(prev => prev.map(a => a.id === id ? { ...a, registeredCount: a.registeredCount - 1 } : a));
    } catch (error) {
      alert('Failed to cancel registration.');
    }
  };

  return (
    <Layout role={Role.USER}>
      <div className="space-y-6">
        <header>
          <h2 className="text-2xl font-bold text-slate-900">Explore Activities</h2>
          <p className="text-slate-500 text-sm">Find and join upcoming tech events.</p>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[280px] bg-slate-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No activities available at the moment.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserHome;
