import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader, Table, Button, Modal, Input, Select, ConfirmDialog, Avatar, Badge, EmptyState, Pagination } from '../components/ui';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { userService } from '../services/user.service';
import useAuth from '../hooks/useAuth';
import { formatRelativeDate } from '../utils/date';
import { toast } from 'sonner';

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aria',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ryan'
];

export const UsersPage = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // ALL, MANAGER, MEMBER
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(8); // items per page

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({ name: '', email: '', role: 'MEMBER', avatar: '', phone: '' });
  const [formErrors, setFormErrors] = useState({});

  // Query users
  const { data: usersResponse, isLoading, error, refetch } = useQuery({
    queryKey: ['users-list-full'],
    queryFn: async () => {
      const res = await userService.getAllUsers({ limit: 100 });
      return res; // returns pagination response payload
    }
  });

  const rawUsers = usersResponse?.data || [];

  // Filter users based on logged-in user role + search + dropdown filters
  const filteredUsers = rawUsers
    .filter((u) => {
      if (currentUser?.role === 'MANAGER') {
        // Manager can only see MEMBERS
        return u.role === 'MEMBER';
      }
      if (currentUser?.role === 'ADMIN') {
        // Admin can see MANAGERs and MEMBERs (exclude other admins to prevent accidental lockout)
        return u.role === 'MANAGER' || u.role === 'MEMBER';
      }
      return false;
    })
    .filter((u) => {
      if (roleFilter === 'ALL') return true;
      return u.role === roleFilter;
    })
    .filter((u) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();
      return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
    });

  // Reset pagination page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  // Paginated users subset
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => userService.createUser(data),
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey: ['users-list-full'] });
      queryClient.invalidateQueries({ queryKey: ['assignees-list'] });
      setModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to create user');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users-list-full'] });
      queryClient.invalidateQueries({ queryKey: ['assignees-list'] });
      setModalOpen(false);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update user');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => userService.deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users-list-full'] });
      queryClient.invalidateQueries({ queryKey: ['assignees-list'] });
      setDeleteUserId(null);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete user');
    }
  });

  const openCreateModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'MEMBER',
      avatar: '',
      phone: ''
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || '',
      phone: user.phone || ''
    });
    setFormErrors({});
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address format';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 4) {
      errors.phone = 'Phone number must have at least 4 digits';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      ...formData,
      avatar: formData.avatar.trim() || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`
    };

    if (editingUser) {
      updateMutation.mutate({ id: editingUser.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteUserId) {
      deleteMutation.mutate(deleteUserId);
    }
  };

  // Table Config
  const headers = ['User Profile', 'Email Address', 'Phone Number', 'System Role', 'Created At', 'Updated At', 'Actions'];

  const rows = paginatedUsers.map((u) => [
    <div className="flex items-center gap-3">
      <Avatar size="sm" src={u.avatar} name={u.name} className="no-invert" />
      <span className="font-semibold text-slate-200">{u.name}</span>
    </div>,
    <span className="text-slate-400 font-mono text-xs">{u.email}</span>,
    <span className="text-slate-400 font-mono text-xs">{u.phone || 'N/A'}</span>,
    <Badge variant={u.role === 'ADMIN' ? 'danger' : u.role === 'MANAGER' ? 'warning' : 'info'}>
      {u.role}
    </Badge>,
    <span className="text-xs text-slate-500 font-medium">{formatRelativeDate(u.createdAt)}</span>,
    <span className="text-xs text-slate-500 font-medium">{formatRelativeDate(u.updatedAt)}</span>,
    <div className="flex items-center gap-2">
      <button
        onClick={() => openEditModal(u)}
        className="p-1 rounded text-slate-400 hover:text-slate-200 transition-colors"
        title="Edit User"
      >
        <Edit2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => setDeleteUserId(u.id)}
        className="p-1 rounded text-slate-400 hover:text-red-400 transition-colors"
        title="Delete User"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  ]);

  const headerActions = (
    <Button variant="primary" size="sm" leftIcon={Plus} onClick={openCreateModal}>
      Create User
    </Button>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Users Directory"
        description="Manage internal user profiles, roles, and administrative permissions"
        actions={headerActions}
        breadcrumbs={['Workspace', 'Users']}
      />

      {/* Control bar containing Search and Dropdown Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 border border-slate-800/80 rounded-xl">
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </span>
            <input
              type="text"
              placeholder="Search directory by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-900/60 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
            />
          </div>

          {/* Role Filter Selector (Only visible to Admin) */}
          {currentUser?.role === 'ADMIN' && (
            <div className="w-full sm:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-350 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50"
              >
                <option value="ALL">All Roles</option>
                <option value="MANAGER">Manager</option>
                <option value="MEMBER">Member</option>
              </select>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-500 font-semibold self-end md:self-center shrink-0">
          Showing {filteredUsers.length} of {rawUsers.length} records
        </div>
      </div>

      {/* Main Table Directory */}
      <div className="relative space-y-4">
        <Table
          headers={headers}
          rows={rows}
          loading={isLoading}
          emptyState={
            <EmptyState
              iconName="Users"
              title="No users found"
              description="No user profiles matched your current search parameters."
            />
          }
          striped={true}
          hover={true}
        />

        {/* Pagination Controls */}
        {!isLoading && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            disabled={isLoading}
          />
        )}
      </div>

      {/* Creation / Editing Modal Form */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Edit User Profile' : 'Create User Profile'}
        size="md"
        closeOnOverlayClick={!(createMutation.isPending || updateMutation.isPending)}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-2">
          <Input
            label="Name"
            placeholder="Enter full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={formErrors.name}
            required
            disabled={createMutation.isPending || updateMutation.isPending}
          />

          <Input
            label="Email Address"
            placeholder="name@example.com"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={formErrors.email}
            required
            disabled={createMutation.isPending || updateMutation.isPending}
          />

          {currentUser?.role === 'ADMIN' ? (
            <Select
              label="System Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { value: 'MEMBER', label: 'Member' },
                { value: 'MANAGER', label: 'Manager' }
              ]}
              disabled={createMutation.isPending || updateMutation.isPending}
            />
          ) : (
            // Managers can only create MEMBERs
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-400">System Role</span>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-semibold text-slate-350 select-none">
                MEMBER (Role locked for Managers)
              </div>
            </div>
          )}

          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            error={formErrors.phone}
            required
            disabled={createMutation.isPending || updateMutation.isPending}
          />

          <Input
            label="Avatar Image URL (Optional)"
            placeholder="https://api.dicebear.com/... (auto-generated if empty)"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            disabled={createMutation.isPending || updateMutation.isPending}
          />

          {/* Preset Avatar Selection Grid */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 block">Select Avatar Preset</span>
            <div className="flex items-center gap-3 overflow-x-auto py-1 scrollbar-none">
              {PRESET_AVATARS.map((url, idx) => {
                const isSelected = formData.avatar === url;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: url })}
                    className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-all p-0.5 shrink-0 hover:scale-105 active:scale-95 ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-500/30'
                        : 'border-slate-800 hover:border-slate-655'
                    }`}
                  >
                    <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full rounded-full object-cover no-invert" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center rounded-full">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/80">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingUser ? 'Save Changes' : 'Create User'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Overlay */}
      <ConfirmDialog
        open={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete User Profile"
        description="Are you sure you want to delete this user profile? All associated task history mapping may be detached. This action is permanent."
        confirmLabel="Delete Profile"
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default UsersPage;
