import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";

// Register new user
export async function registerUser(email, password, displayName) {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: displayName,
    });

    // Send email verification
    await sendEmailVerification(user);

    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email,
      displayName: displayName,
      createdAt: new Date().toISOString(),
      emailVerified: false,
      preferences: {
        theme: "light",
        notesPerPage: 12,
        defaultNoteColor: "yellow",
      },
    });

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        emailVerified: user.emailVerified,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code),
    };
  }
}

// Login user
export async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code),
    };
  }
}

// Logout user
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Failed to logout. Please try again.",
    };
  }
}

// Reset password
export async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: "Password reset email sent. Check your inbox.",
    };
  } catch (error) {
    return {
      success: false,
      error: getAuthErrorMessage(error.code),
    };
  }
}

// Get user profile data
export async function getUserProfile(uid) {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return {
        success: true,
        data: userDoc.data(),
      };
    } else {
      return {
        success: false,
        error: "User profile not found",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: "Failed to load user profile",
    };
  }
}

// Helper function to convert Firebase auth error codes to user-friendly messages
function getAuthErrorMessage(errorCode) {
  const errorMessages = {
    "auth/user-not-found": "No account found with this email address.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password should be at least 6 characters long.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/too-many-requests":
      "Too many failed attempts. Please try again later.",
    "auth/network-request-failed":
      "Network error. Please check your connection.",
    "auth/requires-recent-login":
      "Please logout and login again to perform this action.",
  };

  return (
    errorMessages[errorCode] ||
    "An unexpected error occurred. Please try again."
  );
}
