'use client';

import { useState, useEffect } from 'react';

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([
    { id: 1, name: 'Administrator', description: 'Full system access', permissions: ['all'], color: 'bg-red-500', users: 1 },
    { id: 2, name: 'HR Manager', description: 'Human resources management', permissions: ['hr', 'payroll', 'employees'], color: 'bg-blue-500', users: 1 },
    { id: 3, name: 'Sales Manager', description: 'Sales and client management', permissions: ['sales', 'inventory', 'clients'], color: 'bg-green-500', users: 1 },
    { id: 4, name: 'Accounting', description: 'Financial and accounting operations', permissions: ['finance', 'payroll', 'expenses'], color: 'bg-purple-500', users: 1 },
    { id: 5, name: 'Front Desk', description: 'Reception and visitor management', permissions: ['visitors', 'telephones'], color: 'bg-orange-500', users: 1 },
    { id: 6, name: 'Customer Service', description: 'Customer support and service', permissions: ['customer_service'], color: 'bg-pink-500', users: 1 },
    { id: 7, name: 'Audit', description: 'System auditing and compliance', permissions: ['audit', 'compliance'], color: 'bg-indigo-500', users: 1 }
  ]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [showRoleDetailsModal, setShowRoleDetailsModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [selectedRoleDetails, setSelectedRoleDetails] = useState(null);
  const [newRole, setNewRole] = useState({ name: '', description: '', permissions: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  // Mock data for users
  useEffect(() => {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john.doe@company.com', role: 'Administrator', status: 'Active', lastLogin: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane.smith@company.com', role: 'HR Manager', status: 'Active', lastLogin: '2024-01-14' },
      { id: 3, name: 'Mike Johnson', email: 'mike.johnson@company.com', role: 'Sales Manager', status: 'Active', lastLogin: '2024-01-13' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah.wilson@company.com', role: 'Accounting', status: 'Inactive', lastLogin: '2024-01-10' },
      { id: 5, name: 'David Brown', email: 'david.brown@company.com', role: 'Front Desk', status: 'Active', lastLogin: '2024-01-15' },
      { id: 6, name: 'Lisa Davis', email: 'lisa.davis@company.com', role: 'Customer Service', status: 'Active', lastLogin: '2024-01-14' },
      { id: 7, name: 'Tom Anderson', email: 'tom.anderson@company.com', role: 'Audit', status: 'Active', lastLogin: '2024-01-12' }
    ];
    setUsers(mockUsers);
  }, []);

  const availablePermissions = [
    'all', 'hr', 'payroll', 'employees', 'sales', 'inventory', 'clients',
    'finance', 'expenses', 'visitors', 'telephones', 'customer_service',
    'audit', 'compliance', 'admin', 'reports'
  ];

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleAddRole = () => {
    if (newRole.name && newRole.description) {
      const role = {
        id: roles.length + 1,
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions
      };
      setRoles([...roles, role]);
      setNewRole({ name: '', description: '', permissions: [] });
      setShowAddRoleModal(false);
    }
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
    setNewRole({ name: role.name, description: role.description, permissions: role.permissions });
    setShowEditRoleModal(true);
  };

  const handleUpdateRole = () => {
    if (editingRole && newRole.name && newRole.description) {
      setRoles(roles.map(role => 
        role.id === editingRole.id 
          ? { ...role, name: newRole.name, description: newRole.description, permissions: newRole.permissions }
          : role
      ));
      setShowEditRoleModal(false);
      setEditingRole(null);
      setNewRole({ name: '', description: '', permissions: [] });
    }
  };

  const handleDeleteRole = (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      setRoles(roles.filter(role => role.id !== roleId));
    }
  };

  const handleViewRoleDetails = (role) => {
    setSelectedRoleDetails(role);
    setShowRoleDetailsModal(true);
  };

  const togglePermission = (permission) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === '' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="w-full px-0 sm:px-1 lg:px-2 xl:px-2 py-4">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Role Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                Manage user roles and permissions across the system
              </p>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowAddRoleModal(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="hidden sm:inline">Add New Role</span>
                <span className="sm:hidden">Add Role</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-xl">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Users</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">
                  {users.filter(user => user.status === 'Active').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-xl">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Roles</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">{roles.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-xl">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Inactive Users</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600">
                  {users.filter(user => user.status === 'Inactive').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-xl">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-4 sm:mb-6">
          <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-white/20">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-semibold transition-all duration-200 text-xs sm:text-sm ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <span className="hidden sm:inline">Users Management</span>
              <span className="sm:hidden">Users</span>
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 rounded-lg font-semibold transition-all duration-200 text-xs sm:text-sm ${
                activeTab === 'roles'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <span className="hidden sm:inline">Roles & Permissions</span>
              <span className="sm:hidden">Roles</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
            <div className="p-3 sm:p-6 border-b border-gray-200/50">
              <div className="flex flex-col gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Users Management</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 sm:py-3 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base"
                    />
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 backdrop-blur-sm text-sm sm:text-base min-w-0 sm:w-auto"
                  >
                    <option value="">All Roles</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">User</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Status</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">Last Login</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors duration-200">
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-semibold text-sm sm:text-lg">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                            <div className="text-sm sm:text-lg font-semibold text-gray-900 truncate">{user.name}</div>
                            <div className="text-xs sm:text-sm text-gray-600 truncate">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium text-xs sm:text-sm"
                        >
                          {roles.map(role => (
                            <option key={role.id} value={role.name}>{role.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                        <span className={`inline-flex px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600 hidden lg:table-cell">
                        {user.lastLogin}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4">
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="px-2 sm:px-4 py-1 sm:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium text-xs sm:text-sm"
                          >
                            View
                          </button>
                          <button className="px-2 sm:px-4 py-1 sm:py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-xs sm:text-sm">
                            Deactivate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
            {roles.map((role) => (
              <div key={role.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-3 sm:p-4 lg:p-5 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${role.color} rounded-xl flex items-center justify-center`}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="flex gap-1 sm:gap-2">
                    <button
                      onClick={() => handleEditRole(role)}
                      className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteRole(role.id)}
                      className="p-1.5 sm:p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">{role.description}</p>
                
                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-700">Permissions</span>
                    <span className="text-xs sm:text-sm text-gray-500">{role.permissions.length} permissions</span>
                  </div>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <span key={permission} className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">
                        {permission}
                      </span>
                    ))}
                    {role.permissions.length > 3 && (
                      <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs bg-gray-100 text-gray-700 rounded-lg">
                        +{role.permissions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-200/50">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm text-gray-600">{role.users} user{role.users !== 1 ? 's' : ''}</span>
                  </div>
                  <button 
                    onClick={() => handleViewRoleDetails(role)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Role Modal */}
        {showAddRoleModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 mx-2 sm:mx-4">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Add New Role</h3>
                  <button
                    onClick={() => setShowAddRoleModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Role Name</label>
                    <input
                      type="text"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
                      placeholder="Enter role name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Description</label>
                    <textarea
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder-gray-500"
                      rows="3"
                      placeholder="Enter role description"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-3">Permissions</label>
                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50">
                      {availablePermissions.map((permission) => (
                        <label key={permission} className="flex items-center p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newRole.permissions.includes(permission)}
                            onChange={() => togglePermission(permission)}
                            className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-black font-medium">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={() => setShowAddRoleModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddRole}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg"
                  >
                    Add Role
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {showEditRoleModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-lg w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 mx-2 sm:mx-4">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Edit Role</h3>
                  <button
                    onClick={() => setShowEditRoleModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Role Name</label>
                    <input
                      type="text"
                      value={newRole.name}
                      onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Description</label>
                    <textarea
                      value={newRole.description}
                      onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black"
                      rows="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-black mb-3">Permissions</label>
                    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-gray-50">
                      {availablePermissions.map((permission) => (
                        <label key={permission} className="flex items-center p-2 hover:bg-white rounded-lg transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            checked={newRole.permissions.includes(permission)}
                            onChange={() => togglePermission(permission)}
                            className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-black font-medium">{permission}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={() => setShowEditRoleModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateRole}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg"
                  >
                    Update Role
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-md w-full shadow-2xl border border-white/20 mx-2 sm:mx-4">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">User Details</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-xl">
                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-xl font-bold text-gray-900">{selectedUser.name}</h4>
                      <p className="text-gray-600">{selectedUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <label className="block text-sm font-semibold text-black mb-2">Role</label>
                      <p className="text-lg font-medium text-black">{selectedUser.role}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <label className="block text-sm font-semibold text-black mb-2">Status</label>
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        selectedUser.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedUser.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block text-sm font-semibold text-black mb-2">Last Login</label>
                    <p className="text-lg font-medium text-black">{selectedUser.lastLogin}</p>
                  </div>
                </div>
                
                <div className="flex justify-end mt-8">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Role Details Modal */}
        {showRoleDetailsModal && selectedRoleDetails && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 mx-2 sm:mx-4">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Role Details</h3>
                  <button
                    onClick={() => setShowRoleDetailsModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Role Header */}
                  <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className={`w-16 h-16 ${selectedRoleDetails.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-2xl font-bold text-gray-900">{selectedRoleDetails.name}</h4>
                      <p className="text-gray-600">{selectedRoleDetails.description}</p>
                    </div>
                  </div>
                  
                  {/* Role Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <label className="block text-sm font-semibold text-black mb-2">Role ID</label>
                      <p className="text-lg font-medium text-black">#{selectedRoleDetails.id}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <label className="block text-sm font-semibold text-black mb-2">Users Assigned</label>
                      <p className="text-lg font-medium text-black">{selectedRoleDetails.users} user{selectedRoleDetails.users !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  
                  {/* Permissions Section */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-lg font-semibold text-black">Permissions</label>
                      <span className="text-sm text-gray-500">{selectedRoleDetails.permissions.length} permissions</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {selectedRoleDetails.permissions.map((permission) => (
                        <div key={permission} className="flex items-center p-2 bg-white rounded-lg border border-gray-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                          <span className="text-sm font-medium text-gray-900 capitalize">{permission.replace('_', ' ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Users with this role */}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block text-lg font-semibold text-black mb-4">Users with this Role</label>
                    <div className="space-y-2">
                      {users.filter(user => user.role === selectedRoleDetails.name).map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-semibold text-sm">
                                {user.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-600">{user.email}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                      ))}
                      {users.filter(user => user.role === selectedRoleDetails.name).length === 0 && (
                        <p className="text-gray-500 text-center py-4">No users assigned to this role</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-8">
                  <button
                    onClick={() => setShowRoleDetailsModal(false)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowRoleDetailsModal(false);
                      handleEditRole(selectedRoleDetails);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg"
                  >
                    Edit Role
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
