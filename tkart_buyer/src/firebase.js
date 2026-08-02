import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC9bPX85Rc4j_msIEPsT9RHqqXgtbwAA2k",
  authDomain: "tkart-389e2.firebaseapp.com",
  projectId: "tkart-389e2",
  storageBucket: "tkart-389e2.firebasestorage.app",
  messagingSenderId: "858771651712",
  appId: "1:858771651712:web:cc6996de17713b4f64fa65"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
