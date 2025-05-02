import React from 'react';
import { useTheme } from '../theme/ThemeContext';
import { appThemes } from '../theme/themeConfig';
import { 
    AppBar, 
    Toolbar, 
    Box,
    Switch,
    FormControlLabel
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export default function AppMenu() {
    const { currentTheme, toggleTheme, fillBoxes, toggleFillBoxes } = useTheme();
    const isDarkMode = currentTheme === appThemes.darkOrange;

    return (
        <AppBar position="static" sx={{ backgroundColor: currentTheme.appMenu.backgroundColor }}>
            <Toolbar>
                <img src={currentTheme.logo} height={50} alt="BibleTrack logo"/>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={fillBoxes}
                                onChange={toggleFillBoxes}
                            />
                        }
                        label="Fill Empty Spaces"
                        sx={{ color: currentTheme.appMenu.textColor }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isDarkMode}
                                onChange={toggleTheme}
                                icon={<Brightness7Icon />}
                                checkedIcon={<Brightness4Icon />}
                            />
                        }
                        label="Dark Mode"
                        sx={{ color: currentTheme.appMenu.textColor }}
                    />
                </Box>
            </Toolbar>
        </AppBar>
    );
}