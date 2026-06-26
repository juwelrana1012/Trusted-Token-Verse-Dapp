import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  increment, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit, 
  where,
  Timestamp,
  arrayUnion
} from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0259422218",
  appId: "1:631799553389:web:9c931adad7f7a642148e64",
  apiKey: "AIzaSyAdUh9PPyIaqz8rz1vWEoudWBsESYkASpk",
  authDomain: "gen-lang-client-0259422218.firebaseapp.com",
  databaseId: "ai-studio-a19e163e-7c4a-477c-8b7f-73c9ec174a1c",
  storageBucket: "gen-lang-client-0259422218.firebasestorage.app",
  messagingSenderId: "631799553389"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { 
  app, 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  increment,
  serverTimestamp,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
  arrayUnion
};
export type { User };
