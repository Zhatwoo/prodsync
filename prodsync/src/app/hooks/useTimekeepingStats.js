'use client';

import { useState, useEffect } from 'react';
import { useSchedule } from '../context/ScheduleContext';

// Utility function to reset all timekeeping data
export const resetTimekeepingData = () => {
  localStorage.removeItem('attendanceData');
  localStorage.removeItem('leaveRequests');
  localStorage.removeItem('overtimeRequests');
  localStorage.removeItem('attendanceReports');
  localStorage.removeItem('scheduleData');
  localStorage.removeItem('scheduleTasks');
  localStorage.removeItem('scheduleData');
  console.log('Timekeeping data reset. Refresh the page to see new data.');
};

export const useTimekeepingStats = () => {
  const [stats, setStats] = useState({
    attendanceRate: 0,
    activeEmployees: 0,
    leaveRequests: 0,
    totalSchedules: 0,
    pendingOvertime: 0,
    totalReports: 0,
    totalTasks: 0,
    completedTasks: 0,
    isLoading: true
  });

  const { getAllSchedules } = useSchedule();

  useEffect(() => {
    const calculateStats = async () => {
      try {
        // Initialize sample data if localStorage is empty
        if (!localStorage.getItem('attendanceData')) {
          const sampleAttendanceData = [
            { id: 1, employeeName: 'John Smith', status: 'Present', department: 'IT' },
            { id: 2, employeeName: 'Sarah Johnson', status: 'Present', department: 'HR' },
            { id: 3, employeeName: 'Mike Davis', status: 'Absent', department: 'Marketing' },
            { id: 4, employeeName: 'Emily Wilson', status: 'Present', department: 'Finance' },
            { id: 5, employeeName: 'David Brown', status: 'Present', department: 'Sales' }
          ];
          localStorage.setItem('attendanceData', JSON.stringify(sampleAttendanceData));
        }

        if (!localStorage.getItem('leaveRequests')) {
          const sampleLeaveRequests = [
            { id: 1, employeeName: 'John Smith', status: 'Pending', leaveType: 'Vacation' },
            { id: 2, employeeName: 'Sarah Johnson', status: 'Approved', leaveType: 'Sick Leave' },
            { id: 3, employeeName: 'Mike Davis', status: 'Pending', leaveType: 'Personal' }
          ];
          localStorage.setItem('leaveRequests', JSON.stringify(sampleLeaveRequests));
        }

        if (!localStorage.getItem('overtimeRequests')) {
          const sampleOvertimeRequests = [
            { id: 1, employeeName: 'John Smith', status: 'Pending', hours: 2 },
            { id: 2, employeeName: 'Emily Wilson', status: 'Approved', hours: 1.5 }
          ];
          localStorage.setItem('overtimeRequests', JSON.stringify(sampleOvertimeRequests));
        }

        if (!localStorage.getItem('attendanceReports')) {
          const sampleReports = [
            { id: 1, reportType: 'Daily Report', status: 'Completed' },
            { id: 2, reportType: 'Weekly Summary', status: 'Completed' },
            { id: 3, reportType: 'Monthly Report', status: 'Pending' }
          ];
          localStorage.setItem('attendanceReports', JSON.stringify(sampleReports));
        }

        if (!localStorage.getItem('scheduleData')) {
          const sampleScheduleData = [
            { id: 1, employeeName: 'John Smith', shiftType: 'Day Shift', status: 'Scheduled' },
            { id: 2, employeeName: 'Sarah Johnson', shiftType: 'Day Shift', status: 'Scheduled' },
            { id: 3, employeeName: 'Mike Davis', shiftType: 'Flexible', status: 'Scheduled' },
            { id: 4, employeeName: 'Emily Wilson', shiftType: 'Day Shift', status: 'Scheduled' },
            { id: 5, employeeName: 'David Brown', shiftType: 'Evening Shift', status: 'Scheduled' },
            { id: 6, employeeName: 'Lisa Garcia', shiftType: 'Night Shift', status: 'Scheduled' }
          ];
          localStorage.setItem('scheduleData', JSON.stringify(sampleScheduleData));
        }

        // Get schedule data from context
        const allSchedules = getAllSchedules();
        const totalSchedules = allSchedules.length;
        const activeEmployees = new Set(allSchedules.map(s => s.employeeName)).size;

        // Also get schedule data from localStorage for more accurate count
        const localStorageSchedules = JSON.parse(localStorage.getItem('scheduleData') || '[]');
        const localStorageEmployeeNames = new Set(localStorageSchedules.map(s => s.employeeName));

        // Get tasks data from context for more accurate employee count
        const tasksData = JSON.parse(localStorage.getItem('scheduleTasks') || '{}');
        const taskEmployees = new Set();
        Object.values(tasksData).forEach(dayTasks => {
          dayTasks.forEach(task => {
            if (task.employeeName && task.employeeName !== 'Task Schedule') {
              taskEmployees.add(task.employeeName);
            }
          });
        });

        // Combine employee counts from schedules and tasks
        const combinedEmployees = Math.max(activeEmployees, taskEmployees.size, localStorageEmployeeNames.size);

        // Get attendance data from localStorage if available
        const attendanceData = JSON.parse(localStorage.getItem('attendanceData') || '[]');
        const presentEmployees = attendanceData.filter(emp => emp.status === 'Present').length;
        const totalEmployees = attendanceData.length;
        const attendanceRate = totalEmployees > 0 ? Math.round((presentEmployees / totalEmployees) * 100) : 0;

        // Get leave requests from localStorage if available
        const leaveRequests = JSON.parse(localStorage.getItem('leaveRequests') || '[]');
        const pendingLeaveRequests = leaveRequests.filter(req => req.status === 'Pending').length;

        // Get overtime requests from localStorage if available
        const overtimeRequests = JSON.parse(localStorage.getItem('overtimeRequests') || '[]');
        const pendingOvertime = overtimeRequests.filter(req => req.status === 'Pending').length;

        // Get reports from localStorage if available
        const reports = JSON.parse(localStorage.getItem('attendanceReports') || '[]');
        const totalReports = reports.length;

        // Calculate additional stats from tasks
        const totalTasks = Object.values(tasksData).reduce((sum, dayTasks) => sum + dayTasks.length, 0);
        const completedTasks = Object.values(tasksData).reduce((sum, dayTasks) => 
          sum + dayTasks.filter(task => task.completed).length, 0
        );

        const finalStats = {
          attendanceRate: attendanceRate,
          activeEmployees: combinedEmployees,
          leaveRequests: pendingLeaveRequests,
          totalSchedules: totalSchedules + localStorageSchedules.length,
          pendingOvertime: pendingOvertime,
          totalReports: totalReports,
          totalTasks: totalTasks,
          completedTasks: completedTasks,
          isLoading: false
        };

        // Debug logging
        console.log('Timekeeping Stats Calculated:', {
          attendanceData: attendanceData.length,
          presentEmployees,
          attendanceRate,
          allSchedules: allSchedules.length,
          localStorageSchedules: localStorageSchedules.length,
          combinedEmployees,
          leaveRequests: leaveRequests.length,
          pendingLeaveRequests,
          overtimeRequests: overtimeRequests.length,
          pendingOvertime,
          reports: reports.length,
          totalTasks,
          completedTasks
        });

        setStats(finalStats);
      } catch (error) {
        console.error('Error calculating timekeeping stats:', error);
        // Fallback to zero values when there's an error
        setStats({
          attendanceRate: 0,
          activeEmployees: 0,
          leaveRequests: 0,
          totalSchedules: 0,
          pendingOvertime: 0,
          totalReports: 0,
          totalTasks: 0,
          completedTasks: 0,
          isLoading: false
        });
      }
    };

    calculateStats();

    // Listen for storage changes to refresh stats
    const handleStorageChange = () => {
      calculateStats();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from the app
    window.addEventListener('timekeepingDataChanged', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('timekeepingDataChanged', handleStorageChange);
    };
  }, [getAllSchedules]);

  return stats;
};
