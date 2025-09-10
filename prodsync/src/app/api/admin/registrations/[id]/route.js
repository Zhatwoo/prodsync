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

// GET /api/admin/registrations/[id]
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const registration = registrations.find(reg => reg.id === id);

    if (!registration) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: registration
    });
  } catch (error) {
    console.error('Error fetching registration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch registration' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/registrations/[id]
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    const registrationIndex = registrations.findIndex(reg => reg.id === id);
    
    if (registrationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Check if registration number already exists (excluding current registration)
    if (body.registrationNumber) {
      const existingRegistration = registrations.find(reg => 
        reg.registrationNumber === body.registrationNumber && reg.id !== id
      );
      if (existingRegistration) {
        return NextResponse.json(
          { success: false, error: 'Registration number already exists' },
          { status: 400 }
        );
      }
    }

    // Update registration
    const updatedRegistration = {
      ...registrations[registrationIndex],
      ...body,
      id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    registrations[registrationIndex] = updatedRegistration;

    return NextResponse.json({
      success: true,
      data: updatedRegistration,
      message: 'Registration updated successfully'
    });
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update registration' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/registrations/[id]
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    const registrationIndex = registrations.findIndex(reg => reg.id === id);
    
    if (registrationIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Registration not found' },
        { status: 404 }
      );
    }

    registrations.splice(registrationIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Registration deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete registration' },
      { status: 500 }
    );
  }
}
