// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "ai-website-builder-ed0ad.firebaseapp.com",
  projectId: "ai-website-builder-ed0ad",
  storageBucket: "ai-website-builder-ed0ad.firebasestorage.app",
  messagingSenderId: "749332746513",
  appId: "1:749332746513:web:bc0771ef83b884b85bfcb0",
  measurementId: "G-SH4EG4D572"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };