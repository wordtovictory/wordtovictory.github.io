import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from "./dashboard/Dashboard";
import { Box } from "@mui/material";
import AppMenu from "./header/AppMenu";
import Footer from "./header/Footer";
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Statistics from './pages/Statistics';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import { FirebaseAppProvider, AuthProvider, useAuth, useSigninCheck } from 'reactfire';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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

function AppContent() {
    const { currentTheme } = useTheme();
    
    return (
        <div className="App" style={{ 
            minHeight: '100vh',
            backgroundColor: currentTheme.background,
            color: currentTheme.text
        }}>
            <AppMenu/>
            <Box sx={{
                padding: '20px',
                margin: 'auto',
                maxWidth: '2200px'
            }}>
                <Dashboard/>
            </Box>
            <Footer/>
        </div>
    );
}

function AppWrapper({ isLoggedIn, setIsLoggedIn }) {
    const { currentTheme } = useTheme();
    const { status, data: signInCheckResult } = useSigninCheck();
    
    // Update isLoggedIn state when Firebase auth state changes
    useEffect(() => {
        if (status === 'success') {
            setIsLoggedIn(signInCheckResult.signedIn);
        }
    }, [status, signInCheckResult, setIsLoggedIn]);
    
    return (
        <div className="App" style={{ 
            minHeight: '100vh',
            backgroundColor: currentTheme.background,
            color: currentTheme.text,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <AppMenu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Routes>
                    <Route path="/login" element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />} />
                    <Route path="/register" element={!isLoggedIn ? <Registration setIsLoggedIn={setIsLoggedIn} /> : <Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/statistics" element={isLoggedIn ? <Statistics /> : <Navigate to="/login" />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
                </Routes>
            </Box>
            <Footer />
        </div>
    );
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            <AuthProvider sdk={auth}>
                <ThemeProvider>
                    <Router>
                        <AppWrapper isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                    </Router>
                </ThemeProvider>
            </AuthProvider>
        </FirebaseAppProvider>
    );
}

export default App;
