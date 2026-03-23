import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBjY5aVQ1XhElhlM1ANeaHkN7uRVGfwZ1k",
  authDomain: "collegehours-b3ce2.firebaseapp.com",
  projectId: "collegehours-b3ce2",
  storageBucket: "collegehours-b3ce2.firebasestorage.app",
  messagingSenderId: "800453652275",
  appId: "1:800453652275:web:b3334b20bc4bc7e1685846",
  measurementId: "G-YTEHNPJ71M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

// Auth Providers
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

export { app, analytics, firestore, auth, googleProvider, microsoftProvider };
export default app;

