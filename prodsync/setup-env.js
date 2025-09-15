// setup-env.js - Helper script to create .env.local file
const fs = require('fs');
const path = require('path');

console.log('🔧 Firebase Environment Setup Helper\n');

// Check if .env.local already exists
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists!');
  console.log('Please backup your current file and run this script again.\n');
  process.exit(1);
}

// Template for .env.local
const envTemplate = `# Firebase Configuration (Frontend)
# Get these values from Firebase Console > Project Settings > Your apps > Web app
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Firebase Admin Configuration (Backend)
# Get these values from Firebase Console > Project Settings > Service accounts
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nYOUR_PRIVATE_KEY_CONTENT_HERE\\n-----END PRIVATE KEY-----\\n"
`;

// Create the file
fs.writeFileSync(envPath, envTemplate);

console.log('✅ Created .env.local template file!');
console.log('\n📋 Next steps:');
console.log('1. Go to Firebase Console: https://console.firebase.google.com/');
console.log('2. Create a new project or select existing one');
console.log('3. Enable Authentication (Email/Password)');
console.log('4. Create Firestore Database');
console.log('5. Get Web app config from Project Settings > Your apps');
console.log('6. Get Service account key from Project Settings > Service accounts');
console.log('7. Replace the placeholder values in .env.local with your actual values');
console.log('8. Restart your development server: npm run dev');
console.log('\n🔍 For detailed instructions, see FIREBASE_SETUP.md');
