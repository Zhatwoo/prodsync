'use client';

import { useState, useEffect } from 'react';

export default function EmployeeProfile() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Sample employee data
  useEffect(() => {
    const sampleEmployees = [
      {
        id: 1,
        name: 'John Smith',
        position: 'Software Engineer',
        department: 'IT',
        email: 'john.smith@company.com',
        phone: '+1 (555) 123-4567',
        status: 'Active',
        joinDate: '2023-01-15',
        salary: '$75,000',
        address: '123 Main St, City, State 12345',
        emergencyContact: 'Jane Smith',
        emergencyPhone: '+1 (555) 987-6543',
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        avatar: 'JS'
      },
      {
        id: 2,
        name: 'Sarah Johnson',
        position: 'HR Manager',
        department: 'HR',
        email: 'sarah.johnson@company.com',
        phone: '+1 (555) 234-5678',
        status: 'Active',
        joinDate: '2022-08-20',
        salary: '$85,000',
        address: '456 Oak Ave, City, State 12345',
        emergencyContact: 'Robert Johnson',
        emergencyPhone: '+1 (555) 876-5432',
        skills: ['HR Management', 'Recruitment', 'Employee Relations'],
        avatar: 'SJ'
      }
    ];
    setEmployees(sampleEmployees);
    if (sampleEmployees.length > 0) {
      setSelectedEmployee(sampleEmployees[0]);
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Employee Profile</h2>
        <p className="text-gray-600 mt-1">View detailed employee information</p>
      </div>

      {/* Employee Selector */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Employee</label>
        <select
          value={selectedEmployee?.id || ''}
          onChange={(e) => {
            const employee = employees.find(emp => emp.id === parseInt(e.target.value));
            setSelectedEmployee(employee);
          }}
          className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          {employees.map(employee => (
            <option key={employee.id} value={employee.id}>{employee.name}</option>
          ))}
        </select>
      </div>

      {selectedEmployee && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {selectedEmployee.avatar}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedEmployee.name}</h3>
                <p className="text-gray-600 mb-2">{selectedEmployee.position}</p>
                <p className="text-gray-500 mb-4">{selectedEmployee.department}</p>
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedEmployee.status)}`}>
                  {selectedEmployee.status}
                </span>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm text-gray-600">{selectedEmployee.phone}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-gray-600">Joined {new Date(selectedEmployee.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Employment Information */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Employment Information</h3>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Employee ID</label>
                    <p className="text-gray-900">{selectedEmployee.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Position</label>
                    <p className="text-gray-900">{selectedEmployee.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                    <p className="text-gray-900">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Salary</label>
                    <p className="text-gray-900">{selectedEmployee.salary}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Start Date</label>
                    <p className="text-gray-900">{new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEmployee.status)}`}>
                      {selectedEmployee.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                    <p className="text-gray-900">{selectedEmployee.address}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Contact</label>
                      <p className="text-gray-900">{selectedEmployee.emergencyContact}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Phone</label>
                      <p className="text-gray-900">{selectedEmployee.emergencyPhone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Skills & Qualifications</h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                    Edit Profile
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    View Documents
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                    Generate Report
                  </button>
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors">
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}