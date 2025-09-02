import React from 'react';
import { User } from '../types/User';
import { UserCard } from './UserCard';
import { Users } from 'lucide-react';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  deletingUserId?: string;
}

export const UserList: React.FC<UserListProps> = ({ 
  users, 
  onEdit, 
  onDelete, 
  deletingUserId 
}) => {
  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay usuarios</h3>
        <p className="text-gray-500">Comienza agregando tu primer usuario</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <UserCard
          key={user._id}
          user={user}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={deletingUserId === user._id}
        />
      ))}
    </div>
  );
};