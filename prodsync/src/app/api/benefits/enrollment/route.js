// src/app/api/benefits/enrollment/route.js
import { NextResponse } from "next/server";
import { getDbAdmin } from "../../../lib/firebaseAdmin";

export async function GET(request) {
  try {
    const dbAdmin = getDbAdmin();
    if (!dbAdmin) {
      return NextResponse.json({ error: "Database not initialized" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get('employeeId');
    const benefitId = searchParams.get('benefitId');
    
    let query = dbAdmin.collection("benefitEnrollments");
    
    if (employeeId) {
      query = query.where('employeeId', '==', employeeId);
    }
    
    if (benefitId) {
      query = query.where('benefitId', '==', benefitId);
    }
    
    query = query.orderBy('enrolledAt', 'desc');
    
    const snapshot = await query.get();
    const enrollments = [];
    
    for (const doc of snapshot.docs) {
      const enrollmentData = doc.data();
      
      // Get employee details
      const employeeDoc = await dbAdmin.collection("employees").doc(enrollmentData.employeeId).get();
      const employeeData = employeeDoc.exists ? employeeDoc.data() : null;
      
      // Get benefit details
      const benefitDoc = await dbAdmin.collection("benefits").doc(enrollmentData.benefitId).get();
      const benefitData = benefitDoc.exists ? benefitDoc.data() : null;
      
      enrollments.push({
        id: doc.id,
        ...enrollmentData,
        employee: employeeData ? { id: employeeDoc.id, ...employeeData } : null,
        benefit: benefitData ? { id: benefitDoc.id, ...benefitData } : null
      });
    }

    return NextResponse.json(enrollments);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
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
    const requiredFields = ['employeeId', 'benefitId'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 });
      }
    }

    // Check if employee exists
    const employeeDoc = await dbAdmin.collection("employees").doc(body.employeeId).get();
    if (!employeeDoc.exists) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }

    // Check if benefit exists and is active
    const benefitDoc = await dbAdmin.collection("benefits").doc(body.benefitId).get();
    if (!benefitDoc.exists) {
      return NextResponse.json({ error: "Benefit not found" }, { status: 404 });
    }
    
    const benefitData = benefitDoc.data();
    if (!benefitData.isActive) {
      return NextResponse.json({ error: "Cannot enroll in inactive benefit" }, { status: 400 });
    }

    // Check if enrollment already exists
    const existingEnrollment = await dbAdmin
      .collection("benefitEnrollments")
      .where('employeeId', '==', body.employeeId)
      .where('benefitId', '==', body.benefitId)
      .get();
    
    if (!existingEnrollment.empty) {
      return NextResponse.json({ error: "Employee is already enrolled in this benefit" }, { status: 400 });
    }

    const enrollmentData = {
      employeeId: body.employeeId,
      benefitId: body.benefitId,
      enrolledAt: new Date().toISOString(),
      status: body.status || 'active',
      notes: body.notes || '',
      effectiveDate: body.effectiveDate || new Date().toISOString()
    };

    // Add enrollment
    const enrollmentRef = await dbAdmin.collection("benefitEnrollments").add(enrollmentData);

    // Update benefit enrollment count
    await dbAdmin.collection("benefits").doc(body.benefitId).update({
      enrolledEmployees: benefitData.enrolledEmployees + 1,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      id: enrollmentRef.id, 
      message: "Enrollment created successfully" 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 });
  }
}
