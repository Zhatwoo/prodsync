// src/lib/firebaseClient.js
// 🔹 FRONTEND Firebase setup (pang-auth, pang-direct firestore sa client)
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Check if Firebase config is available
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:demo",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-DEMO123",
};

// Validate Firebase configuration
const isFirebaseConfigured = () => {
  return process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
         process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
};

// Initialize Firebase (frontend)
let app;
let auth;
let db;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Analytics (browser only)
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
  }
  
  console.log("Firebase initialized successfully");
  console.log("Firebase config:", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasApiKey: !!firebaseConfig.apiKey
  });
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Create mock objects for development
  auth = null;
  db = null;
  analytics = null;
}

// Export services for use in client
export { auth, db, app, analytics, isFirebaseConfigured };
