// src/app/api/test-firebase-init/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Import Firebase Admin dynamically
    const { dbAdmin, authAdmin, isFirebaseAdminConfigured } = await import("../../lib/firebaseAdmin");
    
    const diagnostics = {
      isConfigured: isFirebaseAdminConfigured(),
      hasDbAdmin: !!dbAdmin,
      hasAuthAdmin: !!authAdmin,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      message: "Firebase Admin initialization test",
      diagnostics
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to test Firebase Admin initialization",
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}

