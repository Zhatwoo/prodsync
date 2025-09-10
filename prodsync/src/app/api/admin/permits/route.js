import { NextResponse } from 'next/server';

// Mock data - in a real application, this would come from a database
let permits = [
  {
    id: 1,
    name: 'Building Construction Permit',
    type: 'Construction Permit',
    permitNumber: 'CP-2024-001',
    issuingAuthority: 'City Building Department',
    issueDate: '2024-02-01',
    expiryDate: '2024-08-01',
    status: 'Active',
    description: 'Permit for new office building construction',
    location: '123 Main Street, Downtown',
    contractor: 'ABC Construction Co.',
    documents: ['building-plans.pdf', 'safety-certificate.pdf'],
    inspections: [
      { 
        id: 1,
        date: '2024-02-15', 
        type: 'Foundation', 
        status: 'Passed', 
        inspector: 'John Smith',
        notes: 'Foundation inspection completed successfully'
      },
      { 
        id: 2,
        date: '2024-03-01', 
        type: 'Framing', 
        status: 'Scheduled', 
        inspector: 'Jane Doe',
        notes: 'Framing inspection scheduled'
      }
    ],
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 2,
    name: 'Health Department Permit',
    type: 'Health Permit',
    permitNumber: 'HP-2024-002',
    issuingAuthority: 'County Health Department',
    issueDate: '2024-01-10',
    expiryDate: '2025-01-10',
    status: 'Active',
    description: 'Food service establishment permit',
    location: '456 Oak Avenue, Midtown',
    contractor: 'N/A',
    documents: ['health-inspection.pdf', 'food-safety-plan.pdf'],
    inspections: [
      { 
        id: 1,
        date: '2024-01-10', 
        type: 'Initial Inspection', 
        status: 'Passed', 
        inspector: 'Dr. Sarah Johnson',
        notes: 'Initial health inspection passed with minor recommendations'
      }
    ],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z'
  },
  {
    id: 3,
    name: 'Fire Safety Certificate',
    type: 'Fire Safety',
    permitNumber: 'FS-2024-003',
    issuingAuthority: 'Fire Department',
    issueDate: '2023-11-15',
    expiryDate: '2024-11-15',
    status: 'Expiring Soon',
    description: 'Fire safety compliance certificate',
    location: '789 Pine Street, Uptown',
    contractor: 'N/A',
    documents: ['fire-safety-plan.pdf', 'sprinkler-certificate.pdf'],
    inspections: [
      { 
        id: 1,
        date: '2023-11-15', 
        type: 'Annual Inspection', 
        status: 'Passed', 
        inspector: 'Captain Mike Wilson',
        notes: 'Annual fire safety inspection completed'
      }
    ],
    createdAt: '2023-11-15T10:00:00Z',
    updatedAt: '2023-11-15T10:00:00Z'
  }
];

// GET /api/admin/permits
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let filteredPermits = [...permits];

    // Apply filters
    if (status && status !== 'All') {
      filteredPermits = filteredPermits.filter(permit => permit.status === status);
    }

    if (type && type !== 'All') {
      filteredPermits = filteredPermits.filter(permit => permit.type === type);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredPermits = filteredPermits.filter(permit => 
        permit.name.toLowerCase().includes(searchLower) ||
        permit.permitNumber.toLowerCase().includes(searchLower) ||
        permit.location.toLowerCase().includes(searchLower) ||
        permit.description.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredPermits,
      total: filteredPermits.length
    });
  } catch (error) {
    console.error('Error fetching permits:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch permits' },
      { status: 500 }
    );
  }
}

// POST /api/admin/permits
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'type', 'permitNumber', 'issuingAuthority', 'issueDate', 'expiryDate'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if permit number already exists
    const existingPermit = permits.find(permit => permit.permitNumber === body.permitNumber);
    if (existingPermit) {
      return NextResponse.json(
        { success: false, error: 'Permit number already exists' },
        { status: 400 }
      );
    }

    const newPermit = {
      id: Math.max(...permits.map(permit => permit.id)) + 1,
      name: body.name,
      type: body.type,
      permitNumber: body.permitNumber,
      issuingAuthority: body.issuingAuthority,
      issueDate: body.issueDate,
      expiryDate: body.expiryDate,
      status: body.status || 'Active',
      description: body.description || '',
      location: body.location || '',
      contractor: body.contractor || '',
      documents: body.documents || [],
      inspections: body.inspections || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    permits.push(newPermit);

    return NextResponse.json({
      success: true,
      data: newPermit,
      message: 'Permit created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating permit:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create permit' },
      { status: 500 }
    );
  }
}
