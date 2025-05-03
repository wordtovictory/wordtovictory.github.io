import logo from '../BibleTrack_cropped.png';
import logoDark from '../BibleTrack_cropped_dark.png';

export const appThemes = {
    orange: {
        primary: '#ed6c02', // Material-UI warning color
        text: '#8B4000',    // Dark orange
        background: '#ffffff', // White
        buttonColor: 'warning', // Material-UI warning color
        progressTrail: '#f5f5f5', // Light gray for light themes
        name: 'Orange Theme',
        appMenu: {
            backgroundColor: '#ffffff',
            textColor: '#8B4000'
        },
        footer: {
            backgroundColor: '#eeeeee',
            textColor: '#555555'
        },
        logo: logo,
        button: {
            text: '#8B4000',
            border: '#ed6c02',
            background: {
                default: 'transparent',
                read: '#ed6c02',
                hover: 'rgba(0, 0, 0, 0.04)'
            }
        },
        input: {
            background: 'transparent',
            border: 'rgba(0, 0, 0, 0.23)',
            borderHover: 'rgba(0, 0, 0, 0.87)',
            borderFocus: 'rgba(0, 0, 0, 0.87)',
            label: '#8B4000'
        },
        googleButton: {
            background: '#f5f5f5',
            backgroundHover: '#e0e0e0'
        },
        paper: {
            border: 'none',
            backdropFilter: 'none'
        },
        mode: 'light'
    },
    blue: {
        primary: '#1976d2', // Material-UI primary color
        text: '#0d47a1',    // Dark blue
        background: '#ffffff', // White
        buttonColor: 'primary', // Material-UI primary color
        progressTrail: '#f5f5f5', // Light gray for light themes
        name: 'Blue Theme',
        appMenu: {
            backgroundColor: '#ffffff',
            textColor: '#0d47a1'
        },
        footer: {
            backgroundColor: '#eeeeee',
            textColor: '#555555'
        },
        logo: logo,
        button: {
            text: '#0d47a1',
            border: '#1976d2',
            background: {
                default: 'transparent',
                read: '#1976d2',
                hover: 'rgba(0, 0, 0, 0.04)'
            }
        },
        input: {
            background: 'transparent',
            border: 'rgba(0, 0, 0, 0.23)',
            borderHover: 'rgba(0, 0, 0, 0.87)',
            borderFocus: 'rgba(0, 0, 0, 0.87)',
            label: '#0d47a1'
        },
        googleButton: {
            background: '#f5f5f5',
            backgroundHover: '#e0e0e0'
        },
        paper: {
            border: 'none',
            backdropFilter: 'none'
        },
        mode: 'light'
    },
    darkOrange: {
        primary: '#ed6c02', // Material-UI warning color
        text: '#FFFFFF',    // White text
        background: '#121212', // Dark background
        buttonColor: 'warning', // Material-UI warning color
        progressTrail: '#333333', // Dark gray for dark theme
        name: 'Dark Orange Theme',
        appMenu: {
            backgroundColor: '#121212',
            textColor: '#FFFFFF'
        },
        footer: {
            backgroundColor: '#121212',
            textColor: '#ffffff'
        },
        logo: logoDark,
        button: {
            text: '#FFFFFF',
            border: '#ed6c02',
            background: {
                default: 'transparent',
                read: '#ed6c02',
                hover: 'rgba(255, 255, 255, 0.08)'
            }
        },
        input: {
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'rgba(255, 255, 255, 0.1)',
            borderHover: 'rgba(255, 255, 255, 0.2)',
            borderFocus: 'rgba(255, 255, 255, 0.3)',
            label: 'rgba(255, 255, 255, 0.7)'
        },
        googleButton: {
            background: 'rgba(255, 255, 255, 0.08)',
            backgroundHover: 'rgba(255, 255, 255, 0.12)'
        },
        paper: {
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
        },
        mode: 'dark',
    },
    darkBlue: {
        primary: '#64b5f6', // Light blue - good for both buttons and progress
        text: '#ffffff',    // White text
        background: '#121212', // Dark background
        buttonColor: 'primary', // Material-UI primary color
        progressTrail: '#333333', // Dark gray for dark theme
        name: 'Dark Mode',
        appMenu: {
            backgroundColor: '#121212',
            textColor: '#ffffff'
        },
        footer: {
            backgroundColor: '#121212',
            textColor: '#ffffff'
        },
        logo: logoDark,
        button: {
            text: '#ffffff',
            border: '#64b5f6',
            background: {
                default: 'transparent',
                read: '#64b5f6',
                hover: 'rgba(255, 255, 255, 0.08)'
            }
        },
        input: {
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'rgba(255, 255, 255, 0.1)',
            borderHover: 'rgba(255, 255, 255, 0.2)',
            borderFocus: 'rgba(255, 255, 255, 0.3)',
            label: 'rgba(255, 255, 255, 0.7)'
        },
        googleButton: {
            background: 'rgba(255, 255, 255, 0.08)',
            backgroundHover: 'rgba(255, 255, 255, 0.12)'
        },
        paper: {
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)'
        },
        mode: 'dark',
    }
};

// Current theme - can be changed to switch themes
export const currentTheme = appThemes.darkOrange; 