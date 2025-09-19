// src/app/api/test-firebase-client/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: {
        hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Set" : "Missing"
      }
    };

    return NextResponse.json({
      message: "Firebase Client environment check",
      diagnostics
    });

  } catch (error) {
    console.error("Firebase Client test error:", error);
    return NextResponse.json({
      error: "Firebase Client test failed",
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
