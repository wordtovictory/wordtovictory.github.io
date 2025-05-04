import '../App.css';
import {BOOKS} from '../bible/constants.ts';
import {useEffect, useState} from "react";
import {Box, Container, Snackbar, Alert, CircularProgress} from "@mui/material";
import BookRecord from "./BookRecord";
import OverallProgress from "./OverallProgress";
import ControlPanel from "./ControlPanel";
import { useTheme } from '../theme/ThemeContext';
import { bible } from '../services/api';
import { useSigninCheck } from 'reactfire';

const BOOKS1 = BOOKS.slice(0, 23);
const BOOKS2 = BOOKS.slice(23, BOOKS.length);

function Dashboard({ readStatus, setReadStatus }) {
    const [syncStatus, setSyncStatus] = useState({ message: '', severity: 'info', open: false });
    const { currentTheme, fillBoxes } = useTheme();
    const { status, data: signInCheckResult } = useSigninCheck();

    if (status === 'loading' || readStatus === null) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: 'calc(100vh - 64px - 48px)', // 64px for AppMenu, 48px for Footer
                marginTop: '64px' // Offset for AppMenu
            }}>
                <CircularProgress 
                    color="inherit"
                    sx={{ 
                        '& .MuiCircularProgress-circle': {
                            stroke: currentTheme.primary
                        }
                    }} 
                />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{
            width: '100%',
            backgroundColor: currentTheme.background,
            marginTop: '64px',
            minHeight: 'calc(100vh - 64px - 48px)'
        }}>
            <Box sx={{ 
                width: '100%', 
                py: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 4
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <OverallProgress readStatus={readStatus} />
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 2,
                    width: '100%',
                    justifyContent: 'center'
                }}>
                    <Box sx={{
                        width: { xs: '100%', md: '896px' },
                        minWidth: { xs: '100%', md: '896px' }
                    }}>
                        {BOOKS1.map(book =>
                            <BookRecord 
                                key={book.name} 
                                book={book} 
                                readStatus={readStatus} 
                                setReadStatus={setReadStatus}
                            />
                        )}
                    </Box>
                    <Box sx={{
                        width: { xs: '100%', md: '896px' },
                        minWidth: { xs: '100%', md: '896px' }
                    }}>
                        {BOOKS2.map(book =>
                            <BookRecord 
                                key={book.name} 
                                book={book} 
                                readStatus={readStatus} 
                                setReadStatus={setReadStatus}
                            />
                        )}
                    </Box>
                </Box>
                <Box sx={{ height: 32 }} />
                <ControlPanel readStatus={readStatus} setReadStatus={setReadStatus}/>
                <Box sx={{ height: 32 }} />
            </Box>
            <Snackbar
                open={syncStatus.open}
                autoHideDuration={3000}
                onClose={() => setSyncStatus(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setSyncStatus(prev => ({ ...prev, open: false }))} 
                    severity={syncStatus.severity}
                    sx={{ width: '100%' }}
                >
                    {syncStatus.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default Dashboard;