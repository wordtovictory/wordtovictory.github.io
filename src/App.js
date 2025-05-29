import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from "./dashboard/Dashboard";
import { Box, CircularProgress } from "@mui/material";
import AppMenu from "./header/AppMenu";
import Footer from "./header/Footer";
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';
import { FirebaseAppProvider, AuthProvider, useSigninCheck } from 'reactfire';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { bible } from './services/api';
import { BOOKS } from './bible/constants.ts';

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

function AppContent({ readStatus, setReadStatus }) {
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
                <Dashboard readStatus={readStatus} setReadStatus={setReadStatus} />
            </Box>
            <Footer/>
        </div>
    );
}

function AppWrapper() {
    const { currentTheme } = useTheme();
    const { status, data: signInCheckResult } = useSigninCheck();
    const [readStatus, setReadStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                if (signInCheckResult?.signedIn) {
                    // If logged in, load from server
                    const response = await bible.getRecords();
                    if (response.data && response.data.readStatus) {
                        setReadStatus(response.data.readStatus);
                    } else {
                        // Initialize empty records if none exist
                        const emptyRecords = {};
                        BOOKS.forEach(book => {
                            for (let i = 1; i < book.numChapters + 1; i++) {
                                const chapterKey = book.name + "_" + i;
                                emptyRecords[chapterKey] = false;
                            }
                        });
                        setReadStatus(emptyRecords);
                    }
                } else {
                    // If not logged in, load from local storage
                    const localData = {};
                    BOOKS.forEach(book => {
                        for (let i = 1; i < book.numChapters + 1; i++) {
                            const chapterKey = book.name + "_" + i;
                            localData[chapterKey] = localStorage.getItem(chapterKey) === "true";
                        }
                    });
                    setReadStatus(localData);
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Reset readStatus when auth state changes
        setReadStatus(null);
        
        if (status === 'success') {
            loadData();
        }
    }, [status, signInCheckResult?.signedIn]);
    
    // Show loading state while checking auth or loading data
    if (status === 'loading' || isLoading || readStatus === null) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: 'calc(100vh - 64px - 48px)',
                marginTop: '64px'
            }}>
                <CircularProgress 
                    color="inherit"
                    sx={{ 
                        '& .MuiCircularProgress-circle': {
                            stroke: currentTheme.primary
                        }
                    }} 
                />
            </Box>
        );
    }

    return (
        <div className="App" style={{ 
            minHeight: '100vh',
            backgroundColor: currentTheme.background,
            color: currentTheme.text,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <AppMenu />
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Routes>
                    <Route path="/login" element={!signInCheckResult?.signedIn ? <Login /> : <Navigate to="/dashboard" />} />
                    <Route path="/register" element={!signInCheckResult?.signedIn ? <Registration /> : <Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={signInCheckResult?.signedIn ? <Dashboard readStatus={readStatus} setReadStatus={setReadStatus} /> : <Navigate to="/login" />} />
                    <Route path="/statistics" element={signInCheckResult?.signedIn ? <Statistics readStatus={readStatus} /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={signInCheckResult?.signedIn ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="/" element={<Navigate to={signInCheckResult?.signedIn ? "/dashboard" : "/login"} />} />
                </Routes>
            </Box>
            <Footer />
        </div>
    );
}

function App() {
    return (
        <FirebaseAppProvider firebaseConfig={firebaseConfig}>
            <AuthProvider sdk={auth}>
                <Router>
                    <ThemeProvider>
                        <AppWrapper />
                    </ThemeProvider>
                </Router>
            </AuthProvider>
        </FirebaseAppProvider>
    );
}

export default App;
