import React, { useState } from 'react';
import {
    Container,
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Alert,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useAuth } from 'reactfire';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

function Registration({ setIsLoggedIn }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { currentTheme } = useTheme();
    const navigate = useNavigate();
    const auth = useAuth();

    const passwordRequirements = [
        { text: 'At least 8 characters long', regex: /.{8,}/ },
        { text: 'Contains at least one uppercase letter', regex: /[A-Z]/ },
        { text: 'Contains at least one lowercase letter', regex: /[a-z]/ },
        { text: 'Contains at least one number', regex: /[0-9]/ },
        { text: 'Contains at least one special character (!@#$%^&*)', regex: /[!@#$%^&*]/ }
    ];

    const checkPasswordRequirement = (requirement) => {
        return requirement.regex.test(formData.password);
    };

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
        setSuccess('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password requirements
        const failedRequirements = passwordRequirements.filter(req => !checkPasswordRequirement(req));
        if (failedRequirements.length > 0) {
            setError('Password does not meet requirements');
            return;
        }

        try {
            // Create user with email and password
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );

            // Update profile with display name
            await updateProfile(userCredential.user, {
                displayName: formData.name
            });

            setIsLoggedIn(true);
            navigate('/dashboard');
        } catch (error) {
            setError(error.message);
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
                        Register
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
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
                            autoComplete="new-password"
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
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={formData.confirmPassword}
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

                        <List sx={{ mt: 2, mb: 2 }}>
                            {passwordRequirements.map((requirement, index) => (
                                <ListItem key={index} sx={{ py: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        {checkPasswordRequirement(requirement) ? (
                                            <CheckCircleIcon color="success" />
                                        ) : (
                                            <ErrorIcon color="error" />
                                        )}
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={requirement.text}
                                        sx={{ color: currentTheme.text }}
                                    />
                                </ListItem>
                            ))}
                        </List>

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
                            Register
                        </Button>

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" sx={{ color: currentTheme.text }}>
                                Already have an account?{' '}
                                <Link 
                                    to="/login" 
                                    style={{ 
                                        color: currentTheme.button.background.read,
                                        textDecoration: 'none'
                                    }}
                                >
                                    Sign in
                                </Link>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default Registration; 