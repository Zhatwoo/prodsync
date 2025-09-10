import { NextResponse } from 'next/server';

// Mock data storage (in a real app, this would be a database)
let timeEntries = [];
let currentShifts = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { shiftId, timestamp, timezone } = body;

    // Validate required fields
    if (!shiftId || !timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields: shiftId and timestamp' },
        { status: 400 }
      );
    }

    // Find the current shift
    let currentShift = null;
    let userId = null;
    
    for (const [uid, shift] of currentShifts.entries()) {
      if (shift.id === shiftId) {
        currentShift = shift;
        userId = uid;
        break;
      }
    }

    if (!currentShift) {
      return NextResponse.json(
        { error: 'Shift not found or already completed' },
        { status: 404 }
      );
    }

    // Calculate total hours worked
    const clockOutTime = new Date(timestamp);
    const clockInTime = new Date(currentShift.clockIn);
    const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);

    // Create completed time entry
    const completedEntry = {
      ...currentShift,
      clockOut: clockOutTime,
      totalHours: Math.round(totalHours * 100) / 100, // Round to 2 decimal places
      status: 'completed',
      completedAt: new Date()
    };

    // Remove from current shifts and add to completed entries
    currentShifts.delete(userId);
    timeEntries.push(completedEntry);

    // Log the clock-out event
    console.log(`User ${userId} clocked out at ${clockOutTime.toISOString()}, worked ${totalHours.toFixed(2)} hours`);

    return NextResponse.json({
      success: true,
      message: 'Successfully clocked out',
      shift: completedEntry,
      totalHours: totalHours.toFixed(2),
      timestamp: clockOutTime.toISOString()
    });

  } catch (error) {
    console.error('Clock-out error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint to get time entries for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    // Filter entries by user and date range
    let filteredEntries = timeEntries.filter(entry => entry.userId === userId);

    if (startDate) {
      const start = new Date(startDate);
      filteredEntries = filteredEntries.filter(entry => 
        new Date(entry.clockIn) >= start
      );
    }

    if (endDate) {
      const end = new Date(endDate);
      filteredEntries = filteredEntries.filter(entry => 
        new Date(entry.clockIn) <= end
      );
    }

    // Sort by clock-in time (most recent first)
    filteredEntries.sort((a, b) => new Date(b.clockIn) - new Date(a.clockIn));

    return NextResponse.json({
      entries: filteredEntries,
      totalEntries: filteredEntries.length,
      totalHours: filteredEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0)
    });

  } catch (error) {
    console.error('Get entries error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
