import { NextResponse } from 'next/server';

// Mock data for tasks due
const mockTasksDue = [
  {
    id: '1',
    title: 'Complete Q4 Performance Reviews',
    assignee: 'HR Team',
    dueDate: '2024-01-20',
    priority: 'high',
    status: 'in_progress',
    category: 'HR',
    progress: 75
  },
  {
    id: '2',
    title: 'Prepare Monthly Financial Report',
    assignee: 'Finance Team',
    dueDate: '2024-01-18',
    priority: 'critical',
    status: 'pending',
    category: 'Finance',
    progress: 30
  },
  {
    id: '3',
    title: 'Update Employee Handbook',
    assignee: 'Legal Team',
    dueDate: '2024-01-22',
    priority: 'medium',
    status: 'in_progress',
    category: 'Legal',
    progress: 60
  },
  {
    id: '4',
    title: 'Conduct Security Audit',
    assignee: 'IT Security',
    dueDate: '2024-01-25',
    priority: 'high',
    status: 'pending',
    category: 'Security',
    progress: 0
  },
  {
    id: '5',
    title: 'Plan Team Building Event',
    assignee: 'HR Coordinator',
    dueDate: '2024-01-19',
    priority: 'low',
    status: 'in_progress',
    category: 'HR',
    progress: 45
  },
  {
    id: '6',
    title: 'Review Vendor Contracts',
    assignee: 'Procurement',
    dueDate: '2024-01-21',
    priority: 'medium',
    status: 'pending',
    category: 'Procurement',
    progress: 20
  }
];

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 750));
  
  return NextResponse.json({
    success: true,
    data: mockTasksDue,
    summary: {
      total: mockTasksDue.length,
      overdue: mockTasksDue.filter(task => new Date(task.dueDate) < new Date()).length,
      dueToday: mockTasksDue.filter(task => {
        const today = new Date().toISOString().split('T')[0];
        return task.dueDate === today;
      }).length,
      dueThisWeek: mockTasksDue.filter(task => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        return dueDate <= weekFromNow;
      }).length
    }
  });
}
