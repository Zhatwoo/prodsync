import { NextResponse } from 'next/server';

// Mock data - in a real application, this would come from a database
let registrations = [
  {
    id: 1,
    name: 'Business License',
    type: 'Business Registration',
    registrationNumber: 'BL-2024-001',
    issuingAuthority: 'City Business Bureau',
    issueDate: '2024-01-15',
    expiryDate: '2025-01-15',
    status: 'Active',
    description: 'General business operating license',
    documents: ['business-license.pdf', 'tax-certificate.pdf'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Tax Registration',
    type: 'Tax Registration',
    registrationNumber: 'TR-2024-002',
    issuingAuthority: 'State Tax Department',
    issueDate: '2024-01-20',
    expiryDate: '2025-01-20',
    status: 'Active',
    description: 'State tax registration certificate',
    documents: ['tax-registration.pdf'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 3,
    name: 'Professional License',
    type: 'Professional License',
    registrationNumber: 'PL-2024-003',
    issuingAuthority: 'Professional Licensing Board',
    issueDate: '2023-12-01',
    expiryDate: '2024-12-01',
    status: 'Expiring Soon',
    description: 'Professional services license',
    documents: ['professional-license.pdf', 'continuing-education.pdf'],
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2023-12-01T10:00:00Z'
  }
];

// GET /api/admin/registrations
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let filteredRegistrations = [...registrations];

    // Apply filters
    if (status && status !== 'All') {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.status === status);
    }

    if (type && type !== 'All') {
      filteredRegistrations = filteredRegistrations.filter(reg => reg.type === type);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredRegistrations = filteredRegistrations.filter(reg => 
        reg.name.toLowerCase().includes(searchLower) ||
        reg.registrationNumber.toLowerCase().includes(searchLower) ||
        reg.description.toLowerCase().includes(searchLower)
      );
    }

    return NextResponse.json({
      success: true,
      data: filteredRegistrations,
      total: filteredRegistrations.length
    });
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

// POST /api/admin/registrations
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'type', 'registrationNumber', 'issuingAuthority', 'issueDate', 'expiryDate'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if registration number already exists
    const existingRegistration = registrations.find(reg => reg.registrationNumber === body.registrationNumber);
    if (existingRegistration) {
      return NextResponse.json(
        { success: false, error: 'Registration number already exists' },
        { status: 400 }
      );
    }

    const newRegistration = {
      id: Math.max(...registrations.map(reg => reg.id)) + 1,
      name: body.name,
      type: body.type,
      registrationNumber: body.registrationNumber,
      issuingAuthority: body.issuingAuthority,
      issueDate: body.issueDate,
      expiryDate: body.expiryDate,
      status: body.status || 'Active',
      description: body.description || '',
      documents: body.documents || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    registrations.push(newRegistration);

    return NextResponse.json({
      success: true,
      data: newRegistration,
      message: 'Registration created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating registration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create registration' },
      { status: 500 }
    );
  }
}
