// src/app/api/test/route.js
import { NextResponse } from "next/server";
import { isFirebaseAdminConfigured } from "@/lib/firebaseAdmin";
import { isFirebaseConfigured } from "@/lib/firebaseClient";

export async function GET() {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      firebaseClient: {
        configured: isFirebaseConfigured(),
        hasApiKey: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        hasProjectId: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        hasAuthDomain: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
      },
      firebaseAdmin: {
        configured: isFirebaseAdminConfigured(),
        hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        hasEnvLocal: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY
      }
    };

    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to get status",
      details: error.message 
    }, { status: 500 });
  }
}
