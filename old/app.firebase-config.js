// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCAdGXxBTERAHI-7yUS4MgOnSaMRlWT1l8",
  authDomain: "govthospitalerode-ebb83.firebaseapp.com",
  projectId: "govthospitalerode-ebb83",
  storageBucket: "govthospitalerode-ebb83.firebasestorage.app",
  messagingSenderId: "780734256389",
  appId: "1:780734256389:web:148d94267deb60295f936c",
  measurementId: "G-0EJL1QS7CQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);