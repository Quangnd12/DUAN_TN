// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0wXlo9jYNO8x7llHLqs34_bSSL5ZA5n0",
  authDomain: "be-musicheals-a6d7a.firebaseapp.com",
  projectId: "be-musicheals-a6d7a",
  storageBucket: "be-musicheals-a6d7a.appspot.com",
  messagingSenderId: "826807083664",
  appId: "1:826807083664:web:4e3d5191ad8e95f7552e15",
  measurementId: "G-2C1GXR564F"
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
    // Lấy idToken
    const idToken = await result.user.getIdToken(true); // Force refresh token

    // Extract user info
    const googleUser = {
      id: result.user.uid,
      name: result.user.displayName,
      email: result.user.email,
      picture: result.user.photoURL,
    };

    return { 
      user: googleUser,
      token: idToken // Trả về ID token
    };
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw new Error("Google sign-in failed. Please try again.");
  }
};

export { auth, signInWithGoogle, googleProvider };
