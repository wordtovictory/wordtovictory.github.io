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
import { BOOKS } from './bible/constants.ts';
import { BibleServiceProvider, useBibleService, app, auth } from './services/BibleServiceContext';

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
    const bibleService = useBibleService();

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            setIsLoading(true);
            try {
                if (signInCheckResult?.signedIn) {
                    // If logged in, load from service
                    const userId = signInCheckResult.user.uid;
                    console.log('Loading data for user:', userId);
                    
                    const records = await bibleService.getBibleRecords(userId);
                    console.log('Received records from service:', records);
                    
                    // Only update state if component is still mounted
                    if (isMounted) {
                        // If we have records, use them
                        if (records && Object.keys(records).length > 0) {
                            console.log('Using existing records from Firebase');
                            setReadStatus(records);
                        } else {
                            // Only initialize empty records if there are truly no records
                            console.log('No existing records found, initializing empty records');
                            const emptyRecords = {};
                            BOOKS.forEach(book => {
                                for (let i = 1; i < book.numChapters + 1; i++) {
                                    const chapterKey = book.name + "_" + i;
                                    emptyRecords[chapterKey] = false;
                                }
                            });
                            console.log('Created empty records:', emptyRecords);
                            setReadStatus(emptyRecords);
                            
                            // Only save empty records if there are truly no records
                            console.log('Saving empty records to Firebase');
                            await bibleService.updateBibleRecords(userId, emptyRecords);
                        }
                    }
                } else {
                    // If not logged in, load from local storage
                    if (isMounted) {
                        console.log('Loading data from local storage');
                        const localData = {};
                        BOOKS.forEach(book => {
                            for (let i = 1; i < book.numChapters + 1; i++) {
                                const chapterKey = book.name + "_" + i;
                                localData[chapterKey] = localStorage.getItem(chapterKey) === "true";
                            }
                        });
                        console.log('Loaded local data:', localData);
                        setReadStatus(localData);
                    }
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        // Reset readStatus when auth state changes
        if (isMounted) {
            console.log('Resetting readStatus due to auth state change');
            setReadStatus(null);
        }
        
        if (status === 'success') {
            console.log('Auth status is success, loading data');
            loadData();
        }

        // Cleanup function
        return () => {
            console.log('Component unmounting, cleaning up');
            isMounted = false;
        };
    }, [status, signInCheckResult?.signedIn, bibleService]);

    const handleReadStatusUpdate = async (newReadStatus) => {
        try {
            if (signInCheckResult?.signedIn) {
                // If logged in, save to service
                const userId = signInCheckResult.user.uid;
                console.log('Updating read status for user:', userId);
                console.log('New read status:', newReadStatus);
                
                // Create a new object with just the read status data
                const readStatusData = { ...newReadStatus };
                await bibleService.updateBibleRecords(userId, readStatusData);
            } else {
                // If not logged in, save to local storage
                console.log('Saving to local storage:', newReadStatus);
                Object.entries(newReadStatus).forEach(([key, value]) => {
                    localStorage.setItem(key, value.toString());
                });
            }
            setReadStatus(newReadStatus);
        } catch (error) {
            console.error('Failed to update data:', error);
        }
    };
    
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
                    <Route path="/dashboard" element={signInCheckResult?.signedIn ? <Dashboard readStatus={readStatus} setReadStatus={handleReadStatusUpdate} /> : <Navigate to="/login" />} />
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
        <FirebaseAppProvider firebaseApp={app}>
            <AuthProvider sdk={auth}>
                <Router>
                    <ThemeProvider>
                        <BibleServiceProvider>
                            <AppWrapper />
                        </BibleServiceProvider>
                    </ThemeProvider>
                </Router>
            </AuthProvider>
        </FirebaseAppProvider>
    );
}

export default App;
