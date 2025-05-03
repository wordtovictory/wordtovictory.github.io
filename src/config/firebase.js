// This file is kept for backward compatibility
// Firebase is now initialized through FirebaseAppProvider in App.js
import { getAuth } from 'firebase/auth';
import { getApp } from 'firebase/app';

// Get the default app instance that was initialized by FirebaseAppProvider
const app = getApp();

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app; 