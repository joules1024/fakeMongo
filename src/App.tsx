import React, { useState } from 'react';
import { Plus, Users, RefreshCw, AlertCircle } from 'lucide-react';
import { UserList } from './components/UserList';
import { UserForm } from './components/UserForm';
import { useUsers } from './hooks/useUsers';
import { User, UserInput } from './types/User';

function App() {
  const { users, loading, error, createUser, updateUser, deleteUser, refetch } = useUsers();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | undefined>();

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSubmitUser = async (userData: UserInput) => {
    setIsSubmitting(true);
    
    let success = false;
    if (editingUser) {
      success = await updateUser(editingUser._id, userData);
    } else {
      success = await createUser(userData);
    }
    
    setIsSubmitting(false);
    
    if (success) {
      setShowForm(false);
      setEditingUser(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setDeletingUserId(id);
      await deleteUser(id);
      setDeletingUserId(undefined);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                <p className="text-gray-600">Administra los usuarios del sistema</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={refetch}
                disabled={loading}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                title="Actualizar lista"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={handleCreateUser}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Nuevo Usuario</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Lista de Usuarios ({users.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Cargando usuarios...</span>
            </div>
          ) : (
            <UserList
              users={users}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              deletingUserId={deletingUserId}
            />
          )}
        </div>

        {showForm && (
          <UserForm
            user={editingUser}
            onSubmit={handleSubmitUser}
            onCancel={handleCancel}
            isLoading={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

export default App;