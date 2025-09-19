import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Checking Firebase Admin configuration...');
    
    // Check environment variables
    const config = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY
    };
    
    const hasProjectId = !!config.FIREBASE_PROJECT_ID;
    const hasClientEmail = !!config.FIREBASE_CLIENT_EMAIL;
    const hasPrivateKey = !!config.FIREBASE_PRIVATE_KEY;
    
    // Check private key format
    let privateKeyValid = false;
    if (config.FIREBASE_PRIVATE_KEY) {
      const privateKey = config.FIREBASE_PRIVATE_KEY.replace(/^"|"$/g, '').replace(/\\n/g, '\n');
      privateKeyValid = privateKey.includes('BEGIN PRIVATE KEY') && privateKey.includes('END PRIVATE KEY');
    }
    
    const isConfigured = hasProjectId && hasClientEmail && hasPrivateKey && privateKeyValid;
    
    console.log('Firebase Admin config check:', {
      hasProjectId,
      hasClientEmail,
      hasPrivateKey,
      privateKeyValid,
      isConfigured
    });
    
    return NextResponse.json({
      success: true,
      configured: isConfigured,
      config: {
        hasProjectId,
        hasClientEmail,
        hasPrivateKey,
        privateKeyValid,
        projectId: hasProjectId ? config.FIREBASE_PROJECT_ID : null,
        clientEmail: hasClientEmail ? config.FIREBASE_CLIENT_EMAIL : null,
        privateKeyLength: hasPrivateKey ? config.FIREBASE_PRIVATE_KEY.length : 0
      },
      message: isConfigured 
        ? 'Firebase Admin is properly configured' 
        : 'Firebase Admin configuration is missing or invalid'
    });
    
  } catch (error) {
    console.error('❌ Error checking Firebase config:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
