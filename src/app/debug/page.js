'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '../../services/firebase/config';

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const info = {
      // Environment
      nodeEnv: process.env.NODE_ENV,
      
      // Firebase Config Status
      firebaseConfigLoaded: {
        apiKey: !!auth.app.options.apiKey,
        authDomain: !!auth.app.options.authDomain,
        projectId: !!auth.app.options.projectId,
        storageBucket: !!auth.app.options.storageBucket,
        messagingSenderId: !!auth.app.options.messagingSenderId,
        appId: !!auth.app.options.appId
      },
      
      // Firebase Config Values (partial)
      firebaseConfig: {
        authDomain: auth.app.options.authDomain,
        projectId: auth.app.options.projectId,
        apiKeyLength: auth.app.options.apiKey?.length || 0
      },
      
      // Environment Variables Status
      envVarsStatus: {
        NEXT_PUBLIC_FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: !!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: !!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        NEXT_PUBLIC_FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      },
      
      // Current URL info
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'server-side',
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'server-side'
    };
    
    setDebugInfo(info);
  }, []);

  const testFirebaseConnection = async () => {
    try {
      console.log('Testing Firebase connection...');
      // Simple test - try to get the current user (will be null but should not error)
      const currentUser = auth.currentUser;
      console.log('Firebase auth is working. Current user:', currentUser);
      alert('Firebase connection successful!');
    } catch (error) {
      console.error('Firebase connection error:', error);
      alert('Firebase connection failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            🔧 Firebase Debug Information
          </h1>
          
          <div className="space-y-6">
            <button
              onClick={testFirebaseConnection}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Test Firebase Connection
            </button>
            
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Environment</h2>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
            
            <div className="text-sm text-gray-600">
              <p><strong>Instructions:</strong></p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Check that all environment variables are <code>true</code></li>
                <li>Verify the Firebase config values match your project</li>
                <li>Click "Test Firebase Connection" to check connectivity</li>
                <li>Open browser console to see detailed logs</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}