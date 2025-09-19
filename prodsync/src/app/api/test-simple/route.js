// src/app/api/test-simple/route.js
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    return NextResponse.json({ 
      message: "Simple API test successful",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      error: "Simple API test failed",
      message: error.message
    }, { status: 500 });
  }
}

