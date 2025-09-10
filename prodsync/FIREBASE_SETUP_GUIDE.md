# 🔥 Firebase Setup para sa ProdSync

## Ang Error na Nakikita Mo
```
Firebase: Error (auth/invalid-api-key)
```

Nangyayari ito dahil kulang ang Firebase configuration mo. Eto ang paraan para ma-fix:

## Step 1: Gumawa ng Firebase Project

1. Pumunta sa [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** o **"Add project"**
3. Ilagay ang project name: `prodsync-app` (o kahit anong gusto mo)
4. Enable Google Analytics: **No** (optional)
5. Click **"Create project"**

## Step 2: I-enable ang Authentication

1. Sa Firebase project mo, click **"Authentication"** sa left sidebar
2. Click **"Get started"**
3. Pumunta sa **"Sign-in method"** tab
4. Click **"Email/Password"**
5. Toggle **"Enable"** at click **"Save"**

## Step 3: I-setup ang Firestore Database

1. Click **"Firestore Database"** sa left sidebar
2. Click **"Create database"**
3. Piliin **"Start in test mode"** (para sa development)
4. Pumili ng location (yung pinakamalapit sayo)
5. Click **"Done"**

## Step 4: Kunin ang Configuration

1. Click ang **gear icon** (⚙️) sa tabi ng "Project Overview"
2. Click **"Project settings"**
3. Scroll down sa **"Your apps"** section
4. Click **"Add app"** at piliin ang **web icon** (</>)
5. I-register ang app mo:
   - App nickname: `prodsync-web`
   - Check "Also set up Firebase Hosting" (optional)
6. Click **"Register app"**
7. **I-copy ang configuration object** (ganito ang itsura):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

## Step 5: Gumawa ng .env.local File

1. Sa project root mo (same folder ng `package.json`), gumawa ng file na `.env.local`
2. Ilagay ang Firebase configuration mo:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyC...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important:** Palitan mo ang values ng actual Firebase configuration values mo!

## Step 6: I-restart ang Development Server

1. I-stop ang development server mo (Ctrl+C)
2. I-start ulit:
   ```bash
   npm run dev
   ```

## Step 7: I-test ang Application

1. Pumunta sa `http://localhost:3000`
2. Click **"Get Started"**
3. Gumawa ng account
4. Dapat ma-redirect ka sa dashboard
5. Subukan mag-add ng task para makita ang real-time updates!

## 🔧 Troubleshooting

### May error pa rin?
- Siguraduhin na ang `.env.local` ay nasa project root (same folder ng `package.json`)
- I-restart ang development server pagkatapos gumawa ng `.env.local`
- Check na lahat ng environment variable names ay nagsisimula sa `NEXT_PUBLIC_`
- I-verify na tama ang values na kinopya mo sa Firebase Console

### Hindi makita ang configuration?
- Siguraduhin na nasa tamang Firebase project ka
- Pumunta sa Project Settings > General > Your apps
- Kung walang web app, click "Add app" at piliin ang web icon

### Kailangan ng tulong?
- Check ang browser console para sa detailed error messages
- Siguraduhin na may Authentication at Firestore ang Firebase project mo
- I-verify na tama ang format ng environment variables mo

## 🎉 Tapos Na!

Pagkatapos ng mga steps na ito, ang Next.js app mo ay connected na sa Firebase with:
- ✅ User authentication (signup/login)
- ✅ Real-time database (Firestore)
- ✅ Protected routes
- ✅ Real-time updates using onSnapshot

Happy coding! 🚀
