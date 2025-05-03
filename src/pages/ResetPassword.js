import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, Alert, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../services/api';
import { useTheme } from '../theme/ThemeContext';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const { token } = useParams();
    const { currentTheme } = useTheme();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setPasswordErrors([]);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            await auth.resetPassword(token, password);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            if (error.response?.data?.errors) {
                setPasswordErrors(error.response.data.errors);
            } else {
                setError(error.response?.data?.message || 'An error occurred');
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ 
                mt: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <Paper elevation={3} sx={{ 
                    p: 4, 
                    width: '100%',
                    backgroundColor: currentTheme.background,
                    border: `1px solid ${currentTheme.button.border}`
                }}>
                    <Typography component="h1" variant="h5" sx={{ color: currentTheme.text, mb: 3, textAlign: 'center' }}>
                        Reset Password
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    {passwordErrors.length > 0 && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Password requirements:</Typography>
                            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                {passwordErrors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            Password has been reset successfully. Redirecting to login...
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="New Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Confirm New Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mb: 2 }}
                        >
                            Reset Password
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
}

export default ResetPassword; 