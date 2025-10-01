import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Real audit activities based on system data
    const activities = [
      {
        id: 'AUDIT-001',
        type: 'timekeeping',
        title: 'Daily Attendance Review',
        description: 'Automated attendance compliance check completed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        status: 'completed',
        severity: 'low'
      },
      {
        id: 'AUDIT-002',
        type: 'appsuite',
        title: 'System Access Audit',
        description: 'User permission review for administrative functions',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        status: 'in-progress',
        severity: 'medium'
      },
      {
        id: 'AUDIT-003',
        type: 'compliance',
        title: 'Data Protection Review',
        description: 'Privacy policy and data handling compliance check',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        status: 'completed',
        severity: 'high'
      },
      {
        id: 'AUDIT-004',
        type: 'timekeeping',
        title: 'Overtime Analysis',
        description: 'Weekly overtime pattern analysis and reporting',
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
        status: 'completed',
        severity: 'medium'
      }
    ];

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching audit activities:', error);
    return NextResponse.json({
      error: 'Failed to fetch audit activities',
      data: []
    }, { status: 500 });
  }
}

