import { NextResponse } from 'next/server';
import { initializeFirebaseAdmin } from '../../lib/firebaseAdmin';

export async function DELETE(request) {
  try {
    console.log('🗑️ Delete employee API called');
    
    // Initialize Firebase Admin
    const { dbAdmin, authAdmin } = initializeFirebaseAdmin();
    
    if (!dbAdmin || !authAdmin) {
      console.error('❌ Firebase Admin not initialized');
      return NextResponse.json(
        { error: 'Firebase Admin not initialized' },
        { status: 500 }
      );
    }
    
    console.log('✅ Firebase Admin initialized successfully');

    // Get employee ID from request body
    const { employeeId, employeeEmail } = await request.json();

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    console.log('🗑️ Deleting employee:', { employeeId, employeeEmail });

    // Step 1: Delete employee document from Firestore
    try {
      console.log('🗑️ Deleting employee document from Firestore:', employeeId);
      await dbAdmin.collection('employees').doc(employeeId).delete();
      console.log('✅ Employee document deleted from Firestore');
    } catch (firestoreError) {
      console.error('❌ Error deleting employee from Firestore:', firestoreError);
      console.error('❌ Firestore error details:', {
        code: firestoreError.code,
        message: firestoreError.message,
        employeeId
      });
      return NextResponse.json(
        { error: `Failed to delete employee record from database: ${firestoreError.message}` },
        { status: 500 }
      );
    }

    // Step 2: Delete user from Firebase Authentication (if email is provided)
    if (employeeEmail) {
      try {
        console.log('🔍 Looking for user in Firebase Authentication:', employeeEmail);
        // Find user by email
        const userRecord = await authAdmin.getUserByEmail(employeeEmail);
        if (userRecord) {
          console.log('🗑️ Deleting user from Firebase Authentication:', userRecord.uid);
          await authAdmin.deleteUser(userRecord.uid);
          console.log('✅ User deleted from Firebase Authentication');
        } else {
          console.log('⚠️ User not found in Firebase Authentication');
        }
      } catch (authError) {
        console.error('❌ Error deleting user from Firebase Authentication:', authError);
        console.error('❌ Auth error details:', {
          code: authError.code,
          message: authError.message,
          email: employeeEmail
        });
        // Don't fail the entire operation if auth deletion fails
        // The employee record is already deleted
        console.log('⚠️ Continuing despite auth deletion failure');
      }
    } else {
      console.log('⚠️ No email provided, skipping authentication deletion');
    }

    // Step 3: Also delete from users collection if it exists
    try {
      if (employeeEmail) {
        console.log('🔍 Looking for user in users collection:', employeeEmail);
        // Try to find and delete from users collection
        const usersSnapshot = await dbAdmin
          .collection('users')
          .where('email', '==', employeeEmail)
          .get();
        
        if (!usersSnapshot.empty) {
          console.log('🗑️ Deleting user from users collection');
          const batch = dbAdmin.batch();
          usersSnapshot.docs.forEach(doc => {
            batch.delete(doc.ref);
          });
          await batch.commit();
          console.log('✅ User deleted from users collection');
        } else {
          console.log('⚠️ User not found in users collection');
        }
      }
    } catch (usersError) {
      console.error('❌ Error deleting from users collection:', usersError);
      console.error('❌ Users collection error details:', {
        code: usersError.code,
        message: usersError.message,
        email: employeeEmail
      });
      // Don't fail the entire operation
    }

    return NextResponse.json({
      success: true,
      message: 'Employee and associated accounts deleted successfully',
      deletedEmployeeId: employeeId,
      deletedEmail: employeeEmail
    });

  } catch (error) {
    console.error('❌ Error in delete-employee API:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}
