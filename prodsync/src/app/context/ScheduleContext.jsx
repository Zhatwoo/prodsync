'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ScheduleContext = createContext();

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }) => {
  const [tasks, setTasks] = useState({});
  const [schedules, setSchedules] = useState([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('scheduleTasks');
    const savedSchedules = localStorage.getItem('scheduleData');
    
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
      }
    }
    
    if (savedSchedules) {
      try {
        setSchedules(JSON.parse(savedSchedules));
      } catch (error) {
        console.error('Error loading schedules from localStorage:', error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('scheduleTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save schedules to localStorage whenever schedules change
  useEffect(() => {
    localStorage.setItem('scheduleData', JSON.stringify(schedules));
  }, [schedules]);

  // Task management functions
  const addTask = (date, task) => {
    const dateKey = formatDateKey(date);
    setTasks(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), task]
    }));
  };

  const updateTask = (date, taskId, updatedTask) => {
    const dateKey = formatDateKey(date);
    setTasks(prev => ({
      ...prev,
      [dateKey]: prev[dateKey]?.map(task => 
        task.id === taskId ? { ...task, ...updatedTask } : task
      ) || []
    }));
  };

  const deleteTask = (date, taskId) => {
    const dateKey = formatDateKey(date);
    setTasks(prev => ({
      ...prev,
      [dateKey]: prev[dateKey]?.filter(task => task.id !== taskId) || []
    }));
  };

  const getTasksForDate = (date) => {
    const dateKey = formatDateKey(date);
    return tasks[dateKey] || [];
  };

  // Schedule management functions
  const addSchedule = (schedule) => {
    const newSchedule = {
      id: Date.now(),
      ...schedule,
      status: 'Scheduled',
      createdDate: new Date().toISOString().split('T')[0]
    };
    setSchedules(prev => [newSchedule, ...prev]);
    return newSchedule;
  };

  const updateSchedule = (scheduleId, updatedSchedule) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === scheduleId 
        ? { ...schedule, ...updatedSchedule }
        : schedule
    ));
  };

  const deleteSchedule = (scheduleId) => {
    // Check if it's a task-based schedule
    if (scheduleId.toString().startsWith('task-')) {
      // Extract the task ID from the schedule ID
      const taskId = parseInt(scheduleId.replace('task-', ''));
      
      // Find and delete the task from tasks
      Object.keys(tasks).forEach(dateKey => {
        const dayTasks = tasks[dateKey];
        if (dayTasks && dayTasks.some(task => task.id === taskId)) {
          setTasks(prev => ({
            ...prev,
            [dateKey]: prev[dateKey].filter(task => task.id !== taskId)
          }));
        }
      });
    } else {
      // Delete regular schedule
      setSchedules(prev => prev.filter(schedule => schedule.id !== scheduleId));
    }
  };

  // Convert tasks to schedules format for ScheduleManagement
  const getSchedulesFromTasks = () => {
    const taskSchedules = [];
    
    Object.entries(tasks).forEach(([dateKey, dayTasks]) => {
      dayTasks.forEach(task => {
        // Convert task to schedule format
        const schedule = {
          id: `task-${task.id}`,
          employeeName: 'Task Schedule', // Default since tasks don't have employee names
          employeeId: `TASK${task.id}`,
          shiftType: getShiftTypeFromPriority(task.priority),
          startTime: task.time === 'All Day' ? '09:00' : task.time,
          endTime: task.time === 'All Day' ? '17:00' : calculateEndTime(task.time),
          date: dateKey,
          department: 'General',
          notes: task.text,
          status: task.completed ? 'Completed' : 'Scheduled',
          createdDate: task.createdAt ? new Date(task.createdAt).toISOString().split('T')[0] : dateKey,
          isFromTask: true // Flag to identify tasks converted to schedules
        };
        taskSchedules.push(schedule);
      });
    });
    
    return taskSchedules;
  };

  // Helper functions
  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getShiftTypeFromPriority = (priority) => {
    switch (priority) {
      case 'high': return 'Day Shift';
      case 'medium': return 'Flexible';
      case 'low': return 'Half Day';
      default: return 'Flexible';
    }
  };

  const calculateEndTime = (startTime) => {
    if (!startTime || startTime === 'All Day') return '17:00';
    
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + 8; // Default 8-hour shift
    const endMinutes = minutes;
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  // Get combined schedules (both regular schedules and converted tasks)
  const getAllSchedules = () => {
    const regularSchedules = schedules.filter(s => !s.isFromTask);
    const taskSchedules = getSchedulesFromTasks();
    return [...regularSchedules, ...taskSchedules];
  };

  const value = {
    // Task data and functions
    tasks,
    addTask,
    updateTask,
    deleteTask,
    getTasksForDate,
    
    // Schedule data and functions
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    getAllSchedules,
    
    // Utility functions
    formatDateKey
  };

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};
