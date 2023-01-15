// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCTTy0FjeiNPNNDDZlos8qZfwYldHh3s7s",
  authDomain: "wormhole-84c59.firebaseapp.com",
  projectId: "wormhole-84c59",
  storageBucket: "wormhole-84c59.appspot.com",
  messagingSenderId: "259037075803",
  appId: "1:259037075803:web:a0452019fe87f2ee54627e",
  measurementId: "G-ZP2NKB16XQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);