// src/app/api/test-login-flow/route.js
import { NextResponse } from "next/server";
import admin from "firebase-admin";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ 
        error: "Email and password are required" 
      }, { status: 400 });
    }

    // Check if Firebase Admin is initialized
    if (admin.apps.length === 0) {
      return NextResponse.json({ 
        error: "Firebase Admin is not initialized",
        code: "FIREBASE_NOT_INITIALIZED"
      }, { status: 503 });
    }

    const authAdmin = admin.auth();
    const dbAdmin = admin.firestore();

    // Step 1: Try to sign in with Firebase Auth (simulate client-side auth)
    let userRecord;
    try {
      // This simulates what happens on the client side
      userRecord = await authAdmin.getUserByEmail(email);
      console.log("✅ User found in Firebase Auth:", userRecord.uid);
    } catch (authError) {
      console.error("❌ User not found in Firebase Auth:", authError.message);
      return NextResponse.json({ 
        error: "User not found in Firebase Auth",
        code: "USER_NOT_FOUND_IN_AUTH",
        details: authError.message
      }, { status: 404 });
    }

    // Step 2: Check if user exists in Firestore
    let userDoc = await dbAdmin.collection("users").doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      console.log("⚠️ User not found in Firestore, attempting auto-creation...");
      
      // Auto-create user document
      const defaultUserData = {
        email: userRecord.email,
        firstName: userRecord.displayName?.split(' ')[0] || 'User',
        lastName: userRecord.displayName?.split(' ').slice(1).join(' ') || 'Account',
        role: 'staff',
        company: 'ProdSync Inc.',
        createdAt: new Date(),
        isAutoCreated: true
      };
      
      await dbAdmin.collection("users").doc(userRecord.uid).set(defaultUserData);
      console.log("✅ Auto-created user document");
      
      return NextResponse.json({
        success: true,
        message: "User account auto-created successfully",
        userData: defaultUserData,
        role: defaultUserData.role
      });
    }

    // Step 3: Return existing user data
    const userData = userDoc.data();
    return NextResponse.json({
      success: true,
      message: "User found in database",
      userData: userData,
      role: userData.role || 'staff'
    });

  } catch (error) {
    console.error("Login flow test error:", error);
    return NextResponse.json({
      error: "Login flow test failed",
      message: error.message,
      code: "INTERNAL_ERROR"
    }, { status: 500 });
  }
}

