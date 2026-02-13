// src/firebaseConfig.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKO6Kwm0QLBHaFPEYxE76oZvcqIB8UT-I",
  authDomain: "react-devcamp.firebaseapp.com",
  projectId: "react-devcamp",
  storageBucket: "react-devcamp.firebasestorage.app",
  messagingSenderId: "215536170037",
  appId: "1:215536170037:web:3e4f48686662a34953ad7c",
  measurementId: "G-MJFQZFBE14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const storage = getStorage(app);

export { storage, analytics, logEvent };
