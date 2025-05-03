import React, { useState } from 'react';
import {
    Container,
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Alert,
    Link
} from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import { auth } from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login({ setIsLoggedIn }) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { currentTheme } = useTheme();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await auth.login({
                email: formData.email,
                password: formData.password
            });
            
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setIsLoggedIn(true);
            navigate('/dashboard');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        backgroundColor: currentTheme.background,
                        color: currentTheme.text,
                        border: `1px solid ${currentTheme.button.border}`
                    }}
                >
                    <Typography component="h1" variant="h5" sx={{ mb: 3, color: currentTheme.text }}>
                        Sign In
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={formData.email}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: currentTheme.button.border,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: currentTheme.button.border,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: currentTheme.primary,
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: currentTheme.text,
                                },
                                '& .MuiInputBase-input': {
                                    color: currentTheme.text,
                                },
                            }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: currentTheme.button.border,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: currentTheme.button.border,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: currentTheme.primary,
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: currentTheme.text,
                                },
                                '& .MuiInputBase-input': {
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
                                backgroundColor: currentTheme.primary,
                                color: currentTheme.button.text,
                                '&:hover': {
                                    backgroundColor: currentTheme.primary,
                                    opacity: 0.9
                                }
                            }}
                        >
                            Sign In
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: currentTheme.text }}>
                                Don't have an account?{' '}
                                <Link 
                                    component={Link}
                                    to="/register" 
                                    sx={{ 
                                        color: currentTheme.primary,
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Register
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default Login; 