// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

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
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const FIREBASE_DB = getFirestore(FIREBASE_APP);

