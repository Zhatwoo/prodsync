import { NextResponse } from 'next/server';

// Mock data - in a real app, this would come from a database
let campaigns = [
  {
    id: '1',
    name: 'Q1 Product Launch',
    description: 'Outbound calls for new product launch',
    status: 'active',
    start_date: '2024-01-01',
    end_date: '2024-03-31',
    target_leads: 1000,
    contacted_leads: 450,
    converted_leads: 23,
    conversion_rate: 5.1,
    assigned_agents: ['John Smith', 'Sarah Johnson', 'Mike Wilson'],
    created_by: 'Admin',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Customer Retention',
    description: 'Follow-up calls for existing customers',
    status: 'active',
    start_date: '2024-01-15',
    end_date: '2024-02-15',
    target_leads: 500,
    contacted_leads: 320,
    converted_leads: 45,
    conversion_rate: 14.1,
    assigned_agents: ['Lisa Chen', 'David Lee'],
    created_by: 'Admin',
    created_at: '2024-01-15T00:00:00Z'
  },
  {
    id: '3',
    name: 'Lead Qualification',
    description: 'Qualifying inbound leads',
    status: 'paused',
    start_date: '2024-01-10',
    end_date: '2024-01-25',
    target_leads: 200,
    contacted_leads: 180,
    converted_leads: 12,
    conversion_rate: 6.7,
    assigned_agents: ['Jennifer Taylor'],
    created_by: 'Admin',
    created_at: '2024-01-10T00:00:00Z'
  }
];

// GET /api/telemarketing/campaigns - Get all campaigns
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    let filteredCampaigns = [...campaigns];

    // Apply status filter
    if (status && status !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(campaign => campaign.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

    return NextResponse.json({
      campaigns: paginatedCampaigns,
      pagination: {
        page,
        limit,
        total: filteredCampaigns.length,
        totalPages: Math.ceil(filteredCampaigns.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

// POST /api/telemarketing/campaigns - Create a new campaign
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'start_date', 'end_date', 'target_leads'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate new campaign ID
    const newId = (campaigns.length + 1).toString();

    const newCampaign = {
      id: newId,
      ...body,
      contacted_leads: 0,
      converted_leads: 0,
      conversion_rate: 0,
      assigned_agents: body.assigned_agents || [],
      created_by: 'Current User',
      created_at: new Date().toISOString()
    };

    campaigns.unshift(newCampaign); // Add to beginning of array

    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

// PUT /api/telemarketing/campaigns - Update campaign
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const campaignIndex = campaigns.findIndex(c => c.id === id);
    if (campaignIndex === -1) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Update campaign
    campaigns[campaignIndex] = {
      ...campaigns[campaignIndex],
      ...updateData,
      id // Ensure ID doesn't change
    };

    return NextResponse.json(campaigns[campaignIndex]);
  } catch (error) {
    console.error('Error updating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
}
