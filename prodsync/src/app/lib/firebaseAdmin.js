// src/lib/firebaseAdmin.js
// 🔹 BACKEND Firebase setup (pang-secure API routes, role-based access)
import admin from "firebase-admin";

// Check if Firebase Admin is properly configured
const isFirebaseAdminConfigured = () => {
  const hasProjectId = !!process.env.FIREBASE_PROJECT_ID;
  const hasClientEmail = !!process.env.FIREBASE_CLIENT_EMAIL;
  const hasPrivateKey = !!process.env.FIREBASE_PRIVATE_KEY;
  
  console.log("Firebase Admin config check:", {
    hasProjectId,
    hasClientEmail,
    hasPrivateKey
  });
  
  return hasProjectId && hasClientEmail && hasPrivateKey;
};

let dbAdmin = null;
let authAdmin = null;
let isInitialized = false;

const initializeFirebaseAdmin = () => {
  if (isInitialized) {
    console.log("Firebase Admin already initialized, returning existing instances");
    return { dbAdmin, authAdmin };
  }

  console.log("Initializing Firebase Admin...");
  console.log("Admin apps length:", admin.apps.length);
  console.log("Configuration check:", isFirebaseAdminConfigured());

  // Check if Firebase Admin is already initialized
  if (admin.apps.length > 0) {
    console.log("Firebase Admin already initialized, getting services...");
    dbAdmin = admin.firestore();
    authAdmin = admin.auth();
    isInitialized = true;
    console.log("✅ Firebase Admin services retrieved successfully");
    return { dbAdmin, authAdmin };
  }

  if (isFirebaseAdminConfigured()) {
    try {
      // Properly format the private key
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      
      console.log("Raw private key length:", privateKey?.length || 0);
      
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

      console.log("Attempting Firebase Admin initialization...");
      console.log("Private key format check:", {
        hasPrivateKey: !!privateKey,
        startsWithBegin: privateKey?.startsWith("-----BEGIN PRIVATE KEY-----"),
        endsWithEnd: privateKey?.endsWith("-----END PRIVATE KEY-----\n"),
        length: privateKey?.length,
        firstChars: privateKey?.substring(0, 30),
        lastChars: privateKey?.substring(privateKey.length - 30)
      });

      if (!privateKey || !privateKey.includes("BEGIN PRIVATE KEY")) {
        throw new Error("Invalid private key format - missing BEGIN PRIVATE KEY");
      }

      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      };

      console.log("Service account config:", {
        projectId: serviceAccount.projectId,
        clientEmail: serviceAccount.clientEmail,
        privateKeyLength: serviceAccount.privateKey?.length
      });

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      
      dbAdmin = admin.firestore();
      authAdmin = admin.auth();
      isInitialized = true;
      console.log("Firebase Admin initialized successfully");
      console.log("Services created:", { 
        hasDbAdmin: !!dbAdmin, 
        hasAuthAdmin: !!authAdmin,
        dbAdminType: typeof dbAdmin,
        authAdminType: typeof authAdmin
      });
    } catch (error) {
      console.error("❌ Firebase Admin initialization error:", error);
      console.error("❌ Error details:", {
        name: error.name,
        message: error.message,
        code: error.code,
        hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
        privateKeyStart: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50) || "N/A",
        privateKeyEnd: process.env.FIREBASE_PRIVATE_KEY?.substring(-50) || "N/A",
        errorMessage: error.message,
        errorStack: error.stack
      });
    }
  } else if (!isFirebaseAdminConfigured()) {
    console.warn("Firebase Admin configuration is missing. Please set up environment variables.");
  }

  return { dbAdmin, authAdmin };
};

// Initialize on module load with better error handling
try {
  initializeFirebaseAdmin();
} catch (error) {
  console.error("❌ Failed to initialize Firebase Admin on module load:", error);
}

// Export getter functions to ensure proper initialization
export const getDbAdmin = () => {
  if (!isInitialized) {
    initializeFirebaseAdmin();
  }
  return dbAdmin;
};

export const getAuthAdmin = () => {
  if (!isInitialized) {
    initializeFirebaseAdmin();
  }
  return authAdmin;
};

// Export the services directly for convenience
export { dbAdmin, authAdmin, isFirebaseAdminConfigured, initializeFirebaseAdmin };
