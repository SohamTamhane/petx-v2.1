import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiS6P4mYSqsWdqkzwU0_C2AtpIctGB8zQ",
  authDomain: "petx-3529d.firebaseapp.com",
  projectId: "petx-3529d",
  storageBucket: "petx-3529d.appspot.com",
  messagingSenderId: "952568613510",
  appId: "1:952568613510:web:b34e1374a683859c885f07"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// const appCheck = initializeAppCheck(app, {
//   provider: new ReCaptchaV3Provider('abcdefghijklmnopqrstuvwxy-1234567890abcd'),

//   // Optional argument. If true, the SDK automatically refreshes App Check
//   // tokens as needed.
//   isTokenAutoRefreshEnabled: true
// });