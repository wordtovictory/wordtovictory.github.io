import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useTheme } from '../theme/ThemeContext';
import { themes } from '../theme/theme';

function AppMenu() {
    const { currentTheme, toggleTheme } = useTheme();
    const isDarkMode = currentTheme === themes.dark;
    
    return (
        // <AppBar position="static" color="white">
        <AppBar 
            position="static" 
            color="transparent"
            sx={{ 
                backgroundColor: currentTheme.appMenu.backgroundColor,
                color: currentTheme.appMenu.textColor
            }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                    <img src={currentTheme.logo} height={50} alt={"BibleTrack logo"}/>
                    <Button 
                        onClick={toggleTheme} 
                        sx={{ 
                            color: currentTheme.text,
                            textTransform: 'none',
                            fontSize: '1rem'
                        }}
                    >
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default AppMenu;