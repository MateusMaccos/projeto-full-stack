// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore para banco de dados
import { getAuth } from "firebase/auth"; // Autenticação

const firebaseConfig = {
  apiKey: "AIzaSyB972CnHadp5QNMsRuCrubju_ek2AiCMwk",
  authDomain: "projeto-react-fullstack.firebaseapp.com",
  projectId: "projeto-react-fullstack",
  storageBucket: "projeto-react-fullstack.firebasestorage.app",
  messagingSenderId: "676965951233",
  appId: "1:676965951233:web:b96f452124f552a1729d00",
  measurementId: "G-5VHHGYMKD0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
