import React, { createContext, useState, useContext } from 'react';
import { themes } from './theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [currentTheme, setCurrentTheme] = useState(themes.orange);

    const toggleTheme = () => {
        setCurrentTheme(currentTheme === themes.orange ? themes.dark : themes.orange);
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
} 