// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: "my-react-sui.firebaseapp.com",
  projectId: "my-react-sui",
  storageBucket: "my-react-sui.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: "1:722328077936:web:2ece8918b12d19854456b5"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;