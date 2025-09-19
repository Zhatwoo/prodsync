'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../lib/firebaseClient';

export const useEmployeeStats = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalPositions: 0,
    newHiresThisMonth: 0,
    activeEmployees: 0,
    onLeaveEmployees: 0,
    inactiveEmployees: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStats(prev => ({ ...prev, loading: true, error: null }));

        // Fetch employees
        const employeesRef = collection(db, 'employees');
        const employeesQuery = query(employeesRef, orderBy('createdAt', 'desc'));
        const employeesSnapshot = await getDocs(employeesQuery);
        
        const employees = [];
        employeesSnapshot.forEach((doc) => {
          employees.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Fetch departments
        const departmentsRef = collection(db, 'departments');
        const departmentsQuery = query(departmentsRef, orderBy('createdAt', 'desc'));
        const departmentsSnapshot = await getDocs(departmentsQuery);
        
        const departments = [];
        departmentsSnapshot.forEach((doc) => {
          departments.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Fetch positions
        const positionsRef = collection(db, 'positions');
        const positionsQuery = query(positionsRef, orderBy('createdAt', 'desc'));
        const positionsSnapshot = await getDocs(positionsQuery);
        
        const positions = [];
        positionsSnapshot.forEach((doc) => {
          positions.push({
            id: doc.id,
            ...doc.data()
          });
        });

        // Calculate statistics
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const newHiresThisMonth = employees.filter(emp => {
          const joinDate = emp.joinDate ? new Date(emp.joinDate) : new Date(emp.createdAt?.toDate?.() || emp.createdAt);
          return joinDate.getMonth() === currentMonth && joinDate.getFullYear() === currentYear;
        }).length;

        const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
        const onLeaveEmployees = employees.filter(emp => emp.status === 'On Leave').length;
        const inactiveEmployees = employees.filter(emp => emp.status === 'Inactive').length;

        setStats({
          totalEmployees: employees.length,
          totalDepartments: departments.length,
          totalPositions: positions.length,
          newHiresThisMonth,
          activeEmployees,
          onLeaveEmployees,
          inactiveEmployees,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('Error fetching employee stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load statistics'
        }));
      }
    };

    fetchStats();
  }, []);

  return stats;
};
