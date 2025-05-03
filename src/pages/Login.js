import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Paper
} from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import { auth } from '../services/api';

function Login({ setIsLoggedIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [name, setName] = useState('');
    const navigate = useNavigate();
    const { currentTheme } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const userData = isRegistering ? { email, password, name } : { email, password };
            const response = isRegistering 
                ? await auth.register(userData)
                : await auth.login(userData);

            // Store token and user data
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('isLoggedIn', 'true');
            
            setIsLoggedIn(true);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: currentTheme.background,
                        color: currentTheme.text,
                        width: '100%'
                    }}
                >
                    <Typography component="h1" variant="h5">
                        {isRegistering ? 'Register' : 'Login'}
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                            {error}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        {isRegistering && (
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        color: currentTheme.text,
                                        '& fieldset': {
                                            borderColor: currentTheme.button.border,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: currentTheme.primary,
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: currentTheme.text,
                                    },
                                }}
                            />
                        )}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: currentTheme.text,
                                    '& fieldset': {
                                        borderColor: currentTheme.button.border,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: currentTheme.primary,
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: currentTheme.text,
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    color: currentTheme.text,
                                    '& fieldset': {
                                        borderColor: currentTheme.button.border,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: currentTheme.primary,
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: currentTheme.text,
                                },
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: currentTheme.button.background.default,
                                color: currentTheme.button.text,
                                '&:hover': {
                                    backgroundColor: currentTheme.button.background.hover
                                }
                            }}
                        >
                            {isRegistering ? 'Register' : 'Login'}
                        </Button>
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => setIsRegistering(!isRegistering)}
                            sx={{
                                color: currentTheme.text
                            }}
                        >
                            {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default Login; 