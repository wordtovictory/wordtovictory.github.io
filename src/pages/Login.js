import React, { useState } from 'react';
import { Container, Box, Paper, Typography, Button, TextField, Alert } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useSigninCheck, useAuth } from 'reactfire';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile
} from 'firebase/auth';
import { bible } from '../services/api';
import { BOOKS } from '../bible/constants.ts';

function Login({ setIsLoggedIn }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const { currentTheme } = useTheme();
    const navigate = useNavigate();
    const auth = useAuth();

    const { status, data: signInCheckResult } = useSigninCheck();

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
            let result;
            if (isRegistering) {
                // Register new user
                result = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                // Update profile with name
                await updateProfile(result.user, {
                    displayName: formData.name
                });
            } else {
                // Sign in existing user
                result = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            }
            
            // Get the ID token
            const idToken = await result.user.getIdToken();
            
            // Store user data in localStorage
            const user = result.user;
            localStorage.setItem('user', JSON.stringify({
                id: user.uid,
                email: user.email,
                name: user.displayName || user.email
            }));
            
            // Store the ID token
            localStorage.setItem('token', idToken);

            // Initialize empty Bible records for new users
            if (isRegistering) {
                const initialReadStatus = {};
                BOOKS.forEach(book => {
                    for (let i = 1; i <= book.numChapters; i++) {
                        const chapterKey = `${book.name}_${i}`;
                        initialReadStatus[chapterKey] = false;
                    }
                });

                // Save initial records to the server
                await bible.updateRecords(initialReadStatus);
            }
            
            setIsLoggedIn(true);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            
            // Get the ID token
            const idToken = await result.user.getIdToken();
            
            // Store user data in localStorage
            const user = result.user;
            localStorage.setItem('user', JSON.stringify({
                id: user.uid,
                email: user.email,
                name: user.displayName || user.email
            }));
            
            // Store the ID token
            localStorage.setItem('token', idToken);

            // Initialize empty Bible records for new users
            const initialReadStatus = {};
            BOOKS.forEach(book => {
                for (let i = 1; i <= book.numChapters; i++) {
                    const chapterKey = `${book.name}_${i}`;
                    initialReadStatus[chapterKey] = false;
                }
            });

            // Save initial records to the server
            await bible.updateRecords(initialReadStatus);
            
            setIsLoggedIn(true);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
        }
    };

    // If already signed in, redirect to dashboard
    if (status === 'success' && signInCheckResult.signedIn) {
        navigate('/dashboard');
        return null;
    }

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
                        {isRegistering ? 'Register' : 'Sign In'}
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        {isRegistering && (
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                autoComplete="name"
                                autoFocus
                                value={formData.name}
                                onChange={handleChange}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: currentTheme.button.border,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: currentTheme.button.background.hover,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: currentTheme.button.background.hover,
                                        },
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: currentTheme.text,
                                    },
                                    '& .MuiInputBase-input': {
                                        color: currentTheme.text,
                                    }
                                }}
                            />
                        )}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus={!isRegistering}
                            value={formData.email}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: currentTheme.button.border,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: currentTheme.button.background.hover,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: currentTheme.button.background.hover,
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: currentTheme.text,
                                },
                                '& .MuiInputBase-input': {
                                    color: currentTheme.text,
                                }
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
                            autoComplete={isRegistering ? "new-password" : "current-password"}
                            value={formData.password}
                            onChange={handleChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: currentTheme.button.border,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: currentTheme.button.background.hover,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: currentTheme.button.background.hover,
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: currentTheme.text,
                                },
                                '& .MuiInputBase-input': {
                                    color: currentTheme.text,
                                }
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 3,
                                mb: 2,
                                backgroundColor: currentTheme.button.background.read,
                                color: currentTheme.button.text,
                                '&:hover': {
                                    backgroundColor: currentTheme.button.background.hover,
                                }
                            }}
                        >
                            {isRegistering ? 'Register' : 'Sign In'}
                        </Button>

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleGoogleSignIn}
                            sx={{
                                mb: 2,
                                backgroundColor: currentTheme.button.background.default,
                                color: currentTheme.button.text,
                                '&:hover': {
                                    backgroundColor: currentTheme.button.background.hover,
                                }
                            }}
                        >
                            Sign in with Google
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                onClick={() => setIsRegistering(!isRegistering)}
                                sx={{
                                    color: currentTheme.button.background.read,
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        textDecoration: 'underline'
                                    }
                                }}
                            >
                                {isRegistering ? 'Already have an account? Sign in' : 'Need an account? Register'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default Login; 