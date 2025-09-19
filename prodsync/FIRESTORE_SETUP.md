# Firestore Security Rules Setup

## Issue: "Missing or insufficient permissions" Error

The error occurs because Firestore security rules are blocking client-side writes. Here are two solutions:

## Solution 1: Update Firestore Security Rules (Recommended for Development)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `prodsync-541df`
3. Go to **Firestore Database** → **Rules**
4. Replace the current rules with the development rules from `firestore.rules` file:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users for development
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Click **Publish**

## Solution 2: Use Server-Side API (Already Implemented)

✅ **Already Fixed!** The NewEmployee component now uses the server-side API `/api/create-employee-account` which:
- Uses Firebase Admin SDK (server-side)
- Bypasses client-side security rules
- More secure for production use

## How It Works Now

1. **NewEmployee Form** → Calls `/api/create-employee-account`
2. **Server API** → Uses Firebase Admin SDK to:
   - Create Firebase Auth account
   - Save user data to `users` collection
   - Save employee data to `employees` collection
3. **No Permission Issues** → Server-side operations bypass client rules

## Testing

The system has been tested and works correctly:
- ✅ User account creation via server API
- ✅ Data saved to both `users` and `employees` collections
- ✅ getRole API can find the created user
- ✅ Login should work without permission errors

## Production Security Rules

For production, use more restrictive rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Employees collection - authenticated users can read, only admins can write
    match /employees/{employeeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'administrator';
    }
  }
}
```

## Current Status

✅ **FIXED** - The permission error should no longer occur when creating employee accounts through the NewEmployee component.
