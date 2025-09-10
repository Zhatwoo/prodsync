import { NextResponse } from 'next/server';

// Mock data for today's shifts
const mockTodaysShifts = [
  {
    id: '1',
    employee: 'Alice Johnson',
    position: 'Front Desk',
    startTime: '08:00',
    endTime: '16:00',
    status: 'scheduled',
    department: 'Reception'
  },
  {
    id: '2',
    employee: 'Bob Wilson',
    position: 'Sales Associate',
    startTime: '09:00',
    endTime: '17:00',
    status: 'in_progress',
    department: 'Sales'
  },
  {
    id: '3',
    employee: 'Carol Brown',
    position: 'Customer Service',
    startTime: '10:00',
    endTime: '18:00',
    status: 'scheduled',
    department: 'Support'
  },
  {
    id: '4',
    employee: 'David Lee',
    position: 'Maintenance',
    startTime: '07:00',
    endTime: '15:00',
    status: 'completed',
    department: 'Facilities'
  },
  {
    id: '5',
    employee: 'Eva Martinez',
    position: 'HR Coordinator',
    startTime: '08:30',
    endTime: '16:30',
    status: 'scheduled',
    department: 'Human Resources'
  }
];

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return NextResponse.json({
    success: true,
    data: mockTodaysShifts,
    summary: {
      total: mockTodaysShifts.length,
      inProgress: mockTodaysShifts.filter(s => s.status === 'in_progress').length,
      completed: mockTodaysShifts.filter(s => s.status === 'completed').length,
      scheduled: mockTodaysShifts.filter(s => s.status === 'scheduled').length
    }
  });
}
