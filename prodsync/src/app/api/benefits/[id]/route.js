// src/app/api/benefits/[id]/route.js
import { NextResponse } from "next/server";
import { dbAdmin } from "../../../../lib/firebaseAdmin";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    const doc = await dbAdmin.collection("benefits").doc(id).get();
    
    if (!doc.exists) {
      return NextResponse.json({ error: "Benefit not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: doc.id,
      ...doc.data()
    });
  } catch (error) {
    console.error("Error fetching benefit:", error);
    return NextResponse.json({ error: "Failed to fetch benefit" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'category', 'description', 'cost', 'provider', 'effectiveDate', 'expiryDate'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ 
          error: `Missing required field: ${field}` 
        }, { status: 400 });
      }
    }

    const benefitData = {
      ...body,
      cost: parseFloat(body.cost),
      updatedAt: new Date().toISOString()
    };

    await dbAdmin.collection("benefits").doc(id).update(benefitData);

    return NextResponse.json({ 
      message: "Benefit updated successfully" 
    });
  } catch (error) {
    console.error("Error updating benefit:", error);
    return NextResponse.json({ error: "Failed to update benefit" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Check if benefit exists
    const doc = await dbAdmin.collection("benefits").doc(id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Benefit not found" }, { status: 404 });
    }

    // Check if there are enrolled employees
    const benefitData = doc.data();
    if (benefitData.enrolledEmployees > 0) {
      return NextResponse.json({ 
        error: "Cannot delete benefit with enrolled employees. Please remove all enrollments first." 
      }, { status: 400 });
    }

    await dbAdmin.collection("benefits").doc(id).delete();

    return NextResponse.json({ 
      message: "Benefit deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting benefit:", error);
    return NextResponse.json({ error: "Failed to delete benefit" }, { status: 500 });
  }
}
