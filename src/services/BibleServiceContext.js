import React, { createContext, useContext } from 'react';
import BibleServiceFactory from './BibleServiceFactory';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Initialize Firebase first
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Create the service instance once
const bibleService = BibleServiceFactory.createService(process.env.REACT_APP_SERVICE_TYPE || 'firebase');

// Create the context
const BibleServiceContext = createContext(bibleService);

// Create a provider component
export function BibleServiceProvider({ children }) {
    return (
        <BibleServiceContext.Provider value={bibleService}>
            {children}
        </BibleServiceContext.Provider>
    );
}

// Create a hook to use the service
export function useBibleService() {
    const service = useContext(BibleServiceContext);
    if (!service) {
        throw new Error('useBibleService must be used within a BibleServiceProvider');
    }
    return service;
}

// Export Firebase instances for use in other components
export { app, auth }; 