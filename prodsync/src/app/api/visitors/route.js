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

// GET /api/visitors - Get all visitors with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const purpose = searchParams.get('purpose');
    const date = searchParams.get('date');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    let filteredVisitors = [...visitors];

    // Apply filters
    if (status && status !== 'all') {
      filteredVisitors = filteredVisitors.filter(v => v.status === status);
    }

    if (purpose && purpose !== 'all') {
      filteredVisitors = filteredVisitors.filter(v => v.purpose === purpose);
    }

    if (date) {
      const filterDate = new Date(date).toDateString();
      filteredVisitors = filteredVisitors.filter(v => {
        const visitorDate = new Date(v.check_in).toDateString();
        return visitorDate === filterDate;
      });
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredVisitors = filteredVisitors.filter(v =>
        v.name.toLowerCase().includes(searchLower) ||
        v.company.toLowerCase().includes(searchLower) ||
        v.email.toLowerCase().includes(searchLower) ||
        v.host.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVisitors = filteredVisitors.slice(startIndex, endIndex);

    return NextResponse.json({
      visitors: paginatedVisitors,
      pagination: {
        page,
        limit,
        total: filteredVisitors.length,
        totalPages: Math.ceil(filteredVisitors.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching visitors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visitors' },
      { status: 500 }
    );
  }
}

// POST /api/visitors - Create a new visitor
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'company', 'email', 'phone', 'purpose', 'host'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate new visitor ID and QR code
    const newId = (visitors.length + 1).toString();
    const newQRCode = `QR${String(visitors.length + 1).padStart(3, '0')}`;

    const newVisitor = {
      id: newId,
      ...body,
      check_in: new Date().toISOString(),
      check_out: null,
      status: 'checked_in',
      badge_printed: false,
      qr_code: newQRCode,
      documents: body.documents || []
    };

    visitors.unshift(newVisitor); // Add to beginning of array

    return NextResponse.json(newVisitor, { status: 201 });
  } catch (error) {
    console.error('Error creating visitor:', error);
    return NextResponse.json(
      { error: 'Failed to create visitor' },
      { status: 500 }
    );
  }
}

// PUT /api/visitors - Update visitor status (check out)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: id and action' },
        { status: 400 }
      );
    }

    const visitorIndex = visitors.findIndex(v => v.id === id);
    if (visitorIndex === -1) {
      return NextResponse.json(
        { error: 'Visitor not found' },
        { status: 404 }
      );
    }

    const visitor = visitors[visitorIndex];

    switch (action) {
      case 'check_out':
        if (visitor.status !== 'checked_in') {
          return NextResponse.json(
            { error: 'Visitor is not checked in' },
            { status: 400 }
          );
        }
        visitors[visitorIndex] = {
          ...visitor,
          status: 'checked_out',
          check_out: new Date().toISOString()
        };
        break;

      case 'print_badge':
        visitors[visitorIndex] = {
          ...visitor,
          badge_printed: true
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json(visitors[visitorIndex]);
  } catch (error) {
    console.error('Error updating visitor:', error);
    return NextResponse.json(
      { error: 'Failed to update visitor' },
      { status: 500 }
    );
  }
}
