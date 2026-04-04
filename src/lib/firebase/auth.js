import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./firebase.config";

const googleProvider = new GoogleAuthProvider();

/* -------------------------
   EMAIL/PASSWORD AUTH
-------------------------- */

// Register
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/* -------------------------
   GOOGLE LOGIN
-------------------------- */

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google login error:", error);
    throw error;
  }
};

/* -------------------------
   LOGOUT
-------------------------- */

export const logoutUser = () => {
  return signOut(auth);
};

/* -------------------------
   AUTH STATE LISTENER
-------------------------- */

// Subscribe to auth changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user (one-time)
export const getCurrentUser = () => {
  return auth.currentUser;
};