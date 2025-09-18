// src/app/api/test-env/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const envCheck = {
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
      privateKeyStart: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50) || "N/A",
      privateKeyEnd: process.env.FIREBASE_PRIVATE_KEY?.substring(-50) || "N/A"
    };

    return NextResponse.json({
      message: "Environment variables check",
      environment: envCheck,
      nodeEnv: process.env.NODE_ENV
    });
  } catch (error) {
    return NextResponse.json({
      error: "Failed to check environment variables",
      message: error.message
    }, { status: 500 });
  }
}
