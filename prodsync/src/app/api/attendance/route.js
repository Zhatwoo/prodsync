// src/app/api/attendance/route.js
import { NextResponse } from "next/server";
import { getDbAdmin } from "../../lib/firebaseAdmin";

export async function GET(request) {
  try {
    const dbAdmin = getDbAdmin();
    if (!dbAdmin) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const employeeId = searchParams.get('employeeId');
    
    // Start with basic collection
    let query = dbAdmin.collection("attendance");
    
    // Add filters
    if (date) {
      query = query.where('date', '==', date);
    }
    
    if (employeeId) {
      query = query.where('employeeId', '==', employeeId);
    }
    
    const snapshot = await query.get();
    const attendance = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(attendance);
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({ 
      error: "Failed to fetch attendance",
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const dbAdmin = getDbAdmin();
    if (!dbAdmin) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['employeeId', 'date', 'checkIn'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 });
      }
    }

    // Check if employee already checked in today
    const existingAttendance = await dbAdmin
      .collection("attendance")
      .where('employeeId', '==', body.employeeId)
      .where('date', '==', body.date)
      .get();

    if (!existingAttendance.empty) {
      return NextResponse.json({ 
        error: "Employee has already checked in today" 
      }, { status: 400 });
    }

    const attendanceData = {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await dbAdmin.collection("attendance").add(attendanceData);

    return NextResponse.json({ 
      id: docRef.id, 
      message: "Attendance recorded successfully" 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating attendance record:", error);
    return NextResponse.json({ error: "Failed to create attendance record" }, { status: 500 });
  }
}
