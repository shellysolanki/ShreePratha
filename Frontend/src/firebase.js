// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword // ✅ Add this line
} from "firebase/auth";

// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_YOUR_API_KEY,
//   authDomain: import.meta.env.VITE_YOUR_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_YOUR_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_YOUR_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_YOUR_SENDER_ID,
//   appId: import.meta.env.VITE_YOUR_APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyA4lM0iiRfG2NBWTOy5AFAcqIg63cr-aRo",
  authDomain: "shreepratha-admin.firebaseapp.com",
  projectId: "shreepratha-admin",
  storageBucket: "shreepratha-admin.firebasestorage.app",
  messagingSenderId: "813682426065",
  appId: "1:813682426065:web:ef75ed5858d23ad89545f0",
  measurementId: "G-NFZ43G3JS9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export {
  auth,
  provider,
  signInWithPopup,
  signInWithEmailAndPassword // ✅ Export it here too
};




















