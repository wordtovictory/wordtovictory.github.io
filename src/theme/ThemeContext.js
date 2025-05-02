import React, { createContext, useState, useContext } from 'react';
import logo from '../BibleTrack_cropped.png';
import logoDark from '../BibleTrack_cropped_dark.png';
import { appThemes } from './themeConfig';



const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [currentTheme, setCurrentTheme] = useState(appThemes.darkOrange);
    const [fillBoxes, setFillBoxes] = useState(true);

    const toggleTheme = () => {
        setCurrentTheme(currentTheme === appThemes.orange ? appThemes.darkOrange : appThemes.orange);
    };

    const toggleFillBoxes = () => {
        setFillBoxes(prev => !prev);
    };


    return (
        <ThemeContext.Provider value={{ currentTheme, toggleTheme, fillBoxes, toggleFillBoxes }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
} 