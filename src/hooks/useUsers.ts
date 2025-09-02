import { useState, useEffect } from 'react';
import { User, UserInput } from '../types/User';
import { userService } from '../services/userService';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: UserInput): Promise<boolean> => {
    try {
      setError(null);
      const newUser = await userService.createUser(userData);
      setUsers(prev => [newUser, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario');
      return false;
    }
  };

  const updateUser = async (id: string, userData: Partial<UserInput>): Promise<boolean> => {
    try {
      setError(null);
      const updatedUser = await userService.updateUser(id, userData);
      setUsers(prev => prev.map(user => 
        user._id === id ? updatedUser : user
      ));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar usuario');
      return false;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(user => user._id !== id));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
      return false;
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refetch: loadUsers
  };
};