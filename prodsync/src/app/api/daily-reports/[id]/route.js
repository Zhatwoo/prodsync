import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // In a real application, this would fetch from a database
    // For now, return a sample report
    const sampleReport = {
      id: id,
      employeeId: 'EMP-001',
      employeeName: 'John Doe',
      department: 'IT',
      position: 'Developer',
      reportDate: new Date().toISOString().split('T')[0],
      submissionTime: new Date().toISOString(),
      status: 'submitted',
      consultations: [],
      tasks: [
        {
          task: 'Fix login bug',
          timeSpent: '2 hours',
          status: 'completed'
        }
      ],
      achievements: [
        'Fixed critical login issue',
        'Completed code review'
      ],
      challenges: [
        'Complex debugging required',
        'Time constraints'
      ],
      tomorrowPlans: [
        'Implement new feature',
        'Code review session'
      ],
      notes: 'Productive day with good progress on bug fixes',
      attachments: [],
      approvedBy: null,
      approvedDate: null,
      feedback: null
    };

    return NextResponse.json({
      success: true,
      data: sampleReport,
      message: 'Daily report fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching daily report:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch daily report'
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // In a real application, this would update the database
    console.log(`Updating daily report ${id}:`, body);
    
    // Simulate approval/rejection
    const updatedReport = {
      id: id,
      employeeId: 'EMP-001',
      employeeName: 'John Doe',
      department: 'IT',
      position: 'Developer',
      reportDate: new Date().toISOString().split('T')[0],
      submissionTime: new Date().toISOString(),
      status: body.action === 'approve' ? 'approved' : 'rejected',
      consultations: [],
      tasks: [
        {
          task: 'Fix login bug',
          timeSpent: '2 hours',
          status: 'completed'
        }
      ],
      achievements: [
        'Fixed critical login issue',
        'Completed code review'
      ],
      challenges: [
        'Complex debugging required',
        'Time constraints'
      ],
      tomorrowPlans: [
        'Implement new feature',
        'Code review session'
      ],
      notes: 'Productive day with good progress on bug fixes',
      attachments: [],
      approvedBy: body.approvedBy || 'Current Administrator',
      approvedDate: new Date().toISOString(),
      feedback: body.action === 'approve' ? 'Report approved' : 'Report rejected'
    };

    return NextResponse.json({
      success: true,
      data: updatedReport,
      message: `Daily report ${body.action}d successfully`
    });
  } catch (error) {
    console.error('Error updating daily report:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update daily report'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // In a real application, this would delete from the database
    console.log(`Deleting daily report ${id}`);
    
    return NextResponse.json({
      success: true,
      message: 'Daily report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting daily report:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete daily report'
    }, { status: 500 });
  }
}