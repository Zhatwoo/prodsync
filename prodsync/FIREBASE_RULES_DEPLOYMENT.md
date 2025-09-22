# Firebase Firestore Rules Deployment Guide

## Issue
The payroll system is encountering "Missing or insufficient permissions" errors because the new Firestore collections (`processedPayroll`, `salaryReleases`, `leaveRequests`, `overtimeRequests`) are not covered by the current security rules.

## Solution
The `firestore.rules` file has been updated with the necessary rules for the payroll system collections. You need to deploy these rules to Firebase.

## Deployment Options

### Option 1: Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Rules**
4. Copy the contents of `firestore.rules` file
5. Paste the updated rules into the Firebase Console
6. Click **Publish**

### Option 2: Firebase CLI (If you have Firebase CLI installed)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize Firebase in your project: `firebase init firestore`
4. Deploy rules: `firebase deploy --only firestore:rules`

### Option 3: Manual Copy-Paste
Copy the following rules and add them to your Firebase Console Rules section:

```javascript
// Processed Payroll collection - Calculated payroll data
match /processedPayroll/{payrollId} {
  allow read: if isHR() || isAdmin() || isAccounting();
  allow create: if isHR() || isAdmin() || isAccounting();
  allow update: if isHR() || isAdmin() || isAccounting();
  allow delete: if isAdmin();
}

// Salary Releases collection - Salary distribution records
match /salaryReleases/{releaseId} {
  allow read: if isHR() || isAdmin() || isAccounting();
  allow create: if isHR() || isAdmin() || isAccounting();
  allow update: if isHR() || isAdmin() || isAccounting();
  allow delete: if isAdmin();
}

// Leave Requests collection - Employee leave management
match /leaveRequests/{leaveId} {
  allow read: if hasReadAccess() || 
    (isAuthenticated() && resource.data.employeeId == request.auth.uid);
  allow create: if isAuthenticated() && 
    (isEmployee(resource.data.employeeId) || isHR() || isAdmin());
  allow update: if isHR() || isAdmin() || 
    (isAuthenticated() && resource.data.employeeId == request.auth.uid && 
     !('status' in request.resource.data.diff(resource.data).affectedKeys()));
  allow delete: if isHR() || isAdmin();
}

// Overtime Requests collection - Overtime management
match /overtimeRequests/{overtimeId} {
  allow read: if hasReadAccess() || 
    (isAuthenticated() && resource.data.employeeId == request.auth.uid);
  allow create: if isAuthenticated() && 
    (isEmployee(resource.data.employeeId) || isHR() || isAdmin());
  allow update: if isHR() || isAdmin() || 
    (isAuthenticated() && resource.data.employeeId == request.auth.uid && 
     !('status' in request.resource.data.diff(resource.data).affectedKeys()));
  allow delete: if isHR() || isAdmin();
}
```

## Verification
After deploying the rules, test the payroll system to ensure the permission errors are resolved.

## Temporary Workaround
If you need immediate access, you can temporarily modify the rules to allow all access for testing:

```javascript
// TEMPORARY - FOR TESTING ONLY
match /processedPayroll/{payrollId} {
  allow read, write: if true;
}
match /salaryReleases/{releaseId} {
  allow read, write: if true;
}
match /leaveRequests/{leaveId} {
  allow read, write: if true;
}
match /overtimeRequests/{overtimeId} {
  allow read, write: if true;
}
```

**⚠️ WARNING: Never use the temporary rules in production!**
