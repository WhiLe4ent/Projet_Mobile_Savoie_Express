// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDP6IOLeKUp1ugMaC2_lr9BcSRaNOk_Kco",
  authDomain: "savoie-express-b556b.firebaseapp.com",
  projectId: "savoie-express-b556b",
  storageBucket: "savoie-express-b556b.firebasestorage.app",
  messagingSenderId: "561728676302",
  appId: "1:561728676302:web:451d93b2491851b6340b9f"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);