// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkf5Kff9JHVnjmDPNVNMTJnxa5yd3Y3ZA",
  authDomain: "prodsync-541df.firebaseapp.com",
  projectId: "prodsync-541df",
  storageBucket: "prodsync-541df.firebasestorage.app",
  messagingSenderId: "271154326678",
  appId: "1:271154326678:web:46a236479d556b9ead66b7",
  measurementId: "G-X0V3FFF0E9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics only in browser environment
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

export default app;