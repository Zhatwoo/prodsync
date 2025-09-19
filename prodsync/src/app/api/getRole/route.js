// src/app/api/getRole/route.js
import { NextResponse } from "next/server";
import admin from "firebase-admin";

export async function GET(request) {
  try {
    // Check if Firebase Admin is configured
    const hasProjectId = !!process.env.FIREBASE_PROJECT_ID;
    const hasClientEmail = !!process.env.FIREBASE_CLIENT_EMAIL;
    const hasPrivateKey = !!process.env.FIREBASE_PRIVATE_KEY;
    
    if (!hasProjectId || !hasClientEmail || !hasPrivateKey) {
      console.error("Firebase Admin configuration check failed:", {
        hasProjectId,
        hasClientEmail,
        hasPrivateKey
      });
      return NextResponse.json({ 
        error: "Firebase Admin configuration is missing. Please set up environment variables.",
        code: "FIREBASE_NOT_CONFIGURED",
        details: {
          hasProjectId,
          hasClientEmail,
          hasPrivateKey
        }
      }, { status: 503 });
    }

    // Check if Firebase Admin is initialized
    if (admin.apps.length === 0) {
      console.error("Firebase Admin not initialized");
      return NextResponse.json({ 
        error: "Firebase Admin is not initialized. Please check your configuration.",
        code: "FIREBASE_NOT_INITIALIZED"
      }, { status: 503 });
    }

    const dbAdmin = admin.firestore();

    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: "UID is required" }, { status: 400 });
    }

    // Get user document from Firestore with retry mechanism
    console.log(`Looking for user with UID: ${uid}`);
    let userDoc = await dbAdmin.collection("users").doc(uid).get();
    console.log(`User document exists: ${userDoc.exists}`);
    
    // If user not found, wait a bit and try again (for newly created accounts)
    if (!userDoc.exists) {
      console.log(`User ${uid} not found, waiting 2 seconds and retrying...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      userDoc = await dbAdmin.collection("users").doc(uid).get();
      console.log(`User document exists after retry: ${userDoc.exists}`);
    }
    
    if (!userDoc.exists) {
      console.log(`User ${uid} not found in database after retry`);
      return NextResponse.json({ 
        error: "User not found in database. Please contact administrator to set up your account.",
        code: "USER_NOT_FOUND",
        uid: uid
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
