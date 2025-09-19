'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, orderBy, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../lib/firebaseClient';
import DeleteConfirmation from '../../DeleteConfirmation';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch employees from Firebase
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const employeesRef = collection(db, 'employees');
        const q = query(employeesRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const employeesData = [];
        querySnapshot.forEach((doc) => {
          employeesData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        setEmployees(employeesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Get unique departments and statuses from employees data
  const departments = ['All', ...new Set(employees.map(emp => emp.department).filter(Boolean))];
  const statuses = ['All', ...new Set(employees.map(emp => emp.status).filter(Boolean))];

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
    setIsClosing(false);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setEditFormData({
      name: employee.name,
      position: employee.position,
      department: employee.department,
      email: employee.email,
      phone: employee.phone,
      status: employee.status,
      salary: employee.salary,
      joinDate: employee.joinDate
    });
    setShowEditModal(true);
    setIsClosing(false);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowViewModal(false);
      setShowEditModal(false);
      setSelectedEmployee(null);
      setEditingEmployee(null);
      setEditFormData({});
      setIsClosing(false);
    }, 300);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    if (!editingEmployee) return;

    setIsUpdating(true);
    try {
      const employeeRef = doc(db, 'employees', editingEmployee.id);
      await updateDoc(employeeRef, {
        ...editFormData,
        updatedAt: serverTimestamp()
      });

      // Update local state
      setEmployees(prev => prev.map(emp => 
        emp.id === editingEmployee.id 
          ? { ...emp, ...editFormData, updatedAt: new Date() }
          : emp
      ));

      alert('Employee updated successfully!');
      handleCloseModal();
    } catch (err) {
      console.error('Error updating employee:', err);
      alert('Failed to update employee. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteEmployee = (employee) => {
    setEmployeeToDelete(employee);
    setShowDeleteModal(true);
  };

  const confirmDeleteEmployee = async () => {
    if (!employeeToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'employees', employeeToDelete.id));
      setEmployees(prev => prev.filter(emp => emp.id !== employeeToDelete.id));
      setShowDeleteModal(false);
      setEmployeeToDelete(null);
      alert('Employee deleted successfully!');
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert('Failed to delete employee');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportData = () => {
    try {
      // Prepare data for export
      const exportData = filteredEmployees.map(emp => ({
        'Employee ID': emp.id.substring(0, 8) + '...',
        'Name': emp.name,
        'Position': emp.position,
        'Department': emp.department,
        'Email': emp.email,
        'Phone': emp.phone,
        'Status': emp.status,
        'Join Date': new Date(emp.joinDate).toLocaleDateString(),
        'Salary': emp.salary || 'N/A',
        'Address': emp.address || 'N/A',
        'Emergency Contact': emp.emergencyContact || 'N/A',
        'Emergency Phone': emp.emergencyPhone || 'N/A',
        'Skills': emp.skills ? emp.skills.join(', ') : 'N/A',
        'Notes': emp.notes || 'N/A'
      }));

      // Convert to CSV
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Escape commas and quotes in CSV
            return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `employees_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Exported ${exportData.length} employees successfully!`);
    } catch (err) {
      console.error('Error exporting data:', err);
      alert('Failed to export data');
    }
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === '' || selectedDepartment === 'All' || employee.department === selectedDepartment;
    const matchesStatus = selectedStatus === '' || selectedStatus === 'All' || employee.status === selectedStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      case 'Inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading employees...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search employees..."
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {departments.map(dept => (
                <option key={dept} value={dept === 'All' ? '' : dept}>{dept}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statuses.map(status => (
                <option key={status} value={status === 'All' ? '' : status}>{status}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button 
              onClick={handleExportData}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {employee.avatar}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        <div className="text-sm text-gray-500">ID: {employee.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{employee.email}</div>
                    <div className="text-sm text-gray-500">{employee.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(employee.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewEmployee(employee)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleEditEmployee(employee)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">{employees.filter(e => e.status === 'Active').length}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">{employees.filter(e => e.status === 'On Leave').length}</div>
            <div className="text-sm text-gray-600">On Leave</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{employees.filter(e => e.status === 'Inactive').length}</div>
            <div className="text-sm text-gray-600">Inactive</div>
          </div>
        </div>
      </div>

      {/* View Employee Modal */}
      {showViewModal && selectedEmployee && (
        <div 
          className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
          onClick={handleCloseModal}
        >
          <div 
            className={`bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 transition-all duration-300 ${isClosing ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Employee Details</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Employee ID</label>
                <p className="text-gray-900">{selectedEmployee.id.substring(0, 8)}...</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                <p className="text-gray-900">{selectedEmployee.name}</p>
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
                <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                <p className="text-gray-900">{selectedEmployee.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                <p className="text-gray-900">{selectedEmployee.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEmployee.status)}`}>
                  {selectedEmployee.status}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Join Date</label>
                <p className="text-gray-900">{new Date(selectedEmployee.joinDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Salary</label>
                <p className="text-gray-900">{selectedEmployee.salary || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                <p className="text-gray-900">{selectedEmployee.address || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Contact</label>
                <p className="text-gray-900">{selectedEmployee.emergencyContact || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Emergency Phone</label>
                <p className="text-gray-900">{selectedEmployee.emergencyPhone || 'N/A'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {selectedEmployee.skills && selectedEmployee.skills.length > 0 ? (
                    selectedEmployee.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No skills listed</span>
                  )}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Notes</label>
                <p className="text-gray-900">{selectedEmployee.notes || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && editingEmployee && (
        <div 
          className={`fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
          onClick={handleCloseModal}
        >
          <div 
            className={`bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 transition-all duration-300 ${isClosing ? 'opacity-0 scale-95 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Edit Employee</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdateEmployee}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                  <input
                    type="text"
                    name="position"
                    value={editFormData.position || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={editFormData.department || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    name="status"
                    value={editFormData.status || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
                  <input
                    type="text"
                    name="salary"
                    value={editFormData.salary || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                  <input
                    type="date"
                    name="joinDate"
                    value={editFormData.joinDate || ''}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={confirmDeleteEmployee}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? All associated data will be permanently removed."
        itemName={employeeToDelete?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}