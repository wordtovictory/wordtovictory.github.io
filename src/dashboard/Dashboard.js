import '../App.css';
import {BOOKS} from '../bible/constants.ts';
import {useEffect, useState} from "react";
import {Box, Container, Snackbar, Alert} from "@mui/material";
import BookRecord from "./BookRecord";
import OverallProgress from "./OverallProgress";
import ControlPanel from "./ControlPanel";
import { useTheme } from '../theme/ThemeContext';
import { bible } from '../services/api';

const BOOKS1 = BOOKS.slice(0, 23);
const BOOKS2 = BOOKS.slice(23, BOOKS.length);

function Dashboard() {
    const [readStatus, setReadStatus] = useState({});
    const [syncStatus, setSyncStatus] = useState({ message: '', severity: 'success', open: false });
    const { currentTheme } = useTheme();

    // Load data from server and local storage
    useEffect(() => {
        const loadData = async () => {
            const token = localStorage.getItem('token');
            
            if (token) {
                // If logged in, load from server
                try {
                    const serverData = await bible.getRecords();
                    if (serverData && serverData.readStatus) {
                        setReadStatus(serverData.readStatus);
                    }
                } catch (error) {
                    console.error('Failed to load data from server:', error);
                    setSyncStatus({
                        message: 'Failed to load data from server',
                        severity: 'error',
                        open: true
                    });
                }
            } else {
                // If not logged in, load from local storage
                const localData = {};
                BOOKS.forEach(book => {
                    for (let i = 1; i < book.numChapters + 1; i++) {
                        const chapterKey = book.name + "_" + i;
                        localData[chapterKey] = localStorage.getItem(chapterKey) === "true";
                    }
                });
                setReadStatus(localData);
            }
        };

        loadData();
    }, []);

    // Sync with server when readStatus changes
    useEffect(() => {
        const syncWithServer = async () => {
            try {
                await bible.updateRecords(readStatus);
                setSyncStatus({
                    message: 'Progress synced with server',
                    severity: 'success',
                    open: true
                });
            } catch (error) {
                setSyncStatus({
                    message: 'Failed to sync with server',
                    severity: 'error',
                    open: true
                });
            }
        };

        // Only sync if we have data and user is logged in
        if (Object.keys(readStatus).length > 0 && localStorage.getItem('token')) {
            syncWithServer();
        }
    }, [readStatus]);

    const handleCloseSnackbar = () => {
        setSyncStatus(prev => ({ ...prev, open: false }));
    };

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
                            <BookRecord key={book.name} book={book} readStatus={readStatus} setReadStatus={setReadStatus}/>
                        )}
                    </Box>
                    <Box sx={{
                        width: { xs: '100%', md: '896px' },
                        minWidth: { xs: '100%', md: '896px' }
                    }}>
                        {BOOKS2.map(book =>
                            <BookRecord key={book.name} book={book} readStatus={readStatus} setReadStatus={setReadStatus}/>
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
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
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