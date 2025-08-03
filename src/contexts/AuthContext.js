'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/config';

// Initial state
const initialState = {
  user: null,
  loading: true,
  error: null
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  LOGOUT: 'LOGOUT'
};

// Reducer function
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case AUTH_ACTIONS.SET_USER:
      return { 
        ...state, 
        user: action.payload, 
        loading: false, 
        error: null 
      };
    
    case AUTH_ACTIONS.SET_ERROR:
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };
    
    case AUTH_ACTIONS.LOGOUT:
      return { 
        ...state, 
        user: null, 
        loading: false, 
        error: null 
      };
    
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext();

// Context provider component
export function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        dispatch({
          type: AUTH_ACTIONS.SET_USER,
          payload: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            emailVerified: user.emailVerified
          }
        });
      } else {
        // User is signed out
        dispatch({ type: AUTH_ACTIONS.LOGOUT });
      }
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const value = {
    ...state,
    dispatch
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthContextProvider');
  }
  return context;
}

export { AUTH_ACTIONS };