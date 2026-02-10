import React, { useState } from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { Role } from '../../../types';
import { useUsers, useCreateUser, useDeleteUser } from '../api/users.hooks';
import { UserPlus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const AdminUsers: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<Role>(Role.USER);

  const { data: users = [], isLoading: isFetching } = useUsers();
  const createUserMutation = useCreateUser();
  const deleteUserMutation = useDeleteUser();

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    createUserMutation.mutate({
      username: newUsername,
      password: newPassword,
      role: newRole
    }, {
      onSuccess: () => {
        toast.success('User created successfully!');
        setShowAddModal(false);
        setNewUsername('');
        setNewPassword('');
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to create user');
      }
    });
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Delete this user?')) {
      deleteUserMutation.mutate(id, {
        onSuccess: () => {
          toast.success('User deleted successfully!');
        },
        onError: (error: any) => {
          toast.error(error.message || 'Failed to delete user');
        }
      });
    }
  };

  return (
    <MainLayout role={Role.ADMIN}>
      <header className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">User Management</h2>
        <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl font-bold">
          <UserPlus size={18} /> Add User
        </button>
      </header>

      <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 tracking-wider">
            <tr>
              <th className="px-6 py-4">Full Name</th>
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Major</th>
              <th className="px-6 py-4">Year</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isFetching ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                    <span className="text-xs font-bold uppercase tracking-widest">Loading Citizens...</span>
                  </div>
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-widest">No Citizens Found</span>
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id} className="text-sm">
                  <td className="px-6 py-4 font-bold">{user.fullName || 'Uncompleted'}</td>
                  <td className="px-6 py-4 text-slate-500">{user.username}</td>
                  <td className="px-6 py-4 text-slate-500">{user.major || '-'}</td>
                  <td className="px-6 py-4 text-slate-500">{user.year || '-'}</td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">{user.role}</span></td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDeleteUser(user.id)} className="text-slate-300 hover:text-red-600 transition-colors">
                      {deleteUserMutation.isPending && deleteUserMutation.variables === user.id ?
                        <Loader2 className="animate-spin" size={18} /> :
                        <Trash2 size={18} />
                      }
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Add User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <input type="text" placeholder="Username" required className="w-full px-4 py-3 border rounded-xl" value={newUsername} onChange={e => setNewUsername(e.target.value)} />
              <input type="password" placeholder="Password" required className="w-full px-4 py-3 border rounded-xl" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
              <select className="w-full px-4 py-3 border rounded-xl" value={newRole} onChange={e => setNewRole(e.target.value as Role)}>
                <option value={Role.USER}>Student</option>
                <option value={Role.ADMIN}>Admin</option>
              </select>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 border rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
