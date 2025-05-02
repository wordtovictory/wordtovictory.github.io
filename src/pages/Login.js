import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    TextField, 
    Button, 
    Typography, 
    Paper,
    Container
} from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import { appThemes } from '../theme/themeConfig';

export default function Login({ setIsLoggedIn }) {
    const { currentTheme } = useTheme();
    const isDarkMode = currentTheme === appThemes.darkOrange;
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Dummy login - in a real app, this would call an API
        if (credentials.username && credentials.password) {
            localStorage.setItem('isLoggedIn', 'true');
            setIsLoggedIn(true);
            navigate('/dashboard');
        }
    };

    return (
        <Container 
            maxWidth="sm" 
            sx={{ 
                backgroundColor: currentTheme.background,
                padding: 0,
                marginTop: '64px', // Add margin to account for AppBar height
                display: 'flex',
                flexDirection: 'column',
                flex: 1
            }}
        >
            <Box 
                sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: currentTheme.background,
                    padding: '20px',
                    flex: 1
                }}
            >
                <Paper 
                    elevation={3}
                    sx={{ 
                        p: 4,
                        width: '100%',
                        backgroundColor: currentTheme.background,
                        color: currentTheme.text,
                        border: isDarkMode ? `1px solid ${currentTheme.button.border}` : '1px solid rgba(0, 0, 0, 0.12)',
                        boxShadow: isDarkMode ? '0 4px 20px rgba(0, 0, 0, 0.5)' : undefined
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            value={credentials.username}
                            onChange={handleChange}
                            margin="normal"
                            sx={{ 
                                '& .MuiOutlinedInput-root': {
                                    color: currentTheme.text,
                                    '& fieldset': {
                                        borderColor: currentTheme.button.border
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: currentTheme.text
                                }
                            }}
                        />
                        <TextField
                            fullWidth
                            label="Password"
                            name="password"
                            type="password"
                            value={credentials.password}
                            onChange={handleChange}
                            margin="normal"
                            sx={{ 
                                '& .MuiOutlinedInput-root': {
                                    color: currentTheme.text,
                                    '& fieldset': {
                                        borderColor: currentTheme.button.border
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: currentTheme.text
                                }
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ 
                                mt: 3,
                                backgroundColor: currentTheme.button.background.default,
                                color: currentTheme.button.text,
                                '&:hover': {
                                    backgroundColor: currentTheme.button.background.hover
                                }
                            }}
                        >
                            Login
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
} 