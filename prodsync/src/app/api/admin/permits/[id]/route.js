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

// GET /api/admin/permits/[id]
export async function GET(request, { params }) {
  try {
    const id = parseInt(params.id);
    const permit = permits.find(permit => permit.id === id);

    if (!permit) {
      return NextResponse.json(
        { success: false, error: 'Permit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: permit
    });
  } catch (error) {
    console.error('Error fetching permit:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch permit' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/permits/[id]
export async function PUT(request, { params }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    
    const permitIndex = permits.findIndex(permit => permit.id === id);
    
    if (permitIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Permit not found' },
        { status: 404 }
      );
    }

    // Check if permit number already exists (excluding current permit)
    if (body.permitNumber) {
      const existingPermit = permits.find(permit => 
        permit.permitNumber === body.permitNumber && permit.id !== id
      );
      if (existingPermit) {
        return NextResponse.json(
          { success: false, error: 'Permit number already exists' },
          { status: 400 }
        );
      }
    }

    // Update permit
    const updatedPermit = {
      ...permits[permitIndex],
      ...body,
      id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString()
    };

    permits[permitIndex] = updatedPermit;

    return NextResponse.json({
      success: true,
      data: updatedPermit,
      message: 'Permit updated successfully'
    });
  } catch (error) {
    console.error('Error updating permit:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update permit' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/permits/[id]
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);
    const permitIndex = permits.findIndex(permit => permit.id === id);
    
    if (permitIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Permit not found' },
        { status: 404 }
      );
    }

    permits.splice(permitIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'Permit deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting permit:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete permit' },
      { status: 500 }
    );
  }
}
