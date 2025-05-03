import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Alert
} from '@mui/material';
import { useTheme } from '../theme/ThemeContext';
import { auth } from '../services/api';

function Profile() {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const { currentTheme } = useTheme();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setEditedName(userData.name);
        }
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await auth.updateProfile({ name: editedName });
            setUser(response.user);
            localStorage.setItem('user', JSON.stringify(response.user));
            setSuccess('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update profile');
        }
    };

    if (!user) {
        return (
            <Container maxWidth="sm">
                <Box sx={{ mt: 4 }}>
                    <Alert severity="error">Please log in to view your profile</Alert>
                </Box>
            </Container>
        );
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
                        Profile
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

                    {isEditing ? (
                        <form onSubmit={handleUpdateProfile}>
                            <TextField
                                fullWidth
                                label="Name"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                sx={{
                                    mb: 2,
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
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        backgroundColor: currentTheme.button.background.read,
                                        color: currentTheme.button.text,
                                        '&:hover': {
                                            backgroundColor: currentTheme.button.background.hover,
                                        }
                                    }}
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="text"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditedName(user.name);
                                    }}
                                    sx={{
                                        color: currentTheme.button.text,
                                        '&:hover': {
                                            backgroundColor: currentTheme.button.background.hover,
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </form>
                    ) : (
                        <>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" sx={{ color: currentTheme.text }}>
                                    Email: {user.email}
                                </Typography>
                                <Typography variant="subtitle1" sx={{ color: currentTheme.text }}>
                                    Name: {user.name}
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                onClick={() => setIsEditing(true)}
                                sx={{
                                    backgroundColor: currentTheme.button.background.read,
                                    color: currentTheme.button.text,
                                    '&:hover': {
                                        backgroundColor: currentTheme.button.background.hover,
                                    }
                                }}
                            >
                                Edit Profile
                            </Button>
                        </>
                    )}
                </Paper>
            </Box>
        </Container>
    );
}

export default Profile; 