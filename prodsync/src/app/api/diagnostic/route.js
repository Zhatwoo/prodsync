// src/app/api/diagnostic/route.js
import { NextResponse } from "next/server";
import admin from "firebase-admin";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      firebaseAdmin: {
        isInitialized: admin.apps.length > 0,
        appsCount: admin.apps.length
      },
      environment: {
        hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        projectId: process.env.FIREBASE_PROJECT_ID
      },
      clientEnvironment: {
        hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
      }
    };

    // If email is provided, check user status
    if (email) {
      try {
        const authAdmin = admin.auth();
        const dbAdmin = admin.firestore();
        
        // Check Firebase Auth
        let userRecord;
        try {
          userRecord = await authAdmin.getUserByEmail(email);
          diagnostics.user = {
            existsInAuth: true,
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
            emailVerified: userRecord.emailVerified
          };
        } catch (authError) {
          diagnostics.user = {
            existsInAuth: false,
            authError: authError.message
          };
        }

        // Check Firestore if user exists in Auth
        if (userRecord) {
          try {
            const userDoc = await dbAdmin.collection("users").doc(userRecord.uid).get();
            diagnostics.user.existsInFirestore = userDoc.exists;
            if (userDoc.exists) {
              diagnostics.user.firestoreData = userDoc.data();
            }
          } catch (firestoreError) {
            diagnostics.user.firestoreError = firestoreError.message;
          }
        }
      } catch (error) {
        diagnostics.user = {
          error: error.message
        };
      }
    }

    return NextResponse.json({
      message: "System diagnostic information",
      diagnostics
    });

  } catch (error) {
    console.error("Diagnostic error:", error);
    return NextResponse.json({
      error: "Diagnostic failed",
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

