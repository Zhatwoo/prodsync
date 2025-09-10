import { NextResponse } from 'next/server';

// Mock data for open tickets
const mockOpenTickets = [
  {
    id: 'TKT-001',
    title: 'Printer not working in Conference Room A',
    category: 'Hardware',
    priority: 'high',
    status: 'open',
    assignee: 'IT Support',
    createdDate: '2024-01-15',
    lastUpdated: '2024-01-15',
    description: 'Printer shows error code and cannot print documents'
  },
  {
    id: 'TKT-002',
    title: 'Email server connectivity issues',
    category: 'Software',
    priority: 'critical',
    status: 'in_progress',
    assignee: 'Network Admin',
    createdDate: '2024-01-14',
    lastUpdated: '2024-01-15',
    description: 'Intermittent email server connection problems'
  },
  {
    id: 'TKT-003',
    title: 'Request for software license renewal',
    category: 'License',
    priority: 'medium',
    status: 'open',
    assignee: 'IT Manager',
    createdDate: '2024-01-13',
    lastUpdated: '2024-01-13',
    description: 'Adobe Creative Suite license expires next month'
  },
  {
    id: 'TKT-004',
    title: 'New employee laptop setup',
    category: 'Setup',
    priority: 'low',
    status: 'open',
    assignee: 'IT Support',
    createdDate: '2024-01-12',
    lastUpdated: '2024-01-12',
    description: 'Setup laptop for new hire starting next week'
  },
  {
    id: 'TKT-005',
    title: 'VPN access for remote worker',
    category: 'Access',
    priority: 'medium',
    status: 'in_progress',
    assignee: 'Security Admin',
    createdDate: '2024-01-11',
    lastUpdated: '2024-01-14',
    description: 'Configure VPN access for new remote employee'
  }
];

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  return NextResponse.json({
    success: true,
    data: mockOpenTickets,
    summary: {
      total: mockOpenTickets.length,
      open: mockOpenTickets.filter(ticket => ticket.status === 'open').length,
      inProgress: mockOpenTickets.filter(ticket => ticket.status === 'in_progress').length,
      critical: mockOpenTickets.filter(ticket => ticket.priority === 'critical').length,
      high: mockOpenTickets.filter(ticket => ticket.priority === 'high').length
    }
  });
}
