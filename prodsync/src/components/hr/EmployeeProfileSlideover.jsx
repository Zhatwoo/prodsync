'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const EmployeeProfileSlideover = ({ employee, isOpen, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const statusConfig = {
    active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
    on_leave: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'On Leave' },
    terminated: { bg: 'bg-red-100', text: 'text-red-800', label: 'Terminated' }
  };

  const status = statusConfig[employee?.status] || statusConfig.active;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div
        className={cn(
          'fixed inset-0 bg-black transition-opacity duration-300',
          isOpen ? 'opacity-50' : 'opacity-0'
        )}
        onClick={onClose}
      />

      {/* Slideover */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">Employee Profile</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {employee ? (
              <div className="space-y-6">
                {/* Profile Header */}
                <div className="flex items-start space-x-4">
                  <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900">{employee.name}</h3>
                    <p className="text-lg text-slate-600">{employee.role}</p>
                    <div className="mt-2">
                      <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', status.bg, status.text)}>
                        {status.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Employee ID</label>
                      <p className="text-sm text-slate-900">{employee.employee_id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Email</label>
                      <p className="text-sm text-slate-900">{employee.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Phone</label>
                      <p className="text-sm text-slate-900">{employee.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Department</label>
                      <p className="text-sm text-slate-900">{employee.department}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Hire Date</label>
                      <p className="text-sm text-slate-900">{new Date(employee.hire_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Manager</label>
                      <p className="text-sm text-slate-900">{employee.manager}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Location</label>
                      <p className="text-sm text-slate-900">{employee.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Employment Status</label>
                      <p className="text-sm text-slate-900">{status.label}</p>
                    </div>
                  </div>
                </div>

                {/* Documents Section */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-lg font-medium text-slate-900 mb-4">Documents</h4>
                  <div className="space-y-3">
                    {employee.documents && employee.documents.length > 0 ? (
                      employee.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm text-slate-900">{doc}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-slate-900">No documents</h3>
                        <p className="mt-1 text-sm text-slate-500">No documents have been uploaded for this employee.</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Employment History */}
                <div className="border-t border-slate-200 pt-6">
                  <h4 className="text-lg font-medium text-slate-900 mb-4">Employment History</h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-blue-600 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-slate-900">{employee.role}</p>
                          <p className="text-sm text-slate-500">{employee.department}</p>
                        </div>
                        <p className="text-sm text-slate-600">{new Date(employee.hire_date).toLocaleDateString()} - Present</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-slate-900">No employee selected</h3>
                <p className="mt-1 text-sm text-slate-500">Select an employee to view their profile.</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {employee && (
            <div className="border-t border-slate-200 px-6 py-4">
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    // Handle edit employee
                    console.log('Edit employee:', employee.id);
                    onClose();
                  }}
                >
                  Edit Employee
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileSlideover;
