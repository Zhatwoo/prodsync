import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For now, return sample data
    // In a real application, this would fetch from a database
    const sampleData = [
      {
        id: 'DR-001',
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
      },
      {
        id: 'DR-002',
        employeeId: 'EMP-002',
        employeeName: 'Jane Smith',
        department: 'Marketing',
        position: 'Marketing Manager',
        reportDate: new Date().toISOString().split('T')[0],
        submissionTime: new Date().toISOString(),
        status: 'approved',
        consultations: [],
        tasks: [
          {
            task: 'Campaign analysis',
            timeSpent: '3 hours',
            status: 'completed'
          }
        ],
        achievements: [
          'Completed Q4 campaign analysis',
          'Prepared presentation for stakeholders'
        ],
        challenges: [
          'Data analysis complexity',
          'Tight deadline'
        ],
        tomorrowPlans: [
          'Present findings to team',
          'Plan next campaign'
        ],
        notes: 'Successful completion of campaign analysis',
        attachments: [],
        approvedBy: 'Manager',
        approvedDate: new Date().toISOString(),
        feedback: 'Excellent work on the analysis'
      }
    ];

    return NextResponse.json({
      success: true,
      data: sampleData,
      message: 'Daily reports fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching daily reports:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch daily reports',
      data: []
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // In a real application, this would save to a database
    console.log('Creating new daily report:', body);
    
    return NextResponse.json({
      success: true,
      message: 'Daily report created successfully',
      data: {
        id: `DR-${Date.now()}`,
        ...body,
        submissionTime: new Date().toISOString(),
        status: 'submitted'
      }
    });
  } catch (error) {
    console.error('Error creating daily report:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create daily report'
    }, { status: 500 });
  }
}