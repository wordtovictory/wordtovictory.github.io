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
import { useUser } from 'reactfire';
import { updateProfile } from 'firebase/auth';

function Profile() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const { currentTheme } = useTheme();
    const { data: user } = useUser();

    useEffect(() => {
        if (user?.displayName) {
            setEditedName(user.displayName);
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await updateProfile(user, {
                displayName: editedName
            });
            setSuccess('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            setError(error.message || 'Failed to update profile');
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
                                        setEditedName(user.displayName || '');
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
                                    Name: {user.displayName || 'Not set'}
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