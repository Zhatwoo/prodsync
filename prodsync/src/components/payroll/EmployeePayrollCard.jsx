'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const EmployeePayrollCard = ({ employee, isSelected, onSelect, onPreviewPayslip }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!employee) return null;

  // Calculate payroll amounts
  const basicSalary = employee.salary.basic / 12; // Monthly
  const allowances = Object.values(employee.salary.allowances).reduce((sum, val) => sum + val, 0);
  const deductions = Object.values(employee.salary.deductions).reduce((sum, val) => sum + val, 0);
  const grossPay = basicSalary + allowances;
  const netPay = grossPay - deductions;

  return (
    <div className={`bg-white rounded-lg border-2 transition-all duration-200 ${
      isSelected ? 'border-blue-500 shadow-lg' : 'border-slate-200 hover:border-slate-300'
    }`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(employee, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
            />
            
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            
            <div>
              <h3 className="font-medium text-slate-900">{employee.name}</h3>
              <p className="text-sm text-slate-500">{employee.employee_id} • {employee.role}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              employee.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : employee.status === 'on_leave'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {employee.status === 'active' ? 'Active' : 
               employee.status === 'on_leave' ? 'On Leave' : 'Terminated'}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-sm text-slate-600">Gross Pay</p>
            <p className="font-medium text-green-600">
              ${grossPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Deductions</p>
            <p className="font-medium text-red-600">
              ${deductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Net Pay</p>
            <p className="font-medium text-blue-600">
              ${netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings */}
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Earnings</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Basic Salary</span>
                  <span className="font-medium">${basicSalary.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                {Object.entries(employee.salary.allowances).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-slate-600 capitalize">{key} Allowance</span>
                    <span className="font-medium">${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium border-t border-slate-300 pt-2">
                  <span>Total Gross</span>
                  <span className="text-green-600">${grossPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <h4 className="font-medium text-slate-900 mb-3">Deductions</h4>
              <div className="space-y-2">
                {Object.entries(employee.salary.deductions).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-slate-600 capitalize">{key}</span>
                    <span className="font-medium">${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                <div className="flex justify-between text-sm font-medium border-t border-slate-300 pt-2">
                  <span>Total Deductions</span>
                  <span className="text-red-600">${deductions.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Details */}
          <div className="mt-6 pt-4 border-t border-slate-300">
            <h4 className="font-medium text-slate-900 mb-3">Employee Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Department:</span>
                <p className="font-medium">{employee.department}</p>
              </div>
              <div>
                <span className="text-slate-600">Hire Date:</span>
                <p className="font-medium">{new Date(employee.hire_date).toLocaleDateString()}</p>
              </div>
              <div>
                <span className="text-slate-600">Manager:</span>
                <p className="font-medium">{employee.manager}</p>
              </div>
              <div>
                <span className="text-slate-600">Location:</span>
                <p className="font-medium">{employee.location}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPreviewPayslip(employee)}
              leftIcon={
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            >
              Preview Payslip
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeePayrollCard;
