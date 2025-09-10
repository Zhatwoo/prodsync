import { NextResponse } from 'next/server';

// Mock data - in a real app, this would come from a database
let callLogs = [
  {
    id: '1',
    lead_id: '2',
    agent: 'John Smith',
    call_date: '2024-01-15T14:30:00Z',
    duration: 420, // 7 minutes
    disposition: 'interested',
    notes: 'Customer requested pricing information and product demo',
    outcome: 'follow_up_scheduled',
    next_action: 'Send pricing sheet and schedule demo',
    next_call_date: '2024-01-17T09:00:00Z',
    created_at: '2024-01-15T14:37:00Z'
  },
  {
    id: '2',
    lead_id: '3',
    agent: 'Sarah Johnson',
    call_date: '2024-01-15T16:00:00Z',
    duration: 900, // 15 minutes
    disposition: 'very_interested',
    notes: 'Very engaged conversation, wants to see full demo',
    outcome: 'demo_scheduled',
    next_action: 'Schedule technical demo for next week',
    next_call_date: '2024-01-18T11:00:00Z',
    created_at: '2024-01-15T16:15:00Z'
  },
  {
    id: '3',
    lead_id: '5',
    agent: 'Mike Wilson',
    call_date: '2024-01-15T11:00:00Z',
    duration: 180, // 3 minutes
    disposition: 'not_interested',
    notes: 'Budget constraints, not looking for new solutions',
    outcome: 'not_qualified',
    next_action: 'Remove from active campaign',
    next_call_date: null,
    created_at: '2024-01-15T11:03:00Z'
  }
];

// GET /api/telemarketing/call-logs - Get all call logs with optional filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agent = searchParams.get('agent');
    const disposition = searchParams.get('disposition');
    const outcome = searchParams.get('outcome');
    const campaign_id = searchParams.get('campaign_id');
    const start_date = searchParams.get('start_date');
    const end_date = searchParams.get('end_date');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    let filteredLogs = [...callLogs];

    // Apply filters
    if (agent && agent !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.agent === agent);
    }

    if (disposition && disposition !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.disposition === disposition);
    }

    if (outcome && outcome !== 'all') {
      filteredLogs = filteredLogs.filter(log => log.outcome === outcome);
    }

    if (start_date) {
      const start = new Date(start_date);
      filteredLogs = filteredLogs.filter(log => new Date(log.call_date) >= start);
    }

    if (end_date) {
      const end = new Date(end_date);
      filteredLogs = filteredLogs.filter(log => new Date(log.call_date) <= end);
    }

    // Sort by call date (newest first)
    filteredLogs.sort((a, b) => new Date(b.call_date) - new Date(a.call_date));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return NextResponse.json({
      callLogs: paginatedLogs,
      pagination: {
        page,
        limit,
        total: filteredLogs.length,
        totalPages: Math.ceil(filteredLogs.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching call logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch call logs' },
      { status: 500 }
    );
  }
}

// POST /api/telemarketing/call-logs - Create a new call log
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['lead_id', 'agent', 'call_date', 'duration', 'disposition', 'outcome', 'notes'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate new call log ID
    const newId = (callLogs.length + 1).toString();

    const newCallLog = {
      id: newId,
      ...body,
      created_at: new Date().toISOString()
    };

    callLogs.unshift(newCallLog); // Add to beginning of array

    return NextResponse.json(newCallLog, { status: 201 });
  } catch (error) {
    console.error('Error creating call log:', error);
    return NextResponse.json(
      { error: 'Failed to create call log' },
      { status: 500 }
    );
  }
}

// PUT /api/telemarketing/call-logs - Update call log
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Call log ID is required' },
        { status: 400 }
      );
    }

    const logIndex = callLogs.findIndex(log => log.id === id);
    if (logIndex === -1) {
      return NextResponse.json(
        { error: 'Call log not found' },
        { status: 404 }
      );
    }

    // Update call log
    callLogs[logIndex] = {
      ...callLogs[logIndex],
      ...updateData,
      id // Ensure ID doesn't change
    };

    return NextResponse.json(callLogs[logIndex]);
  } catch (error) {
    console.error('Error updating call log:', error);
    return NextResponse.json(
      { error: 'Failed to update call log' },
      { status: 500 }
    );
  }
}

// DELETE /api/telemarketing/call-logs - Delete call log
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Call log ID is required' },
        { status: 400 }
      );
    }

    const logIndex = callLogs.findIndex(log => log.id === id);
    if (logIndex === -1) {
      return NextResponse.json(
        { error: 'Call log not found' },
        { status: 404 }
      );
    }

    const deletedLog = callLogs[logIndex];
    callLogs.splice(logIndex, 1);

    return NextResponse.json(deletedLog);
  } catch (error) {
    console.error('Error deleting call log:', error);
    return NextResponse.json(
      { error: 'Failed to delete call log' },
      { status: 500 }
    );
  }
}
