// src/app/api/daily-reports/[id]/route.js
import { NextResponse } from "next/server";
import { getDbAdmin } from "../../../lib/firebaseAdmin";

// GET - Fetch a specific daily report by ID
export async function GET(request, { params }) {
  try {
    const dbAdmin = getDbAdmin();
    if (!dbAdmin) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
    }

    const doc = await dbAdmin.collection("dailyReports").doc(id).get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const reportData = {
      id: doc.id,
      ...doc.data(),
    };

    return NextResponse.json({
      success: true,
      data: reportData
    });
  } catch (error) {
    console.error('Error fetching daily report:', error);
    return NextResponse.json({ 
      error: "Failed to fetch daily report",
      details: error.message 
    }, { status: 500 });
  }
}

// PUT - Update a daily report (approve, reject, add feedback)
export async function PUT(request, { params }) {
  try {
    const dbAdmin = getDbAdmin();
    if (!dbAdmin) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { action, approvedBy, feedback } = body;

    // Validate action
    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ 
        error: "Invalid action. Must be 'approve' or 'reject'" 
      }, { status: 400 });
    }

    // Check if report exists
    const doc = await dbAdmin.collection("dailyReports").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const updateData = {
      status: action === 'approve' ? 'approved' : 'rejected',
      approvedBy: approvedBy || 'System Administrator',
      approvedDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add feedback if provided
    if (feedback) {
      updateData.feedback = feedback;
    }

    // Update the document
    await dbAdmin.collection("dailyReports").doc(id).update(updateData);

    // Get updated document
    const updatedDoc = await dbAdmin.collection("dailyReports").doc(id).get();
    const updatedData = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    };

    return NextResponse.json({
      success: true,
      message: `Report ${action}d successfully`,
      data: updatedData
    });
  } catch (error) {
    console.error('Error updating daily report:', error);
    return NextResponse.json({ 
      error: "Failed to update daily report",
      details: error.message 
    }, { status: 500 });
  }
}

// DELETE - Delete a daily report
export async function DELETE(request, { params }) {
  try {
    const dbAdmin = getDbAdmin();
    if (!dbAdmin) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Report ID is required" }, { status: 400 });
    }

    // Check if report exists
    const doc = await dbAdmin.collection("dailyReports").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Delete the document
    await dbAdmin.collection("dailyReports").doc(id).delete();

    return NextResponse.json({
      success: true,
      message: "Report deleted successfully"
    });
  } catch (error) {
    console.error('Error deleting daily report:', error);
    return NextResponse.json({ 
      error: "Failed to delete daily report",
      details: error.message 
    }, { status: 500 });
  }
}
