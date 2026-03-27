// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDBLbZm06tl92mtMZQjnc4IO-0hz9heMOg",
  authDomain: "boton-de-panico-a32f1.firebaseapp.com",
  projectId: "boton-de-panico-a32f1",
  storageBucket: "boton-de-panico-a32f1.firebasestorage.app",
  messagingSenderId: "810407570793",
  appId: "1:810407570793:web:e74d3f90f5add33d7da1f8",
  measurementId: "G-462ENH4CKR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =getAuth(app);