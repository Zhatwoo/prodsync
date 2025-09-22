// src/app/api/benefits/route.js
import { NextResponse } from "next/server";
import { dbAdmin } from "../../lib/firebaseAdmin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const active = searchParams.get('active');
    
    let query = dbAdmin.collection("benefits");
    
    if (category && category !== 'all') {
      query = query.where('category', '==', category);
    }
    
    if (active !== null) {
      query = query.where('isActive', '==', active === 'true');
    }
    
    query = query.orderBy('createdAt', 'desc');
    
    const snapshot = await query.get();
    const benefits = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(benefits);
  } catch (error) {
    console.error("Error fetching benefits:", error);
    return NextResponse.json({ error: "Failed to fetch benefits" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
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
      enrolledEmployees: body.enrolledEmployees || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await dbAdmin.collection("benefits").add(benefitData);

    return NextResponse.json({ 
      id: docRef.id, 
      message: "Benefit created successfully" 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating benefit:", error);
    return NextResponse.json({ error: "Failed to create benefit" }, { status: 500 });
  }
}
