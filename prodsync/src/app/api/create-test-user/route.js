// src/app/api/create-test-user/route.js
import { NextResponse } from "next/server";
import { getDbAdmin, isFirebaseAdminConfigured } from "../../lib/firebaseAdmin";

export async function POST(request) {
  try {
    // Check if Firebase Admin is configured
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json({ 
        error: "Firebase Admin configuration is missing.",
        code: "FIREBASE_NOT_CONFIGURED"
      }, { status: 503 });
    }

    const dbAdmin = getDbAdmin();
    if (!dbAdmin) {
      return NextResponse.json({ 
        error: "Firebase Admin is not initialized.",
        code: "FIREBASE_NOT_INITIALIZED"
      }, { status: 503 });
    }

    const { uid, email, role = 'staff' } = await request.json();

    if (!uid || !email) {
      return NextResponse.json({ 
        error: "UID and email are required" 
      }, { status: 400 });
    }

    // Create test user document
    const userData = {
      uid: uid,
      email: email,
      role: role,
      firstName: 'Test',
      lastName: 'User',
      company: 'ProdSync',
      createdAt: new Date().toISOString(),
      isTestUser: true
    };

    await dbAdmin.collection("users").doc(uid).set(userData);

    return NextResponse.json({ 
      message: "Test user created successfully",
      user: userData
    });

  } catch (error) {
    console.error("Error creating test user:", error);
    return NextResponse.json({ 
      error: "Failed to create test user",
      message: error.message
    }, { status: 500 });
  }
}
