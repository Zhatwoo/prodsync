'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

export const usePayrollStats = () => {
  const [totalGrossPay, setTotalGrossPay] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [taxSettings, setTaxSettings] = useState(0);
  const [totalNetPay, setTotalNetPay] = useState(0);
  const [totalDeductions, setTotalDeductions] = useState(0);
  const [averageSalary, setAverageSalary] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayrollStats = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch employees data
        const employeesRef = collection(db, 'employees');
        const employeesQuery = query(employeesRef, orderBy('createdAt', 'desc'));
        const employeesSnapshot = await getDocs(employeesQuery);
        
        let totalGross = 0;
        let totalNet = 0;
        let totalDeductions = 0;
        let activeCount = 0;
        let salarySum = 0;
        let employeeCount = 0;

        employeesSnapshot.forEach((doc) => {
          const employee = doc.data();
          
          // Handle different salary data types
          let basicSalary = 0;
          if (employee.salary !== undefined && employee.salary !== null) {
            if (typeof employee.salary === 'string') {
              // If it's a string, remove non-numeric characters and parse
              basicSalary = parseFloat(employee.salary.replace(/[^0-9.-]+/g, '') || 0);
            } else if (typeof employee.salary === 'number') {
              // If it's already a number, use it directly
              basicSalary = employee.salary;
            } else {
              // Log unexpected data types for debugging
              console.warn('Unexpected salary data type:', typeof employee.salary, employee.salary);
            }
          }
          
          if (basicSalary > 0) {
            const allowances = Math.round(basicSalary * 0.1); // 10% of basic salary
            const overtime = Math.round(basicSalary * 0.05); // 5% of basic salary
            const bonuses = Math.round(basicSalary * 0.08); // 8% of basic salary
            const grossSalary = basicSalary + allowances + overtime + bonuses;
            const deductions = Math.round(grossSalary * 0.2); // 20% deductions
            const netSalary = grossSalary - deductions;

            totalGross += grossSalary;
            totalNet += netSalary;
            totalDeductions += deductions;
            salarySum += grossSalary;
            employeeCount++;

            if (employee.status === 'Active') {
              activeCount++;
            }
          }
        });

        // Fetch tax settings count
        const taxSettingsRef = collection(db, 'taxSettings');
        const taxSettingsQuery = query(taxSettingsRef, orderBy('createdAt', 'desc'));
        const taxSettingsSnapshot = await getDocs(taxSettingsQuery);
        const taxSettingsCount = taxSettingsSnapshot.size;

        setTotalGrossPay(totalGross);
        setActiveEmployees(activeCount);
        setTaxSettings(taxSettingsCount);
        setTotalNetPay(totalNet);
        setTotalDeductions(totalDeductions);
        setAverageSalary(employeeCount > 0 ? Math.round(salarySum / employeeCount) : 0);

      } catch (err) {
        console.error('Error fetching payroll stats:', err);
        setError('Failed to load payroll statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollStats();
  }, []);

  return {
    totalGrossPay,
    activeEmployees,
    taxSettings,
    totalNetPay,
    totalDeductions,
    averageSalary,
    loading,
    error
  };
};
