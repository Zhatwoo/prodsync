'use client';

import React, { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  MagnifyingGlassIcon, 
  FunnelIcon,
  PhoneIcon,
  ComputerDesktopIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  CalendarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  SignalIcon,
  WifiIcon,
  XMarkIcon,
  PlayIcon,
  PauseIcon,
  StopIcon
} from '@heroicons/react/24/outline';

const Telephone = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showAddTelephone, setShowAddTelephone] = useState(false);
  const [selectedTelephone, setSelectedTelephone] = useState(null);
  const [showCallLogs, setShowCallLogs] = useState(false);
  const [newTelephone, setNewTelephone] = useState({
    extension: '',
    user: '',
    department: '',
    position: '',
    ipAddress: '',
    macAddress: '',
    model: '',
    location: '',
    notes: ''
  });

  // Sample data - in real app, this would come from API/database
  const [telephones, setTelephones] = useState([
    {
      id: 'TEL-001',
      extension: '1001',
      user: 'John Smith',
      department: 'Sales',
      position: 'Sales Manager',
      ipAddress: '192.168.1.101',
      macAddress: '00:1B:44:11:3A:B7',
      model: 'Cisco IP Phone 7965',
      status: 'active',
      lastActivity: '2024-01-25T14:30:00',
      totalCalls: 45,
      todayCalls: 8,
      isInCall: false,
      currentCall: null,
      location: 'Office Floor 1 - Room 101',
      assignedDate: '2024-01-15',
      warrantyExpiry: '2025-01-15',
      notes: 'Primary sales line'
    },
    {
      id: 'TEL-002',
      extension: '1002',
      user: 'Sarah Johnson',
      department: 'Marketing',
      position: 'Marketing Specialist',
      ipAddress: '192.168.1.102',
      macAddress: '00:1B:44:11:3A:B8',
      model: 'Cisco IP Phone 7965',
      status: 'active',
      lastActivity: '2024-01-25T15:45:00',
      totalCalls: 32,
      todayCalls: 5,
      isInCall: true,
      currentCall: {
        number: '+1-555-0123',
        duration: '00:05:30',
        startTime: '2024-01-25T15:40:00'
      },
      location: 'Office Floor 1 - Room 102',
      assignedDate: '2024-01-15',
      warrantyExpiry: '2025-01-15',
      notes: 'Marketing campaigns line'
    },
    {
      id: 'TEL-003',
      extension: '1003',
      user: 'Mike Davis',
      department: 'IT',
      position: 'Software Developer',
      ipAddress: '192.168.1.103',
      macAddress: '00:1B:44:11:3A:B9',
      model: 'Cisco IP Phone 7965',
      status: 'inactive',
      lastActivity: '2024-01-24T17:00:00',
      totalCalls: 18,
      todayCalls: 0,
      isInCall: false,
      currentCall: null,
      location: 'Office Floor 2 - Room 201',
      assignedDate: '2024-01-10',
      warrantyExpiry: '2025-01-10',
      notes: 'IT support line - currently offline'
    },
    {
      id: 'TEL-004',
      extension: '1004',
      user: 'Lisa Chen',
      department: 'HR',
      position: 'HR Coordinator',
      ipAddress: '192.168.1.104',
      macAddress: '00:1B:44:11:3A:BA',
      model: 'Cisco IP Phone 7965',
      status: 'active',
      lastActivity: '2024-01-25T16:20:00',
      totalCalls: 28,
      todayCalls: 3,
      isInCall: false,
      currentCall: null,
      location: 'Office Floor 1 - Room 103',
      assignedDate: '2024-01-12',
      warrantyExpiry: '2025-01-12',
      notes: 'HR inquiries line'
    },
    {
      id: 'TEL-005',
      extension: '1005',
      user: 'David Wilson',
      department: 'Finance',
      position: 'Financial Analyst',
      ipAddress: '192.168.1.105',
      macAddress: '00:1B:44:11:3A:BB',
      model: 'Cisco IP Phone 7965',
      status: 'active',
      lastActivity: '2024-01-25T13:15:00',
      totalCalls: 22,
      todayCalls: 4,
      isInCall: false,
      currentCall: null,
      location: 'Office Floor 2 - Room 202',
      assignedDate: '2024-01-08',
      warrantyExpiry: '2025-01-08',
      notes: 'Finance department line'
    },
    {
      id: 'TEL-006',
      extension: '1006',
      user: 'Unassigned',
      department: 'IT',
      position: 'Spare',
      ipAddress: '192.168.1.106',
      macAddress: '00:1B:44:11:3A:BC',
      model: 'Cisco IP Phone 7965',
      status: 'maintenance',
      lastActivity: null,
      totalCalls: 0,
      todayCalls: 0,
      isInCall: false,
      currentCall: null,
      location: 'IT Storage Room',
      assignedDate: null,
      warrantyExpiry: '2025-02-01',
      notes: 'Spare phone for replacement'
    }
  ]);

  const [callLogs, setCallLogs] = useState([
    {
      id: 'CL-001',
      telephoneId: 'TEL-001',
      extension: '1001',
      user: 'John Smith',
      callType: 'outbound',
      phoneNumber: '+1-555-0101',
      contactName: 'ABC Corp - Sales',
      startTime: '2024-01-25T14:30:00',
      endTime: '2024-01-25T14:45:00',
      duration: '00:15:00',
      status: 'completed',
      department: 'Sales'
    },
    {
      id: 'CL-002',
      telephoneId: 'TEL-002',
      extension: '1002',
      user: 'Sarah Johnson',
      callType: 'inbound',
      phoneNumber: '+1-555-0202',
      contactName: 'Marketing Client',
      startTime: '2024-01-25T15:40:00',
      endTime: null,
      duration: '00:05:30',
      status: 'ongoing',
      department: 'Marketing'
    },
    {
      id: 'CL-003',
      telephoneId: 'TEL-004',
      extension: '1004',
      user: 'Lisa Chen',
      callType: 'inbound',
      phoneNumber: '+1-555-0303',
      contactName: 'Job Applicant',
      startTime: '2024-01-25T16:20:00',
      endTime: '2024-01-25T16:35:00',
      duration: '00:15:00',
      status: 'completed',
      department: 'HR'
    },
    {
      id: 'CL-004',
      telephoneId: 'TEL-001',
      extension: '1001',
      user: 'John Smith',
      callType: 'outbound',
      phoneNumber: '+1-555-0404',
      contactName: 'XYZ Company',
      startTime: '2024-01-25T13:15:00',
      endTime: '2024-01-25T13:25:00',
      duration: '00:10:00',
      status: 'completed',
      department: 'Sales'
    },
    {
      id: 'CL-005',
      telephoneId: 'TEL-005',
      extension: '1005',
      user: 'David Wilson',
      callType: 'outbound',
      phoneNumber: '+1-555-0505',
      contactName: 'Bank Representative',
      startTime: '2024-01-25T13:15:00',
      endTime: '2024-01-25T13:30:00',
      duration: '00:15:00',
      status: 'completed',
      department: 'Finance'
    }
  ]);

  const [departments] = useState([
    'Sales', 'Marketing', 'IT', 'HR', 'Finance', 'Operations'
  ]);

  // Calculate metrics
  const totalTelephones = telephones.length;
  const activeTelephones = telephones.filter(tel => tel.status === 'active').length;
  const inactiveTelephones = telephones.filter(tel => tel.status === 'inactive').length;
  const telephonesInCall = telephones.filter(tel => tel.isInCall).length;
  const totalCallsToday = telephones.reduce((sum, tel) => sum + tel.todayCalls, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-4 w-4" />;
      case 'inactive': return <ExclamationTriangleIcon className="h-4 w-4" />;
      case 'maintenance': return <ClockIcon className="h-4 w-4" />;
      case 'offline': return <XMarkIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getCallTypeColor = (type) => {
    switch (type) {
      case 'inbound': return 'bg-blue-100 text-blue-800';
      case 'outbound': return 'bg-green-100 text-green-800';
      case 'missed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTelephones = telephones.filter(telephone => {
    const matchesSearch = telephone.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         telephone.extension.includes(searchTerm) ||
                         telephone.ipAddress.includes(searchTerm) ||
                         telephone.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || telephone.status === filterStatus;
    const matchesDepartment = filterDepartment === 'all' || telephone.department === filterDepartment;
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleToggleStatus = (telephoneId) => {
    setTelephones(prev => prev.map(tel => 
      tel.id === telephoneId 
        ? { ...tel, status: tel.status === 'active' ? 'inactive' : 'active' }
        : tel
    ));
  };

  const handleEndCall = (telephoneId) => {
    setTelephones(prev => prev.map(tel => 
      tel.id === telephoneId 
        ? { ...tel, isInCall: false, currentCall: null }
        : tel
    ));
    
    // Update call logs
    setCallLogs(prev => prev.map(log => 
      log.telephoneId === telephoneId && log.status === 'ongoing'
        ? { ...log, status: 'completed', endTime: new Date().toISOString() }
        : log
    ));
  };

  const handleAddTelephone = () => {
    if (!newTelephone.extension || !newTelephone.user || !newTelephone.department) {
      alert('Please fill in all required fields (Extension, User, Department)');
      return;
    }

    const newId = `TEL-${String(telephones.length + 1).padStart(3, '0')}`;
    const telephone = {
      id: newId,
      extension: newTelephone.extension,
      user: newTelephone.user,
      department: newTelephone.department,
      position: newTelephone.position,
      ipAddress: newTelephone.ipAddress,
      macAddress: newTelephone.macAddress,
      model: newTelephone.model || 'Cisco IP Phone 7965',
      status: 'active',
      lastActivity: new Date().toISOString(),
      totalCalls: 0,
      todayCalls: 0,
      isInCall: false,
      currentCall: null,
      location: newTelephone.location,
      assignedDate: new Date().toISOString().split('T')[0],
      warrantyExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      notes: newTelephone.notes
    };

    setTelephones(prev => [...prev, telephone]);
    setShowAddTelephone(false);
    setNewTelephone({
      extension: '',
      user: '',
      department: '',
      position: '',
      ipAddress: '',
      macAddress: '',
      model: '',
      location: '',
      notes: ''
    });
  };

  const handleInputChange = (field, value) => {
    setNewTelephone(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return 'Never';
    const date = new Date(dateTimeString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (duration) => {
    if (!duration) return '00:00:00';
    return duration;
  };

  return (
    <>
      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.7) translateY(-50px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes backdropFadeIn {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(12px);
          }
        }
        
        @keyframes modalBounce {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-100px);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .modal-animate {
          animation: modalBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .backdrop-animate {
          animation: backdropFadeIn 0.4s ease-out;
        }
        
        .modal-enter {
          opacity: 0;
          transform: scale(0.7) translateY(-50px);
        }
        
        .modal-enter-active {
          opacity: 1;
          transform: scale(1) translateY(0);
          transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
      
      <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Telephone Management</h1>
        <p className="text-gray-600">Monitor and manage corporate telephone systems, users, IP addresses, and call activities</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PhoneIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Phones</p>
              <p className="text-2xl font-bold text-gray-900">{totalTelephones}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeTelephones}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">{inactiveTelephones}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <SignalIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Call</p>
              <p className="text-2xl font-bold text-gray-900">{telephonesInCall}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Calls Today</p>
              <p className="text-2xl font-bold text-gray-900">{totalCallsToday}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'telephones', name: 'Telephones', icon: PhoneIcon },
              { id: 'calllogs', name: 'Call Logs', icon: ClockIcon },
              { id: 'analytics', name: 'Analytics', icon: ChartBarIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Active Calls */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Active Calls</h3>
            </div>
            <div className="p-6">
              {telephones.filter(tel => tel.isInCall).length > 0 ? (
                <div className="space-y-4">
                  {telephones.filter(tel => tel.isInCall).map((telephone) => (
                    <div key={telephone.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <PhoneIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{telephone.user}</div>
                          <div className="text-sm text-gray-600">Extension: {telephone.extension}</div>
                          <div className="text-sm text-gray-600">Department: {telephone.department}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-900">{telephone.currentCall.number}</div>
                        <div className="text-sm text-gray-600">Duration: {telephone.currentCall.duration}</div>
                        <div className="text-sm text-gray-600">Started: {formatDateTime(telephone.currentCall.startTime)}</div>
                      </div>
                      <button
                        onClick={() => handleEndCall(telephone.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                      >
                        End Call
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <PhoneIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No active calls at the moment</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Telephones */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Telephone Status</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extension</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {telephones.slice(0, 5).map((telephone) => (
                    <tr key={telephone.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {telephone.extension}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm text-gray-900">{telephone.user}</div>
                          <div className="text-sm text-gray-500">{telephone.department}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {telephone.ipAddress}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(telephone.status)}`}>
                          {getStatusIcon(telephone.status)}
                          <span className="ml-1 capitalize">{telephone.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(telephone.lastActivity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => setSelectedTelephone(telephone)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(telephone.id)}
                            className={`${telephone.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          >
                            {telephone.status === 'active' ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'telephones' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Telephone Management</h3>
              <button
                onClick={() => setShowAddTelephone(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Telephone
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search telephones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
                    style={{ color: '#111827', backgroundColor: '#ffffff' }}
                  />
                </div>
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                style={{ color: '#111827', backgroundColor: '#ffffff' }}
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Telephones Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extension</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calls Today</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTelephones.map((telephone) => (
                  <tr key={telephone.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {telephone.extension}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{telephone.user}</div>
                        <div className="text-sm text-gray-500">{telephone.department}</div>
                        <div className="text-sm text-gray-500">{telephone.position}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {telephone.ipAddress}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {telephone.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(telephone.status)}`}>
                          {getStatusIcon(telephone.status)}
                          <span className="ml-1 capitalize">{telephone.status}</span>
                        </span>
                        {telephone.isInCall && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <SignalIcon className="h-3 w-3 mr-1" />
                            In Call
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {telephone.todayCalls}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setSelectedTelephone(telephone)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900" title="Edit">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(telephone.id)}
                          className={`${telephone.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          title={telephone.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {telephone.status === 'active' ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
                        </button>
                        {telephone.isInCall && (
                          <button 
                            onClick={() => handleEndCall(telephone.id)}
                            className="text-red-600 hover:text-red-900"
                            title="End Call"
                          >
                            <StopIcon className="h-4 w-4" />
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900" title="Print">
                          <PrinterIcon className="h-4 w-4" />
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

      {activeTab === 'calllogs' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Call Logs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Extension</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {callLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(log.startTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.extension}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{log.user}</div>
                        <div className="text-sm text-gray-500">{log.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCallTypeColor(log.callType)}`}>
                        {log.callType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.phoneNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.contactName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDuration(log.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === 'completed' ? 'bg-green-100 text-green-800' :
                        log.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                        log.status === 'missed' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Telephone Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Call Volume Trends</h4>
                <p className="text-sm text-gray-600">Track call volume patterns and peak usage times</p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                  View Trends
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Department Usage</h4>
                <p className="text-sm text-gray-600">Compare telephone usage across different departments</p>
                <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                  View Usage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Telephone Detail Modal */}
      {selectedTelephone && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Telephone Details</h3>
                <button
                  onClick={() => setSelectedTelephone(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Extension</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTelephone.extension}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedTelephone.status)}`}>
                      {getStatusIcon(selectedTelephone.status)}
                      <span className="ml-1 capitalize">{selectedTelephone.status}</span>
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTelephone.user}</p>
                    <p className="text-xs text-gray-500">{selectedTelephone.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTelephone.department}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IP Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTelephone.ipAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">MAC Address</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTelephone.macAddress}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTelephone.model}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTelephone.location}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Calls</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTelephone.totalCalls}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Calls Today</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTelephone.todayCalls}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Assigned Date</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTelephone.assignedDate || 'Not assigned'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Warranty Expiry</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedTelephone.warrantyExpiry}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Activity</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedTelephone.lastActivity)}</p>
                </div>
                
                {selectedTelephone.isInCall && selectedTelephone.currentCall && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-gray-900 mb-2">Current Call</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Number</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedTelephone.currentCall.number}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Duration</label>
                        <p className="mt-1 text-sm text-gray-900">{selectedTelephone.currentCall.duration}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700">Start Time</label>
                      <p className="mt-1 text-sm text-gray-900">{formatDateTime(selectedTelephone.currentCall.startTime)}</p>
                    </div>
                  </div>
                )}
                
                {selectedTelephone.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedTelephone.notes}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedTelephone(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => handleToggleStatus(selectedTelephone.id)}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    selectedTelephone.status === 'active' 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {selectedTelephone.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
                {selectedTelephone.isInCall && (
                  <button
                    onClick={() => {
                      handleEndCall(selectedTelephone.id);
                      setSelectedTelephone(null);
                    }}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    End Call
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Telephone Modal */}
      {showAddTelephone && (
        <div 
          className="fixed inset-0 backdrop-blur-lg overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 backdrop-animate"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddTelephone(false);
            }
          }}
        >
          <div className="relative mx-auto p-6 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-2xl rounded-lg bg-white modal-animate transform transition-all duration-300">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Add New Telephone</h3>
                <button
                  onClick={() => setShowAddTelephone(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Extension Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newTelephone.extension}
                        onChange={(e) => handleInputChange('extension', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 1001"
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        User Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newTelephone.user}
                        onChange={(e) => handleInputChange('user', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., John Smith"
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={newTelephone.department}
                        onChange={(e) => handleInputChange('department', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <input
                        type="text"
                        value={newTelephone.position}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Sales Manager"
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Technical Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Technical Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">IP Address</label>
                      <input
                        type="text"
                        value={newTelephone.ipAddress}
                        onChange={(e) => handleInputChange('ipAddress', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 192.168.1.101"
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">MAC Address</label>
                      <input
                        type="text"
                        value={newTelephone.macAddress}
                        onChange={(e) => handleInputChange('macAddress', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 00:1B:44:11:3A:B7"
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Model</label>
                      <input
                        type="text"
                        value={newTelephone.model}
                        onChange={(e) => handleInputChange('model', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Cisco IP Phone 7965"
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={newTelephone.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Office Floor 1 - Room 101"
                        style={{ color: '#111827', backgroundColor: '#ffffff' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={newTelephone.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Additional notes about this telephone..."
                      style={{ color: '#111827', backgroundColor: '#ffffff' }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowAddTelephone(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTelephone}
                  className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Add Telephone
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Telephone;

