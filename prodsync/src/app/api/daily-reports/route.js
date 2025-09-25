// src/app/api/daily-reports/route.js
import { NextResponse } from "next/server";
import { getDbAdmin } from "../../lib/firebaseAdmin";

// GET - Fetch all daily reports
export async function GET(request) {
  try {
    console.log("Daily Reports API: GET request received");
    const dbAdmin = getDbAdmin();
    if (!dbAdmin) {
      console.log("Daily Reports API: Database not initialized");
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    let query = dbAdmin.collection("dailyReports");

    // Apply filters
    if (department && department !== 'all') {
      query = query.where('department', '==', department);
    }
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }
    if (date) {
      query = query.where('reportDate', '==', date);
    }

    // Order by submission time (newest first)
    query = query.orderBy('submissionTime', 'desc');

    const snapshot = await query.get();
    const reports = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`Daily Reports API: Successfully fetched ${reports.length} reports`);
    return NextResponse.json({
      success: true,
      data: reports,
      count: reports.length
    });
  } catch (error) {
    console.error('Daily Reports API: Error fetching daily reports:', error);
    return NextResponse.json({ 
      error: "Failed to fetch daily reports",
      details: error.message 
    }, { status: 500 });
  }
}

// POST - Create a new daily report
export async function POST(request) {
  try {
    const dbAdmin = getDbAdmin();
    if (!dbAdmin) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const body = await request.json();
    const {
      employeeId,
      employeeName,
      department,
      position,
      reportDate,
      hourlyNotes,
      tasks = [],
      achievements = [],
      challenges = [],
      tomorrowPlans = [],
      notes = '',
      attachments = []
    } = body;

    // Validate required fields
    if (!employeeId || !employeeName || !department || !position || !reportDate) {
      return NextResponse.json({ 
        error: "Missing required fields",
        required: ['employeeId', 'employeeName', 'department', 'position', 'reportDate']
      }, { status: 400 });
    }

    // Generate unique report ID
    const reportId = `DR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Convert hourly notes to consultations format for consistency
    const consultations = [];
    const workHours = Array.from({ length: 11 }, (_, i) => 8 + i);
    
    workHours.forEach((hour, index) => {
      const note = hourlyNotes[hour] || '';
      consultations.push({
        time: `${hour}:00`,
        place: note.includes('Office') ? note : (note ? 'Office' : ''),
        client: note.includes('Client') || note.includes('Meeting') ? note : (note ? 'Internal' : '')
      });
    });

    const reportData = {
      id: reportId,
      employeeId,
      employeeName,
      department,
      position,
      reportDate,
      submissionTime: new Date().toISOString(),
      status: 'submitted',
      consultations,
      tasks,
      achievements,
      challenges,
      tomorrowPlans,
      notes,
      attachments,
      approvedBy: null,
      approvedDate: null,
      feedback: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore
    await dbAdmin.collection("dailyReports").doc(reportId).set(reportData);

    return NextResponse.json({
      success: true,
      message: "Daily report submitted successfully",
      data: reportData
    });
  } catch (error) {
    console.error('Error creating daily report:', error);
    return NextResponse.json({ 
      error: "Failed to create daily report",
      details: error.message 
    }, { status: 500 });
  }
}
