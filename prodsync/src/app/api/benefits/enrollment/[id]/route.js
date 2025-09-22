// src/app/api/benefits/enrollment/[id]/route.js
import { NextResponse } from "next/server";
import { dbAdmin } from "../../../../../lib/firebaseAdmin";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const doc = await dbAdmin.collection("benefitEnrollments").doc(id).get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    const enrollmentData = doc.data();
    
    // Get employee details
    const employeeDoc = await dbAdmin.collection("employees").doc(enrollmentData.employeeId).get();
    const employeeData = employeeDoc.exists ? employeeDoc.data() : null;
    
    // Get benefit details
    const benefitDoc = await dbAdmin.collection("benefits").doc(enrollmentData.benefitId).get();
    const benefitData = benefitDoc.exists ? benefitDoc.data() : null;

    return NextResponse.json({
      id: doc.id,
      ...enrollmentData,
      employee: employeeData ? { id: employeeDoc.id, ...employeeData } : null,
      benefit: benefitData ? { id: benefitDoc.id, ...benefitData } : null
    });
  } catch (error) {
    console.error("Error fetching enrollment:", error);
    return NextResponse.json({ error: "Failed to fetch enrollment" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Check if enrollment exists
    const enrollmentDoc = await dbAdmin.collection("benefitEnrollments").doc(id).get();
    if (!enrollmentDoc.exists) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    const enrollmentData = enrollmentDoc.data();

    const updateData = {
      status: body.status || enrollmentData.status,
      notes: body.notes !== undefined ? body.notes : enrollmentData.notes,
      effectiveDate: body.effectiveDate || enrollmentData.effectiveDate,
      updatedAt: new Date().toISOString()
    };

    await dbAdmin.collection("benefitEnrollments").doc(id).update(updateData);

    return NextResponse.json({ 
      message: "Enrollment updated successfully" 
    });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Check if enrollment exists
    const enrollmentDoc = await dbAdmin.collection("benefitEnrollments").doc(id).get();
    if (!enrollmentDoc.exists) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    const enrollmentData = enrollmentDoc.data();

    // Delete enrollment
    await dbAdmin.collection("benefitEnrollments").doc(id).delete();

    // Update benefit enrollment count
    const benefitDoc = await dbAdmin.collection("benefits").doc(enrollmentData.benefitId).get();
    if (benefitDoc.exists) {
      const benefitData = benefitDoc.data();
      await dbAdmin.collection("benefits").doc(enrollmentData.benefitId).update({
        enrolledEmployees: Math.max(0, benefitData.enrolledEmployees - 1),
        updatedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ 
      message: "Enrollment deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting enrollment:", error);
    return NextResponse.json({ error: "Failed to delete enrollment" }, { status: 500 });
  }
}
