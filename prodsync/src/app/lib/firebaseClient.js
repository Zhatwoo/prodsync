// src/lib/firebaseClient.js
// 🔹 FRONTEND Firebase setup (client-side authentication and Firestore)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase configuration
const isFirebaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  );
};

// Initialize Firebase services
let app = null;
let auth = null;
let db = null;
let analytics = null;

// Only initialize if configuration is available
if (isFirebaseConfigured()) {
  try {
    // Initialize Firebase app
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Initialize Analytics (browser only)
    if (typeof window !== "undefined") {
      analytics = getAnalytics(app);
    }
    
    console.log("✅ Firebase initialized successfully");
    console.log("📊 Firebase config:", {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      hasApiKey: !!firebaseConfig.apiKey,
      hasAnalytics: !!analytics
    });
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
    console.error("🔧 Please check your Firebase configuration in .env.local");
    
    // Reset to null on error
    app = null;
    auth = null;
    db = null;
    analytics = null;
  }
} else {
  console.warn("⚠️ Firebase configuration is incomplete. Please check your .env.local file.");
  console.warn("📋 Required environment variables:");
  console.warn("   - NEXT_PUBLIC_FIREBASE_API_KEY");
  console.warn("   - NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  console.warn("   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
}

// Export services for use in client components
export { auth, db, app, analytics, isFirebaseConfigured };
