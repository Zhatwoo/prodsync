import { NextResponse } from 'next/server';

// Mock data for payroll snapshot
const mockPayrollData = {
  currentPeriod: {
    totalEmployees: 45,
    totalPayroll: 125000,
    averageSalary: 2777.78,
    processed: 42,
    pending: 3
  },
  previousPeriod: {
    totalEmployees: 44,
    totalPayroll: 118000,
    averageSalary: 2681.82,
    processed: 44,
    pending: 0
  },
  trends: {
    payrollChange: 5.93, // percentage
    employeeChange: 2.27, // percentage
    averageSalaryChange: 3.58 // percentage
  },
  departmentBreakdown: [
    { department: 'Engineering', amount: 45000, employees: 12 },
    { department: 'Sales', amount: 35000, employees: 10 },
    { department: 'Marketing', amount: 20000, employees: 6 },
    { department: 'HR', amount: 15000, employees: 4 },
    { department: 'Operations', amount: 10000, employees: 13 }
  ]
};

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return NextResponse.json({
    success: true,
    data: mockPayrollData
  });
}
