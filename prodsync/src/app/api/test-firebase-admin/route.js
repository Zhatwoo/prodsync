// src/app/api/test-firebase-admin/route.js
import { NextResponse } from "next/server";
import { getDbAdmin, getAuthAdmin, isFirebaseAdminConfigured } from "../../lib/firebaseAdmin";

export async function GET(request) {
  try {
    const diagnostics = {
      isConfigured: isFirebaseAdminConfigured(),
      hasDbAdmin: !!getDbAdmin(),
      hasAuthAdmin: !!getAuthAdmin(),
      environment: {
        hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
        privateKeyStart: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50) || "N/A",
        privateKeyEnd: process.env.FIREBASE_PRIVATE_KEY?.substring(-50) || "N/A"
      }
    };

    // Try to test Firestore connection if dbAdmin is available
    const dbAdmin = getDbAdmin();
    if (dbAdmin) {
      try {
        // Simple test query
        const testCollection = dbAdmin.collection('_test');
        const testDoc = await testCollection.doc('test').get();
        diagnostics.firestoreTest = {
          success: true,
          message: "Firestore connection successful"
        };
      } catch (error) {
        diagnostics.firestoreTest = {
          success: false,
          error: error.message,
          code: error.code
        };
      }
    } else {
      diagnostics.firestoreTest = {
        success: false,
        error: "dbAdmin not available"
      };
    }

    return NextResponse.json({
      message: "Firebase Admin SDK diagnostics",
      diagnostics
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to run Firebase Admin diagnostics",
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
