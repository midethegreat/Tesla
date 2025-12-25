
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Real Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyAVWp2bGtYPAYAHQ6XnEQ5fC5JQWCLePxU",
  authDomain: "tesla-da532.firebaseapp.com",
  projectId: "tesla-da532",
  storageBucket: "tesla-da532.firebasestorage.app",
  messagingSenderId: "601055538400",
  appId: "1:601055538400:web:e500a9a5f230b9de5cb485",
  measurementId: "G-KLL9X5M3RK"
};

const app = initializeApp(firebaseConfig);


// Initialize services
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
export const auth = getAuth(app);