// src/app/api/create-employee-account/route.js
import { NextResponse } from "next/server";
import admin from "firebase-admin";

export async function POST(request) {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      role, 
      company,
      phone,
      position,
      department,
      salary,
      startDate,
      address,
      emergencyContact,
      emergencyPhone,
      skills,
      notes
    } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role || !company) {
      return NextResponse.json({ 
        error: "Missing required fields: firstName, lastName, email, password, role, company" 
      }, { status: 400 });
    }

    // Check if Firebase Admin is initialized
    if (admin.apps.length === 0) {
      return NextResponse.json({ 
        error: "Firebase Admin is not initialized",
        code: "FIREBASE_NOT_INITIALIZED"
      }, { status: 503 });
    }

    const dbAdmin = admin.firestore();
    const authAdmin = admin.auth();

    // Create user account using Firebase Admin
    let userId;
    try {
      const userRecord = await authAdmin.createUser({
        email: email,
        password: password,
        displayName: `${firstName} ${lastName}`,
        emailVerified: false
      });
      userId = userRecord.uid;
      console.log('✅ User account created with UID:', userId);
    } catch (authError) {
      console.error('Error creating user account:', authError);
      if (authError.code === 'auth/email-already-exists') {
        return NextResponse.json({ 
          error: 'Email is already in use. Please use a different email.',
          code: 'EMAIL_ALREADY_EXISTS'
        }, { status: 400 });
      } else {
        return NextResponse.json({ 
          error: `Failed to create user account: ${authError.message}`,
          code: 'AUTH_ERROR'
        }, { status: 500 });
      }
    }

    // Save user data to users collection
    const userData = {
      firstName,
      lastName,
      email,
      role,
      company,
      createdAt: new Date()
    };

    try {
      await dbAdmin.collection("users").doc(userId).set(userData);
      console.log('✅ User data saved to users collection');
    } catch (userError) {
      console.error('Error saving user data:', userError);
      // If user data fails to save, delete the auth account
      try {
        await authAdmin.deleteUser(userId);
      } catch (deleteError) {
        console.error('Error deleting auth account after user data save failure:', deleteError);
      }
      return NextResponse.json({ 
        error: `Failed to save user data: ${userError.message}`,
        code: 'USER_DATA_ERROR'
      }, { status: 500 });
    }

    // Save employee data to employees collection
    const employeeData = {
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email,
      phone: phone || '',
      position: position || '',
      department: department || '',
      role,
      company,
      salary: salary || '',
      joinDate: startDate || '',
      address: address || '',
      emergencyContact: emergencyContact || '',
      emergencyPhone: emergencyPhone || '',
      skills: skills ? skills.split(',').map(skill => skill.trim()) : [],
      notes: notes || '',
      status: 'Active',
      avatar: `${firstName.charAt(0)}${lastName.charAt(0)}`,
      userId: userId,
      hasAccount: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      const employeeRef = await dbAdmin.collection("employees").add(employeeData);
      console.log('✅ Employee data saved to employees collection with ID:', employeeRef.id);
    } catch (employeeError) {
      console.error('Error saving employee data:', employeeError);
      return NextResponse.json({ 
        error: `Failed to save employee data: ${employeeError.message}`,
        code: 'EMPLOYEE_DATA_ERROR'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Employee account created successfully",
      userId: userId,
      userData: userData,
      employeeData: employeeData
    });

  } catch (error) {
    console.error("Error creating employee account:", error);
    return NextResponse.json({
      error: "Failed to create employee account",
      message: error.message
    }, { status: 500 });
  }
}
