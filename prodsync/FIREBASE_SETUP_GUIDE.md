# Firebase Admin Setup Guide

## The Problem
You're getting "Firebase Admin not initialized" error because the environment variables are not set up.

## Solution: Create .env.local File

### Step 1: Create the Environment File
Create a file named `.env.local` in your project root (same level as `package.json`) with the following content:

```bash
# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### Step 2: Get Your Firebase Credentials

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select your project**
3. **Go to Project Settings** (gear icon)
4. **Click on "Service Accounts" tab**
5. **Click "Generate new private key"**
6. **Download the JSON file**

### Step 3: Extract Values from JSON

From the downloaded JSON file, copy these values:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",           // ← Use this for FIREBASE_PROJECT_ID
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",  // ← Use this for FIREBASE_PRIVATE_KEY
  "client_email": "firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com",  // ← Use this for FIREBASE_CLIENT_EMAIL
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

### Step 4: Update .env.local

Replace the placeholder values in your `.env.local` file:

```bash
# Example (replace with your actual values)
FIREBASE_PROJECT_ID=prodsync-12345
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc123@prodsync-12345.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### Step 5: Restart Your Development Server

After creating/updating `.env.local`:
1. Stop your development server (Ctrl+C)
2. Run `npm run dev` again
3. The environment variables will be loaded

### Step 6: Test the Configuration

1. Go to HR Dashboard
2. Click "Test Firebase" in the sidebar
3. Click "Check Configuration"
4. All items should show green/configured
5. Click "Test Firebase Admin"
6. Should show success

### Step 7: Test Employee Deletion

Now try deleting an employee again - it should work!

## Important Notes

- **File Location**: `.env.local` must be in the project root (same level as `package.json`)
- **Private Key Format**: Must be wrapped in quotes and have `\n` for newlines
- **Restart Required**: Always restart your development server after changing environment variables
- **Security**: Never commit `.env.local` to git (it's already in .gitignore)

## Troubleshooting

### If still getting "Firebase Admin not initialized":
1. Check that `.env.local` exists in the project root
2. Verify all three variables are set (no empty values)
3. Make sure private key has quotes and `\n` for newlines
4. Restart your development server
5. Check the Firebase test page for specific errors

### If getting permission errors:
1. Make sure your service account has these roles:
   - Firebase Admin SDK Administrator Service Agent
   - Cloud Datastore Owner
   - Firebase Authentication Admin

### Example .env.local file:
```bash
FIREBASE_PROJECT_ID=my-awesome-project
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xyz789@my-awesome-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7VJTUt9Us8cKB...\n-----END PRIVATE KEY-----\n"
```
