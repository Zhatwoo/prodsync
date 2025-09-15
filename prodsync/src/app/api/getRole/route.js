// src/app/api/getRole/route.js
import { NextResponse } from "next/server";
import { dbAdmin, isFirebaseAdminConfigured } from "@/lib/firebaseAdmin";

export async function GET(request) {
  try {
    // Check if Firebase Admin is configured
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json({ 
        error: "Firebase Admin configuration is missing. Please set up environment variables.",
        code: "FIREBASE_NOT_CONFIGURED"
      }, { status: 503 });
    }

    if (!dbAdmin) {
      return NextResponse.json({ 
        error: "Firebase Admin is not initialized. Please check your configuration.",
        code: "FIREBASE_NOT_INITIALIZED"
      }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    // Get user document from Firestore
    const userDoc = await dbAdmin.collection("users").doc(uid).get();
    
    if (!userDoc.exists) {
      return NextResponse.json({ 
        error: "User not found in database. Please contact administrator to set up your account.",
        code: "USER_NOT_FOUND"
      }, { status: 404 });
    }

    const userData = userDoc.data();
    const role = userData.role || 'staff'; // Default role if not specified

    return NextResponse.json({ 
      role: role,
      userData: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        company: userData.company
      }
    });

  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json({ 
      error: "Failed to fetch user role. Please try again or contact administrator.",
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}
