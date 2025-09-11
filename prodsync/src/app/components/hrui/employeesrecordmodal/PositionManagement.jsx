'use client';

import { useState, useEffect } from 'react';

export default function PositionManagement() {
  const [positions, setPositions] = useState([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [newPosition, setNewPosition] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    salaryRange: '',
    level: ''
  });

  // Sample position data
  useEffect(() => {
    const samplePositions = [
      {
        id: 1,
        title: 'Software Engineer',
        department: 'IT',
        description: 'Develop and maintain software applications',
        requirements: 'Bachelor\'s in Computer Science, 2+ years experience',
        salaryRange: '$60,000 - $90,000',
        level: 'Mid-level',
        employeeCount: 8,
        status: 'Active'
      },
      {
        id: 2,
        title: 'HR Manager',
        department: 'HR',
        description: 'Manage human resources operations and policies',
        requirements: 'Bachelor\'s in HR, 5+ years experience',
        salaryRange: '$70,000 - $100,000',
        level: 'Senior',
        employeeCount: 1,
        status: 'Active'
      },
      {
        id: 3,
        title: 'Marketing Specialist',
        department: 'Marketing',
        description: 'Develop and execute marketing campaigns',
        requirements: 'Bachelor\'s in Marketing, 3+ years experience',
        salaryRange: '$50,000 - $75,000',
        level: 'Mid-level',
        employeeCount: 5,
        status: 'Active'
      },
      {
        id: 4,
        title: 'Accountant',
        department: 'Finance',
        description: 'Handle financial records and reporting',
        requirements: 'Bachelor\'s in Accounting, CPA preferred',
        salaryRange: '$55,000 - $80,000',
        level: 'Mid-level',
        employeeCount: 3,
        status: 'Active'
      },
      {
        id: 5,
        title: 'Sales Manager',
        department: 'Sales',
        description: 'Lead sales team and manage client relationships',
        requirements: 'Bachelor\'s degree, 5+ years sales experience',
        salaryRange: '$80,000 - $120,000',
        level: 'Senior',
        employeeCount: 1,
        status: 'Active'
      },
      {
        id: 6,
        title: 'Operations Manager',
        department: 'Operations',
        description: 'Oversee daily operations and process improvement',
        requirements: 'Bachelor\'s degree, 4+ years operations experience',
        salaryRange: '$65,000 - $95,000',
        level: 'Senior',
        employeeCount: 1,
        status: 'Active'
      },
      {
        id: 7,
        title: 'Customer Service Rep',
        department: 'Operations',
        description: 'Handle customer inquiries and support',
        requirements: 'High school diploma, 1+ years customer service',
        salaryRange: '$35,000 - $45,000',
        level: 'Entry-level',
        employeeCount: 6,
        status: 'Active'
      },
      {
        id: 8,
        title: 'Data Analyst',
        department: 'IT',
        description: 'Analyze data and create reports for decision making',
        requirements: 'Bachelor\'s in Data Science, 2+ years experience',
        salaryRange: '$55,000 - $80,000',
        level: 'Mid-level',
        employeeCount: 2,
        status: 'Active'
      },
      {
        id: 9,
        title: 'Project Manager',
        department: 'IT',
        description: 'Manage software development projects',
        requirements: 'Bachelor\'s degree, PMP certification preferred',
        salaryRange: '$70,000 - $100,000',
        level: 'Senior',
        employeeCount: 2,
        status: 'Active'
      },
      {
        id: 10,
        title: 'Business Analyst',
        department: 'Operations',
        description: 'Analyze business processes and recommend improvements',
        requirements: 'Bachelor\'s in Business, 3+ years experience',
        salaryRange: '$60,000 - $85,000',
        level: 'Mid-level',
        employeeCount: 3,
        status: 'Active'
      },
      {
        id: 11,
        title: 'Designer',
        department: 'Marketing',
        description: 'Create visual designs and marketing materials',
        requirements: 'Bachelor\'s in Design, portfolio required',
        salaryRange: '$45,000 - $65,000',
        level: 'Mid-level',
        employeeCount: 2,
        status: 'Active'
      },
      {
        id: 12,
        title: 'Developer',
        department: 'IT',
        description: 'Write and maintain code for applications',
        requirements: 'Bachelor\'s in Computer Science, coding skills',
        salaryRange: '$50,000 - $80,000',
        level: 'Mid-level',
        employeeCount: 4,
        status: 'Active'
      }
    ];
    setPositions(samplePositions);
  }, []);

  const departments = ['IT', 'HR', 'Marketing', 'Finance', 'Sales', 'Operations', 'Customer Service'];
  const levels = ['Entry-level', 'Mid-level', 'Senior', 'Executive'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPosition(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPosition) {
      // Update existing position
      setPositions(prev => prev.map(pos => 
        pos.id === editingPosition.id 
          ? { ...pos, ...newPosition }
          : pos
      ));
      setEditingPosition(null);
    } else {
      // Add new position
      const position = {
        id: positions.length + 1,
        ...newPosition,
        employeeCount: 0,
        status: 'Active'
      };
      setPositions(prev => [...prev, position]);
    }
    
    setNewPosition({
      title: '',
      department: '',
      description: '',
      requirements: '',
      salaryRange: '',
      level: ''
    });
    setIsAddingNew(false);
  };

  const handleEdit = (position) => {
    setEditingPosition(position);
    setNewPosition({
      title: position.title,
      department: position.department,
      description: position.description,
      requirements: position.requirements,
      salaryRange: position.salaryRange,
      level: position.level
    });
    setIsAddingNew(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this position?')) {
      setPositions(prev => prev.filter(pos => pos.id !== id));
    }
  };

  const cancelForm = () => {
    setIsAddingNew(false);
    setEditingPosition(null);
    setNewPosition({
      title: '',
      department: '',
      description: '',
      requirements: '',
      salaryRange: '',
      level: ''
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Position Management</h2>
            <p className="text-gray-600 mt-1">Manage job positions and their requirements</p>
          </div>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Position
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="bg-white border border-gray-200 rounded-lg mb-6">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingPosition ? 'Edit Position' : 'Add New Position'}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position Title *</label>
                <input
                  type="text"
                  name="title"
                  value={newPosition.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter position title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
                <select
                  name="department"
                  value={newPosition.department}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  name="level"
                  value={newPosition.level}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Level</option>
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                <input
                  type="text"
                  name="salaryRange"
                  value={newPosition.salaryRange}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., $50,000 - $75,000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={newPosition.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter position description"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Requirements</label>
                <textarea
                  name="requirements"
                  value={newPosition.requirements}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter job requirements"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                type="button"
                onClick={cancelForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingPosition ? 'Update Position' : 'Add Position'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Positions List */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {positions.map((position) => (
                <tr key={position.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{position.title}</div>
                      <div className="text-sm text-gray-500">{position.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{position.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      position.level === 'Senior' ? 'bg-purple-100 text-purple-800' :
                      position.level === 'Mid-level' ? 'bg-blue-100 text-blue-800' :
                      position.level === 'Entry-level' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {position.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{position.employeeCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{position.salaryRange}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(position)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(position.id)}
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
            <div className="text-2xl font-bold text-blue-600">{positions.length}</div>
            <div className="text-sm text-gray-600">Total Positions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {positions.reduce((sum, pos) => sum + pos.employeeCount, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Employees</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {positions.filter(pos => pos.level === 'Senior').length}
            </div>
            <div className="text-sm text-gray-600">Senior Positions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {positions.filter(pos => pos.level === 'Entry-level').length}
            </div>
            <div className="text-sm text-gray-600">Entry-level Positions</div>
          </div>
        </div>
      </div>
    </div>
  );
}