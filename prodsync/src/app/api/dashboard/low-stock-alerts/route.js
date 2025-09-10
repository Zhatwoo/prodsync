import { NextResponse } from 'next/server';

// Mock data for low stock alerts
const mockLowStockAlerts = [
  {
    id: '1',
    product: 'Office Paper A4',
    sku: 'PAP-001',
    currentStock: 15,
    minStock: 50,
    category: 'Office Supplies',
    supplier: 'Office Depot',
    lastRestocked: '2024-01-10',
    urgency: 'high'
  },
  {
    id: '2',
    product: 'Printer Toner Black',
    sku: 'TON-002',
    currentStock: 3,
    minStock: 10,
    category: 'IT Supplies',
    supplier: 'Tech Solutions',
    lastRestocked: '2024-01-08',
    urgency: 'critical'
  },
  {
    id: '3',
    product: 'Coffee Beans Premium',
    sku: 'COF-003',
    currentStock: 8,
    minStock: 20,
    category: 'Kitchen Supplies',
    supplier: 'Coffee Co.',
    lastRestocked: '2024-01-12',
    urgency: 'medium'
  },
  {
    id: '4',
    product: 'Cleaning Supplies Kit',
    sku: 'CLN-004',
    currentStock: 2,
    minStock: 15,
    category: 'Maintenance',
    supplier: 'Clean Pro',
    lastRestocked: '2024-01-05',
    urgency: 'critical'
  },
  {
    id: '5',
    product: 'Safety Equipment Set',
    sku: 'SAF-005',
    currentStock: 12,
    minStock: 25,
    category: 'Safety',
    supplier: 'Safety First',
    lastRestocked: '2024-01-09',
    urgency: 'medium'
  }
];

export async function GET() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return NextResponse.json({
    success: true,
    data: mockLowStockAlerts,
    summary: {
      total: mockLowStockAlerts.length,
      critical: mockLowStockAlerts.filter(item => item.urgency === 'critical').length,
      high: mockLowStockAlerts.filter(item => item.urgency === 'high').length,
      medium: mockLowStockAlerts.filter(item => item.urgency === 'medium').length
    }
  });
}
