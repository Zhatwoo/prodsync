import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '../../lib/firebaseAdmin';

export async function GET() {
  try {
    console.log('🧪 Testing Firebase Admin initialization...');
    
    // Initialize Firebase Admin
    const { dbAdmin, authAdmin } = initializeFirebaseAdmin();
    
    if (!dbAdmin || !authAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Firebase Admin not initialized',
        details: {
          hasDbAdmin: !!dbAdmin,
          hasAuthAdmin: !!authAdmin
        }
      }, { status: 500 });
    }
    
    console.log('✅ Firebase Admin initialized successfully');
    
    // Test Firestore connection
    let firestoreTest = false;
    try {
      const testCollection = dbAdmin.collection('test');
      await testCollection.limit(1).get();
      firestoreTest = true;
      console.log('✅ Firestore connection test passed');
    } catch (firestoreError) {
      console.error('❌ Firestore connection test failed:', firestoreError);
    }
    
    // Test Auth connection
    let authTest = false;
    try {
      // Try to list users (this will fail if no users, but connection should work)
      await authAdmin.listUsers(1);
      authTest = true;
      console.log('✅ Auth connection test passed');
    } catch (authError) {
      // Auth error might be expected if no users exist
      if (authError.code === 'auth/user-not-found' || authError.message.includes('no users')) {
        authTest = true; // Connection works, just no users
        console.log('✅ Auth connection test passed (no users found)');
      } else {
        console.error('❌ Auth connection test failed:', authError);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Firebase Admin test completed',
      results: {
        firebaseAdminInitialized: true,
        firestoreConnection: firestoreTest,
        authConnection: authTest,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Error in Firebase Admin test:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        name: error.name,
        stack: error.stack
      }
    }, { status: 500 });
  }
}