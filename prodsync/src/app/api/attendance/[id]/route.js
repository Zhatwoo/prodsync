// src/app/api/attendance/[id]/route.js
import { NextResponse } from "next/server";
import { dbAdmin } from "../../../../lib/firebaseAdmin";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const doc = await dbAdmin.collection("attendance").doc(id).get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: "Attendance record not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error("Error fetching attendance record:", error);
    return NextResponse.json({ error: "Failed to fetch attendance record" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Check if attendance record exists
    const doc = await dbAdmin.collection("attendance").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Attendance record not found" }, { status: 404 });
    }

    const updateData = {
      ...body,
      updatedAt: new Date().toISOString()
    };

    await dbAdmin.collection("attendance").doc(id).update(updateData);

    return NextResponse.json({ 
      message: "Attendance record updated successfully" 
    });
  } catch (error) {
    console.error("Error updating attendance record:", error);
    return NextResponse.json({ error: "Failed to update attendance record" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Check if attendance record exists
    const doc = await dbAdmin.collection("attendance").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Attendance record not found" }, { status: 404 });
    }

    await dbAdmin.collection("attendance").doc(id).delete();

    return NextResponse.json({ 
      message: "Attendance record deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting attendance record:", error);
    return NextResponse.json({ error: "Failed to delete attendance record" }, { status: 500 });
  }
}
