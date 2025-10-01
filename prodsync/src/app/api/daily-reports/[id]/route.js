import { NextResponse } from 'next/server';
import { getDbAdmin } from '../../../lib/firebaseAdmin';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const dbAdmin = getDbAdmin();
    
    if (!dbAdmin) {
      throw new Error('Firebase Admin not initialized');
    }
    
    // Fetch daily report from Firebase Firestore using Admin SDK
    const reportRef = dbAdmin.collection('dailyReports').doc(id);
    const reportSnap = await reportRef.get();
    
    if (!reportSnap.exists) {
      return NextResponse.json({
        success: false,
        error: 'Daily report not found'
      }, { status: 404 });
    }
    
    const data = reportSnap.data();
    const report = {
      id: reportSnap.id,
      ...data,
      // Convert Firestore timestamps to ISO strings for consistency
      submissionTime: data.submissionTime?.toDate?.()?.toISOString() || data.submissionTime,
      approvedDate: data.approvedDate?.toDate?.()?.toISOString() || data.approvedDate,
      reportDate: data.reportDate || new Date().toISOString().split('T')[0]
    };

    return NextResponse.json({
      success: true,
      data: report,
      message: 'Daily report fetched successfully'
    });
  } catch (error) {
    console.error('Error fetching daily report:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch daily report'
    }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const dbAdmin = getDbAdmin();
    
    if (!dbAdmin) {
      throw new Error('Firebase Admin not initialized');
    }
    
    // Update daily report in Firebase Firestore using Admin SDK
    const reportRef = dbAdmin.collection('dailyReports').doc(id);
    
    const updateData = {
      status: body.action === 'approve' ? 'approved' : 'rejected',
      approvedBy: body.approvedBy || 'Current Administrator',
      approvedDate: new Date(),
      updatedAt: new Date(),
      feedback: body.action === 'approve' ? 'Report approved' : 'Report rejected'
    };
    
    await reportRef.update(updateData);
    
    // Fetch the updated report
    const updatedReportSnap = await reportRef.get();
    const data = updatedReportSnap.data();
    const updatedReport = {
      id: updatedReportSnap.id,
      ...data,
      // Convert Firestore timestamps to ISO strings for consistency
      submissionTime: data.submissionTime?.toDate?.()?.toISOString() || data.submissionTime,
      approvedDate: data.approvedDate?.toDate?.()?.toISOString() || data.approvedDate,
      reportDate: data.reportDate || new Date().toISOString().split('T')[0]
    };

    return NextResponse.json({
      success: true,
      data: updatedReport,
      message: `Daily report ${body.action}d successfully`
    });
  } catch (error) {
    console.error('Error updating daily report:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update daily report'
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const dbAdmin = getDbAdmin();
    
    if (!dbAdmin) {
      throw new Error('Firebase Admin not initialized');
    }
    
    // Delete daily report from Firebase Firestore using Admin SDK
    const reportRef = dbAdmin.collection('dailyReports').doc(id);
    await reportRef.delete();
    
    console.log(`Daily report ${id} deleted successfully`);
    
    return NextResponse.json({
      success: true,
      message: 'Daily report deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting daily report:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete daily report'
    }, { status: 500 });
  }
}