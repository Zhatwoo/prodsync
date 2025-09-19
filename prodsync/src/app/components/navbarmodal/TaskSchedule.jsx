'use client';

import { useState, useEffect } from 'react';
import { useSchedule } from '../../context/ScheduleContext';

export default function TaskScheduleModal({ isOpen, onClose }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTask, setNewTask] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [isClosing, setIsClosing] = useState(false);
  
  // Use shared context for task management
  const { tasks, addTask, updateTask, deleteTask, getTasksForDate, formatDateKey } = useSchedule();

  // Update current date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // formatDateKey and getTasksForDate are now provided by the context

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now(),
      text: newTask.trim(),
      time: newTaskTime || 'All Day',
      priority: newTaskPriority,
      completed: false,
      createdAt: new Date()
    };

    addTask(selectedDate, task);

    setNewTask('');
    setNewTaskTime('');
    setNewTaskPriority('medium');
  };

  const handleToggleTaskComplete = (date, taskId) => {
    const currentTasks = getTasksForDate(date);
    const task = currentTasks.find(t => t.id === taskId);
    if (task) {
      updateTask(date, taskId, { completed: !task.completed });
    }
  };

  const handleDeleteTask = (date, taskId) => {
    deleteTask(date, taskId);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date && date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date && date.toDateString() === selectedDate.toDateString();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  const days = getDaysInMonth(currentDate);
  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <div className={`fixed top-16 left-1/2 transform -translate-x-1/2 z-50 w-[800px] max-h-[calc(100vh-6rem)] transition-all duration-300 ease-out ${
      isClosing ? 'animate-slideUp' : 'animate-slideDown'
    }`} style={{ marginLeft: '170px' }} data-modal="task-schedule">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Task Schedule</h2>
              <p className="text-blue-100 mt-1">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {/* Calendar Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-gray-900">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 bg-gray-50">
              {daysOfWeek.map(day => (
                <div key={day} className="p-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="h-20 border-r border-b border-gray-200 last:border-r-0"></div>;
                }

                const dayTasks = getTasksForDate(day);
                const hasTasks = dayTasks.length > 0;
                const completedTasks = dayTasks.filter(task => task.completed).length;

                return (
                  <div
                    key={day.getDate()}
                    onClick={() => setSelectedDate(day)}
                    className={`h-20 p-2 border-r border-b border-gray-200 last:border-r-0 cursor-pointer transition-colors ${
                      isSelected(day) 
                        ? 'bg-blue-100 border-blue-300' 
                        : isToday(day)
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col h-full">
                      <div className={`text-sm font-medium ${
                        isSelected(day) ? 'text-blue-900' : isToday(day) ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        {day.getDate()}
                      </div>
                      {hasTasks && (
                        <div className="mt-1 flex-1">
                          <div className="text-xs text-gray-600">
                            {completedTasks}/{dayTasks.length} tasks
                          </div>
                          <div className="flex space-x-1 mt-1">
                            {dayTasks.slice(0, 3).map(task => (
                              <div
                                key={task.id}
                                className={`w-2 h-2 rounded-full ${
                                  task.completed ? 'bg-green-500' : 
                                  task.priority === 'high' ? 'bg-red-500' :
                                  task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-400'
                                }`}
                              ></div>
                            ))}
                            {dayTasks.length > 3 && (
                              <div className="text-xs text-gray-500">+{dayTasks.length - 3}</div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Tasks */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-900">
                Tasks for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
            </div>

            {/* Add New Task */}
            <div className="p-4 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Enter task description..."
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  />
                </div>
                <div>
                  <input
                    type="time"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>
              <button
                onClick={handleAddTask}
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Task</span>
              </button>
            </div>

            {/* Task List */}
            <div className="p-4">
              {selectedDateTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm font-medium">No tasks for this day</p>
                  <p className="text-xs text-gray-400 mt-1">Add a task above to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateTasks.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-center p-3 rounded-lg border ${
                        task.completed 
                          ? 'bg-gray-50 border-gray-200' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <button
                        onClick={() => handleToggleTaskComplete(selectedDate, task.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-colors ${
                          task.completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        {task.completed && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${
                          task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                          {task.text}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">{task.time}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleDeleteTask(selectedDate, task.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
