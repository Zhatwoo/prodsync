// src/lib/firebaseAdmin.js
// 🔹 BACKEND Firebase setup (pang-secure API routes, role-based access)
import admin from "firebase-admin";

// Check if Firebase Admin is properly configured
const isFirebaseAdminConfigured = () => {
  return process.env.FIREBASE_PROJECT_ID && 
         process.env.FIREBASE_CLIENT_EMAIL && 
         process.env.FIREBASE_PRIVATE_KEY;
};

let dbAdmin = null;
let authAdmin = null;

if (!admin.apps.length && isFirebaseAdminConfigured()) {
  try {
    // Properly format the private key
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
      ?.replace(/\\n/g, "\n")
      ?.replace(/"/g, ""); // Remove quotes if present

    if (!privateKey || !privateKey.includes("BEGIN PRIVATE KEY")) {
      throw new Error("Invalid private key format");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    
    dbAdmin = admin.firestore();
    authAdmin = admin.auth();
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    console.error("Error details:", {
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
      privateKeyStart: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50) || "N/A"
    });
  }
} else if (!isFirebaseAdminConfigured()) {
  console.warn("Firebase Admin configuration is missing. Please set up environment variables.");
}

export { dbAdmin, authAdmin, isFirebaseAdminConfigured };
