import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Dashboard from "./dashboard/Dashboard";
import {Box} from "@mui/material";
import AppMenu from "./header/AppMenu";
import Footer from "./header/Footer";
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import Login from './pages/Login';

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
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Box>
            <Footer />
        </div>
    );
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    }, []);

    return (
        <ThemeProvider>
            <Router>
                <AppWrapper isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            </Router>
        </ThemeProvider>
    );
}

export default App;
