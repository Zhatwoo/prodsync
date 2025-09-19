import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '../../lib/firebaseAdmin';

export async function POST(request) {
  try {
    // Initialize Firebase Admin
    const { authAdmin } = initializeFirebaseAdmin();
    
    if (!authAdmin) {
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }

    // Get email from request body
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('🔍 Checking user auth account for email:', email);

    try {
      // Try to get user by email
      const userRecord = await authAdmin.getUserByEmail(email);
      
      return NextResponse.json({
        exists: true,
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        disabled: userRecord.disabled,
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime
      });
    } catch (error) {
      // If user doesn't exist, Firebase throws an error
      if (error.code === 'auth/user-not-found') {
        return NextResponse.json({
          exists: false,
          email: email
        });
      }
      
      // Re-throw other errors
      throw error;
    }

  } catch (error) {
    console.error('❌ Error in check-user-auth API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
