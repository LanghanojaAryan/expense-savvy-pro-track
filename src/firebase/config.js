
// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQ1H39MkzQlptRN1orsuoJoFbJkuJ6jNQ",
  authDomain: "expense-savvy-pro.firebaseapp.com",
  projectId: "expense-savvy-pro",
  storageBucket: "expense-savvy-pro.appspot.com",
  messagingSenderId: "237855727244",
  appId: "1:237855727244:web:bd69a5e532b2d4bfba5028"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
