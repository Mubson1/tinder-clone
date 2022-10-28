// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpPb7w1CKF0YxPSLZH2f_gD49Yf4b5nrk",
  authDomain: "tinder-clone-366707.firebaseapp.com",
  projectId: "tinder-clone-366707",
  storageBucket: "tinder-clone-366707.appspot.com",
  messagingSenderId: "324364935748",
  appId: "1:324364935748:web:6469a678d7795846a95211",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();
const auth = firebase.auth();

export { auth, db };
