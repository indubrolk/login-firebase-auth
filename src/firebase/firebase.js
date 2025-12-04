// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC71bLWFJD-0ys9KBCxKM9SMv-fQ2koM0U",
    authDomain: "login-page-ff4df.firebaseapp.com",
    projectId: "login-page-ff4df",
    storageBucket: "login-page-ff4df.firebasestorage.app",
    messagingSenderId: "897334869106",
    appId: "1:897334869106:web:776c72e002c87b1897d6eb",
    measurementId: "G-R2ZWKTMD9Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export {app, auth, analytics};