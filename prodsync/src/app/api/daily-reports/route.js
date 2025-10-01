import { NextResponse } from 'next/server';
import { getDbAdmin } from '../../lib/firebaseAdmin';

export async function GET() {
  try {
    const dbAdmin = getDbAdmin();
    
    if (!dbAdmin) {
      throw new Error('Firebase Admin not initialized');
    }

    // Fetch daily reports from Firebase Firestore using Admin SDK
    const dailyReportsRef = dbAdmin.collection('dailyReports');
    const snapshot = await dailyReportsRef.orderBy('submissionTime', 'desc').get();
    
    const dailyReports = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      dailyReports.push({
        id: doc.id,
        ...data,
        // Convert Firestore timestamps to ISO strings for consistency
        submissionTime: data.submissionTime?.toDate?.()?.toISOString() || data.submissionTime,
        approvedDate: data.approvedDate?.toDate?.()?.toISOString() || data.approvedDate,
        reportDate: data.reportDate || new Date().toISOString().split('T')[0]
      });
    });

    return NextResponse.json({
      success: true,
      data: dailyReports,
      message: 'Daily reports fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching daily reports:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch daily reports',
      data: []
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const dbAdmin = getDbAdmin();
    
    if (!dbAdmin) {
      throw new Error('Firebase Admin not initialized');
    }
    
    // Save daily report to Firebase Firestore using Admin SDK
    const dailyReportsRef = dbAdmin.collection('dailyReports');
    const reportData = {
      ...body,
      submissionTime: new Date(),
      status: 'submitted',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const docRef = await dailyReportsRef.add(reportData);
    
    console.log('Daily report created with ID:', docRef.id);
    
    return NextResponse.json({
      success: true,
      message: 'Daily report created successfully',
      data: {
        id: docRef.id,
        ...body,
        submissionTime: new Date().toISOString(),
        status: 'submitted'
      }
    });
  } catch (error) {
    console.error('Error creating daily report:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to create daily report'
    }, { status: 500 });
  }
}