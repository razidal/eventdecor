// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9VGdv_tnKr_dZWOkkACNuyqgxB8tNV4k",
  authDomain: "eventdecor-8f96c.firebaseapp.com",
  projectId: "eventdecor-8f96c",
  storageBucket: "eventdecor-8f96c.appspot.com",
  messagingSenderId: "282426440503",
  appId: "1:282426440503:web:ed30f78fa14b832d5438b2",
  measurementId: "G-THY8FZ3KM2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { auth, googleProvider };
