import { NextResponse } from 'next/server';

// Mock data storage (in a real app, this would be a database)
let timeEntries = [];
let currentShifts = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, timestamp, timezone } = body;

    // Validate required fields
    if (!userId || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: userId and timestamp' },
        { status: 400 }
      );
    }

    // Check if user is already clocked in
    if (currentShifts.has(userId)) {
      return NextResponse.json(
        { error: 'User is already clocked in' },
        { status: 400 }
      );
    }

    // Create new shift
    const shiftId = `shift-${Date.now()}-${userId}`;
    const clockInTime = new Date(timestamp);
    
    const newShift = {
      id: shiftId,
      userId,
      clockIn: clockInTime,
      breakStart: null,
      breakEnd: null,
      clockOut: null,
      timezone,
      createdAt: new Date(),
      status: 'active'
    };

    // Store the shift
    currentShifts.set(userId, newShift);

    // Log the clock-in event
    console.log(`User ${userId} clocked in at ${clockInTime.toISOString()}`);

    return NextResponse.json({
      success: true,
      message: 'Successfully clocked in',
      shift: newShift,
      timestamp: clockInTime.toISOString()
    });

  } catch (error) {
    console.error('Clock-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check current status
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const currentShift = currentShifts.get(userId);
    
    return NextResponse.json({
      isClockedIn: !!currentShift,
      currentShift: currentShift || null
    });

  } catch (error) {
    console.error('Get status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
