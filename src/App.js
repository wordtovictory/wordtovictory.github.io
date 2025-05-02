import './App.css';
import Dashboard from "./dashboard/Dashboard";
import {Box} from "@mui/material";
import AppMenu from "./header/AppMenu";
import Footer from "./header/Footer";
import { ThemeProvider, useTheme } from './theme/ThemeContext';

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

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

export default App;
