// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD8N6AGEH5XvsioGCsA2QO5YVud6YPQiQc",
  authDomain: "be-musicheals.firebaseapp.com",
  projectId: "be-musicheals",
  storageBucket: "be-musicheals.appspot.com",
  messagingSenderId: "722153119739",
  appId: "1:722153119739:web:4ad4066a946b678391755e",
  measurementId: "G-EPT96S8L8P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure Google provider
const googleProvider = new GoogleAuthProvider();

// Function to handle sign-in with Google
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Get the user info and token after successful login
    const user = result.user;
    const token = await user.getIdToken();

    // Extract additional user information if needed
    const googleUser = {
      id: user.uid,
      name: user.displayName,
      email: user.email,
      picture: user.photoURL,
    };

    return { user: googleUser, token }; // Return user info and token
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw new Error("Google sign-in failed. Please try again.");
  }
};

export { auth, signInWithGoogle, googleProvider };
