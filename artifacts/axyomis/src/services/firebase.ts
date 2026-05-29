
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "gen-lang-client-0988342912",
  appId: "1:307779983559:web:765d9639aa131c76b706e2",
  apiKey: "AIzaSyAqN-AYav4ZAfNwr7JaBhoOpfeFkjvQJoA",
  authDomain: "gen-lang-client-0988342912.firebaseapp.com",
  storageBucket: "gen-lang-client-0988342912.appspot.com",
  messagingSenderId: "307779983559",
  measurementId: "G-1W2F224C61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the auth service
export const auth = getAuth(app);

// Get a reference to the firestore service
export const db = getFirestore(app);
