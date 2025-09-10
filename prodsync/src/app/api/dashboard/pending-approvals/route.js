import { NextResponse } from 'next/server';

// Mock data for pending approvals
const mockPendingApprovals = [
  {
    id: '1',
    type: 'leave_request',
    title: 'Annual Leave Request',
    requester: 'John Smith',
    department: 'Engineering',
    date: '2024-01-15',
    status: 'pending',
    priority: 'medium'
  },
  {
    id: '2',
    type: 'expense_report',
    title: 'Business Travel Expenses',
    requester: 'Sarah Johnson',
    department: 'Sales',
    date: '2024-01-14',
    status: 'pending',
    priority: 'high'
  },
  {
    id: '3',
    type: 'purchase_order',
    title: 'Office Supplies Purchase',
    requester: 'Mike Chen',
    department: 'Operations',
    date: '2024-01-13',
    status: 'pending',
    priority: 'low'
  },
  {
    id: '4',
    type: 'overtime_request',
    title: 'Weekend Overtime',
    requester: 'Emily Davis',
    department: 'Customer Service',
    date: '2024-01-12',
    status: 'pending',
    priority: 'medium'
  }
];

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return NextResponse.json({
    success: true,
    data: mockPendingApprovals,
    total: mockPendingApprovals.length
  });
}
