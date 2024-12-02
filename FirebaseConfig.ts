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


// exports.handleStep3 = functions.firestore
//   .document("deliveries/{deliveryId}")
//   .onUpdate(async (change, context) => {
//     const beforeData = change.before.data();
//     const afterData = change.after.data();

//     // Vérifie si la livraison passe à l'étape 3
//     if (beforeData.status !== "Etape 3" && afterData.status === "Etape 3") {
//       const transporter = nodemailer.createTransport({
//         service: "gmail",
//         auth: {
//           user: "tonemail@gmail.com",
//           pass: "tonmotdepasse",
//         },
//       });

//       // Si "Présence" est NON, envoie un email à tous les RCO
//       if (afterData.presence === "NON") {
//         const rcoEmails = ["rco1@example.com", "rco2@example.com"];
//         await transporter.sendMail({
//           from: "tonemail@gmail.com",
//           to: rcoEmails.join(","),
//           subject: "Recherche produit sur site",
//           text: `Le produit ${afterData.title} est introuvable sur le site ${afterData.physicalSite}. Merci de vérifier si le produit est présent chez vous.`,
//         });
//       } else {
//         // Sinon, continue à l'étape 4
//         const deliveryRef = admin.firestore().collection("deliveries").doc(context.params.deliveryId);
//         await deliveryRef.update({ status: "Etape 4" });
//       }
//     }
//   });
