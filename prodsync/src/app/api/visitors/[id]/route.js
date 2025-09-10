import { NextResponse } from 'next/server';

// Mock data - in a real app, this would come from a database
let visitors = [
  {
    id: '1',
    name: 'John Smith',
    company: 'TechCorp Inc.',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    purpose: 'Business Meeting',
    host: 'Jane Doe',
    host_department: 'Engineering',
    check_in: '2024-01-15T09:30:00Z',
    check_out: '2024-01-15T11:45:00Z',
    status: 'checked_out',
    badge_printed: true,
    qr_code: 'QR001',
    notes: 'Meeting about new project collaboration',
    documents: ['NDA.pdf', 'Business_Card.jpg']
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Design Studio',
    email: 'sarah@designstudio.com',
    phone: '+1 (555) 234-5678',
    purpose: 'Client Presentation',
    host: 'Mike Wilson',
    host_department: 'Sales',
    check_in: '2024-01-15T14:00:00Z',
    check_out: null,
    status: 'checked_in',
    badge_printed: true,
    qr_code: 'QR002',
    notes: 'Presenting new design concepts',
    documents: ['Portfolio.pdf']
  },
  {
    id: '3',
    name: 'Michael Brown',
    company: 'Consulting Group',
    email: 'michael@consulting.com',
    phone: '+1 (555) 345-6789',
    purpose: 'Interview',
    host: 'Lisa Chen',
    host_department: 'HR',
    check_in: '2024-01-15T10:00:00Z',
    check_out: '2024-01-15T12:00:00Z',
    status: 'checked_out',
    badge_printed: false,
    qr_code: 'QR003',
    notes: 'Senior developer position interview',
    documents: ['Resume.pdf', 'References.pdf']
  }
];

// GET /api/visitors/[id] - Get a specific visitor
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const visitor = visitors.find(v => v.id === id);
    if (!visitor) {
      return NextResponse.json(
        { error: 'Visitor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(visitor);
  } catch (error) {
    console.error('Error fetching visitor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visitor' },
      { status: 500 }
    );
  }
}

// PUT /api/visitors/[id] - Update a specific visitor
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const visitorIndex = visitors.findIndex(v => v.id === id);
    if (visitorIndex === -1) {
      return NextResponse.json(
        { error: 'Visitor not found' },
        { status: 404 }
      );
    }

    // Update visitor with new data
    visitors[visitorIndex] = {
      ...visitors[visitorIndex],
      ...body,
      id // Ensure ID doesn't change
    };

    return NextResponse.json(visitors[visitorIndex]);
  } catch (error) {
    console.error('Error updating visitor:', error);
    return NextResponse.json(
      { error: 'Failed to update visitor' },
      { status: 500 }
    );
  }
}

// DELETE /api/visitors/[id] - Delete a specific visitor
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const visitorIndex = visitors.findIndex(v => v.id === id);
    if (visitorIndex === -1) {
      return NextResponse.json(
        { error: 'Visitor not found' },
        { status: 404 }
      );
    }

    const deletedVisitor = visitors[visitorIndex];
    visitors.splice(visitorIndex, 1);

    return NextResponse.json(deletedVisitor);
  } catch (error) {
    console.error('Error deleting visitor:', error);
    return NextResponse.json(
      { error: 'Failed to delete visitor' },
      { status: 500 }
    );
  }
}
