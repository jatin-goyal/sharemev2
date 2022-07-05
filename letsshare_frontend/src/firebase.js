// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7CMk_k3cVVe1AKyYbmVhZ2X_oSvdXBJU",
  authDomain: "media-app-970a7.firebaseapp.com",
  projectId: "media-app-970a7",
  storageBucket: "media-app-970a7.appspot.com",
  messagingSenderId: "822414207819",
  appId: "1:822414207819:web:8ada22e87f4581acaa16ce",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
