// src/app/api/debug-firebase/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const debug = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
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

    // Try to import and initialize Firebase Admin
    try {
      const admin = await import("firebase-admin");
      debug.firebaseAdmin = {
        imported: true,
        appsLength: admin.default.apps.length,
        apps: admin.default.apps.map(app => ({
          name: app.name,
          options: {
            projectId: app.options.projectId,
            credential: app.options.credential ? "present" : "missing"
          }
        }))
      };

      // Try to initialize if not already initialized
      if (admin.default.apps.length === 0) {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
        
        if (privateKey && privateKey.includes("BEGIN PRIVATE KEY")) {
          try {
            const app = admin.default.initializeApp({
              credential: admin.default.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
              }),
            });
            
            debug.firebaseAdmin.initialization = {
              success: true,
              appName: app.name,
              projectId: app.options.projectId
            };

            // Test Firestore
            const db = admin.default.firestore();
            debug.firebaseAdmin.firestore = {
              initialized: true,
              app: db.app.name
            };

            // Test Auth
            const auth = admin.default.auth();
            debug.firebaseAdmin.auth = {
              initialized: true,
              app: auth.app.name
            };

          } catch (initError) {
            debug.firebaseAdmin.initialization = {
              success: false,
              error: initError.message,
              stack: initError.stack
            };
          }
        } else {
          debug.firebaseAdmin.initialization = {
            success: false,
            error: "Invalid private key format"
          };
        }
      }
    } catch (importError) {
      debug.firebaseAdmin = {
        imported: false,
        error: importError.message,
        stack: importError.stack
      };
    }

    return NextResponse.json({
      message: "Firebase Admin debug information",
      debug
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to debug Firebase Admin",
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
