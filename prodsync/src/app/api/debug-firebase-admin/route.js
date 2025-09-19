// src/app/api/debug-firebase-admin/route.js
import { NextResponse } from "next/server";
import admin from "firebase-admin";

export async function GET() {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
        privateKeyStart: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50) || "N/A",
        privateKeyEnd: process.env.FIREBASE_PRIVATE_KEY?.substring(-50) || "N/A"
      },
      admin: {
        appsLength: admin.apps.length,
        hasDefaultApp: !!admin.apps.find(app => app.name === '[DEFAULT]')
      }
    };

    // Try to initialize Firebase Admin if not already initialized
    if (admin.apps.length === 0) {
      try {
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;
        
        if (privateKey) {
          // Remove surrounding quotes if present
          privateKey = privateKey.replace(/^"|"$/g, '');
          // Replace escaped newlines with actual newlines
          privateKey = privateKey.replace(/\\n/g, '\n');
          // Ensure proper formatting
          if (!privateKey.endsWith('\n')) {
            privateKey += '\n';
          }
        }

        const serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        };

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });

        const dbAdmin = admin.firestore();
        const authAdmin = admin.auth();

        diagnostics.initialization = {
          success: true,
          hasDbAdmin: !!dbAdmin,
          hasAuthAdmin: !!authAdmin,
          appsLength: admin.apps.length
        };

        // Test Firestore connection
        try {
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

      } catch (error) {
        diagnostics.initialization = {
          success: false,
          error: error.message,
          stack: error.stack
        };
      }
    } else {
      diagnostics.initialization = {
        success: true,
        message: "Already initialized",
        appsLength: admin.apps.length
      };
    }

    return NextResponse.json({
      message: "Firebase Admin debug information",
      diagnostics
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to debug Firebase Admin",
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
