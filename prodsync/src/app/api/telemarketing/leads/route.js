import { NextResponse } from 'next/server';

// Mock data - in a real app, this would come from a database
let leads = [
  {
    id: '1',
    name: 'John Smith',
    company: 'TechCorp Inc.',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    title: 'CTO',
    industry: 'Technology',
    source: 'Website',
    status: 'new',
    priority: 'high',
    campaign_id: '1',
    last_contact: null,
    next_call: '2024-01-16T10:00:00Z',
    call_count: 0,
    notes: 'Interested in enterprise solutions',
    assigned_agent: null,
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    company: 'Design Studio',
    email: 'sarah@designstudio.com',
    phone: '+1 (555) 234-5678',
    title: 'Marketing Director',
    industry: 'Design',
    source: 'Referral',
    status: 'contacted',
    priority: 'medium',
    campaign_id: '1',
    last_contact: '2024-01-15T14:30:00Z',
    next_call: '2024-01-17T09:00:00Z',
    call_count: 1,
    notes: 'Requested pricing information',
    assigned_agent: 'John Smith',
    created_at: '2024-01-14T10:00:00Z'
  },
  {
    id: '3',
    name: 'Michael Brown',
    company: 'Consulting Group',
    email: 'michael@consulting.com',
    phone: '+1 (555) 345-6789',
    title: 'Partner',
    industry: 'Consulting',
    source: 'Trade Show',
    status: 'qualified',
    priority: 'high',
    campaign_id: '2',
    last_contact: '2024-01-15T16:00:00Z',
    next_call: '2024-01-18T11:00:00Z',
    call_count: 2,
    notes: 'Very interested, wants demo',
    assigned_agent: 'Sarah Johnson',
    created_at: '2024-01-13T12:00:00Z'
  }
];

// GET /api/telemarketing/leads - Get all leads with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const campaign_id = searchParams.get('campaign_id');
    const agent = searchParams.get('agent');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    let filteredLeads = [...leads];

    // Apply filters
    if (status && status !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.status === status);
    }

    if (priority && priority !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.priority === priority);
    }

    if (campaign_id && campaign_id !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.campaign_id === campaign_id);
    }

    if (agent && agent !== 'all') {
      filteredLeads = filteredLeads.filter(lead => lead.assigned_agent === agent);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredLeads = filteredLeads.filter(lead =>
        lead.name.toLowerCase().includes(searchLower) ||
        lead.company.toLowerCase().includes(searchLower) ||
        lead.email.toLowerCase().includes(searchLower) ||
        lead.phone.includes(search)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

    return NextResponse.json({
      leads: paginatedLeads,
      pagination: {
        page,
        limit,
        total: filteredLeads.length,
        totalPages: Math.ceil(filteredLeads.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// POST /api/telemarketing/leads - Create a new lead
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'company', 'email', 'phone'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate new lead ID
    const newId = (leads.length + 1).toString();

    const newLead = {
      id: newId,
      ...body,
      status: body.status || 'new',
      call_count: 0,
      last_contact: null,
      assigned_agent: body.assigned_agent || null,
      next_call: body.next_call || null,
      created_at: new Date().toISOString()
    };

    leads.unshift(newLead); // Add to beginning of array

    return NextResponse.json(newLead, { status: 201 });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

// PUT /api/telemarketing/leads - Update lead
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    const leadIndex = leads.findIndex(l => l.id === id);
    if (leadIndex === -1) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Update lead
    leads[leadIndex] = {
      ...leads[leadIndex],
      ...updateData,
      id // Ensure ID doesn't change
    };

    return NextResponse.json(leads[leadIndex]);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

// DELETE /api/telemarketing/leads - Delete lead
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    const leadIndex = leads.findIndex(l => l.id === id);
    if (leadIndex === -1) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    const deletedLead = leads[leadIndex];
    leads.splice(leadIndex, 1);

    return NextResponse.json(deletedLead);
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
