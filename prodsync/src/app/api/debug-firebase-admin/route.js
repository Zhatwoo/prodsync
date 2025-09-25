import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

export async function GET() {
  try {
    console.log('🔍 Debug Firebase Admin...');
    
    // Check environment variables
    const envCheck = {
      FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0
    };
    
    console.log('Environment check:', envCheck);
    
    // Check if admin is already initialized
    const appsLength = admin.apps.length;
    console.log('Admin apps length:', appsLength);
    
    let initializationResult = null;
    let dbAdmin = null;
    let authAdmin = null;
    
    if (appsLength === 0) {
      try {
        console.log('Attempting to initialize Firebase Admin...');
        
        // Try with service account
        const serviceAccount = {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        };
        
        console.log('Service account config:', {
          projectId: serviceAccount.projectId,
          clientEmail: serviceAccount.clientEmail,
          privateKeyLength: serviceAccount.privateKey?.length || 0
        });
        
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount)
        });
        
        dbAdmin = admin.firestore();
        authAdmin = admin.auth();
        
        initializationResult = {
          success: true,
          method: 'service_account',
          appsLength: admin.apps.length
        };
        
        console.log('✅ Firebase Admin initialized successfully');
        
      } catch (error) {
        console.error('❌ Service account initialization failed:', error);
        
        // Try default initialization
        try {
          console.log('Trying default initialization...');
          admin.initializeApp();
          dbAdmin = admin.firestore();
          authAdmin = admin.auth();
          
          initializationResult = {
            success: true,
            method: 'default',
            appsLength: admin.apps.length
          };
          
          console.log('✅ Default initialization successful');
        } catch (defaultError) {
          console.error('❌ Default initialization also failed:', defaultError);
          initializationResult = {
            success: false,
            error: defaultError.message,
            method: 'both_failed'
          };
        }
      }
    } else {
      console.log('Firebase Admin already initialized');
      dbAdmin = admin.firestore();
      authAdmin = admin.auth();
      initializationResult = {
        success: true,
        method: 'already_initialized',
        appsLength: appsLength
      };
    }
    
    // Test connections
    let firestoreTest = false;
    let authTest = false;
    
    if (dbAdmin) {
      try {
        await dbAdmin.collection('test').limit(1).get();
        firestoreTest = true;
        console.log('✅ Firestore test successful');
      } catch (error) {
        console.error('❌ Firestore test failed:', error);
      }
    }
    
    if (authAdmin) {
      try {
        await authAdmin.listUsers(1);
        authTest = true;
        console.log('✅ Auth test successful');
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          authTest = true; // Connection works, just no users
          console.log('✅ Auth test successful (no users found)');
        } else {
          console.error('❌ Auth test failed:', error);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      environment: envCheck,
      initialization: initializationResult,
      connections: {
        firestore: firestoreTest,
        auth: authTest
      },
      services: {
        hasDbAdmin: !!dbAdmin,
        hasAuthAdmin: !!authAdmin
      }
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}