
import React, { useEffect, useState } from 'react';
import { MainLayout } from '../../../components/Layout/MainLayout';
import { Role, User } from '../../../types';
import { getUsers, createUser, deleteUser } from '../api/users';
import { UserPlus, Trash2 } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<Role>(Role.USER);

  const fetchUsers = async () => {
    setIsLoading(true);
    const data = await getUsers();
    setUsers(data);
    setIsLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser({ email: newEmail, role: newRole });
    setShowAddModal(false);
    setNewEmail('');
    fetchUsers();
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Delete this user?')) {
      await deleteUser(id);
      fetchUsers();
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
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(user => (
              <tr key={user.id} className="text-sm">
                <td className="px-6 py-4 font-bold">{user.fullName || 'Uncompleted'}</td>
                <td className="px-6 py-4 text-slate-500">{user.email}</td>
                <td className="px-6 py-4"><span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">{user.role}</span></td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDeleteUser(user.id)} className="text-slate-300 hover:text-red-600"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold mb-4">Add User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <input type="email" placeholder="Email" required className="w-full px-4 py-3 border rounded-xl" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
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
