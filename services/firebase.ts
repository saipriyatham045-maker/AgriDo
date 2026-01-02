
import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

/**
 * Firebase Client Configuration for project 'agrido-c9e0a'.
 */
const firebaseConfig = {
  apiKey: "AIzaSy" + "AgriDo_Web_Client_99", 
  authDomain: "agrido-c9e0a.firebaseapp.com",
  projectId: "agrido-c9e0a",
  storageBucket: "agrido-c9e0a.appspot.com",
  messagingSenderId: "104915665477364962761",
  appId: "1:104915665477364962761:web:af1e8b2a5fe0838b453e76"
};

let db: Firestore | null = null;
let app: FirebaseApp | null = null;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  
  // Initialize Firestore
  db = getFirestore(app);
  console.log("[AgriDo] Firebase System Initialized Successfully");
} catch (error) {
  console.warn("[AgriDo] Firebase Cloud could not be initialized. Operating in local-only mode.", error);
}

export { db };
