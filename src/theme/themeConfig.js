export const themeConfig = {
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
        }
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
        }
    },
    dark: {
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
        }
    }
};

// Current theme - can be changed to switch themes
export const currentTheme = themeConfig.dark; 