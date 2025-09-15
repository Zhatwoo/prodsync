# Firebase Setup Guide for ProdSync

## 🔥 Firebase Configuration

To connect your ProdSync application to Firebase, you need to set up environment variables.

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `prodsync` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

### Step 3: Create Firestore Database

1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Click "Done"

### Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web app" icon (`</>`)
4. Register your app with a nickname
5. Copy the Firebase configuration object

### Step 5: Create Service Account (for Admin SDK)

1. Go to Project Settings
2. Click "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. Keep this file secure - never commit it to version control

### Step 6: Set Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Firebase Configuration (Frontend)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin Configuration (Backend)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
```

### Step 7: Create Sample User Data

In Firestore, create a collection called `users` with the following structure:

```json
{
  "users": {
    "user_uid_here": {
      "email": "admin@prodsync.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "administrator",
      "company": "ProdSync Inc.",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### Step 8: Test the Connection

1. Restart your development server: `npm run dev`
2. Go to `/auth/login`
3. You should see the login form without configuration warnings
4. Try logging in with your test user

## 🔐 Security Rules (Firestore)

For production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin users can read all user data
    match /users/{userId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'administrator';
    }
  }
}
```

## 🚀 Production Deployment

1. Update Firestore security rules for production
2. Set up proper authentication providers
3. Configure domain restrictions in Firebase Auth
4. Set up monitoring and alerts
5. Enable Firebase App Check for additional security

## 🔧 Troubleshooting

### Common Issues:

#### 1. "Unexpected token 'I', 'Internal S'... is not valid JSON"
- **Cause**: API returning HTML error page instead of JSON
- **Solution**: Check Firebase Admin configuration
- **Test**: Visit `/api/test` to check configuration status

#### 2. "Firebase configuration is missing"
- **Cause**: Environment variables not set
- **Solution**: Create `.env.local` file with proper values
- **Test**: Restart development server after adding variables

#### 3. "User not found in database"
- **Cause**: User exists in Firebase Auth but not in Firestore
- **Solution**: Create user document in Firestore `users` collection

#### 4. "Firebase Admin is not initialized"
- **Cause**: Service account credentials are invalid
- **Solution**: Regenerate service account key and update environment variables

### Testing Your Setup:

1. **Check Configuration Status**:
   ```
   GET /api/test
   ```
   This will show you exactly what's configured and what's missing.

2. **Test Authentication**:
   - Try logging in with a test user
   - Check browser console for detailed error messages
   - Verify user exists in both Firebase Auth and Firestore

3. **Verify API Endpoints**:
   ```
   GET /api/getRole?uid=test_uid
   ```
   Should return JSON, not HTML error page.

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Visit `/api/test` to check configuration status
3. Verify all environment variables are set correctly
4. Ensure Firebase project is properly configured
5. Check Firestore security rules
6. Test API endpoints directly

---

**Note**: Never commit your `.env.local` file to version control. Add it to your `.gitignore` file.
