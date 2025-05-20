import React, { useState } from 'react';
import { Container, Box, Paper, Typography, Button, TextField, Alert, Link } from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useSigninCheck, useAuth } from 'reactfire';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    sendPasswordResetEmail
} from 'firebase/auth';
import { bible } from '../services/api';
import { BOOKS } from '../bible/constants.ts';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
        setSuccess('');
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            setError('Please enter your email address');
            return;
        }

        try {
            console.log('Attempting to send password reset email to:', formData.email);
            await sendPasswordResetEmail(auth, formData.email, {
                url: window.location.origin + '/login', // URL to redirect after password reset
                handleCodeInApp: true
            });
            setSuccess('Password reset email sent. Please check your inbox.');
            setError('');
        } catch (error) {
            console.error('Password reset error:', error);
            // More user-friendly error messages
            if (error.code === 'auth/invalid-email') {
                setError('Please enter a valid email address');
            } else if (error.code === 'auth/user-not-found') {
                setError('No account found with this email address');
            } else if (error.code === 'auth/too-many-requests') {
                setError('Too many attempts. Please try again later');
            } else {
                setError('Failed to send reset email. Please try again later');
            }
            setSuccess('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

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
            
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
            setSuccess('');
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
            
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
            setSuccess('');
        }
    };

    if (status === 'success' && signInCheckResult.signedIn) {
        return null; // Already logged in, will be redirected
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
                        border: currentTheme.paper.border,
                        backdropFilter: currentTheme.paper.backdropFilter,                        
                        borderRadius: '12px'
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

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {success}
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
                                        backgroundColor: currentTheme.input.background,
                                        '& fieldset': {
                                            borderColor: currentTheme.input.border,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: currentTheme.input.borderHover,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: currentTheme.input.borderFocus,
                                        },
                                        borderRadius: '8px',
                                    },
                                    '& .MuiInputLabel-root': {
                                        color: currentTheme.input.label,
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
                                    backgroundColor: currentTheme.input.background,
                                    '& fieldset': {
                                        borderColor: currentTheme.input.border,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: currentTheme.input.borderHover,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: currentTheme.input.borderFocus,
                                    },
                                    borderRadius: '8px',
                                },
                                '& .MuiInputLabel-root': {
                                    color: currentTheme.input.label,
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
                                    backgroundColor: currentTheme.input.background,
                                    '& fieldset': {
                                        borderColor: currentTheme.input.border,
                                    },
                                    '&:hover fieldset': {
                                        borderColor: currentTheme.input.borderHover,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: currentTheme.input.borderFocus,
                                    },
                                    borderRadius: '8px',
                                },
                                '& .MuiInputLabel-root': {
                                    color: currentTheme.input.label,
                                },
                                '& .MuiInputBase-input': {
                                    color: currentTheme.text,
                                }
                            }}
                        />

                        {!isRegistering && (
                            <Box sx={{ textAlign: 'right', mb: 2 }}>
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={handleForgotPassword}
                                    sx={{
                                        color: currentTheme.text,
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Forgot Password?
                                </Link>
                            </Box>
                        )}

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
                                },
                                borderRadius: '8px'
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
                                backgroundColor: currentTheme.googleButton.background,
                                color: currentTheme.button.text,
                                '&:hover': {
                                    backgroundColor: currentTheme.googleButton.backgroundHover,
                                },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                borderRadius: '8px'
                            }}
                        >
                            <img 
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                                alt="Google logo"
                                style={{ width: '18px', height: '18px' }}
                            />
                            Sign in with Google
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                onClick={() => setIsRegistering(!isRegistering)}
                                sx={{
                                    color: currentTheme.text,
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