import '../App.css';
import {BOOKS} from '../bible/constants.ts';
import {useEffect, useState} from "react";
import {Box, Container, Snackbar, Alert} from "@mui/material";
import BookRecord from "./BookRecord";
import OverallProgress from "./OverallProgress";
import ControlPanel from "./ControlPanel";
import { useTheme } from '../theme/ThemeContext';
import { bible } from '../services/api';
import { useUser } from 'reactfire';

const BOOKS1 = BOOKS.slice(0, 23);
const BOOKS2 = BOOKS.slice(23, BOOKS.length);

function Dashboard() {
    const [readStatus, setReadStatus] = useState({});
    const [syncStatus, setSyncStatus] = useState({ message: '', severity: 'info', open: false });
    const { currentTheme, fillBoxes } = useTheme();
    const { data: user } = useUser();

    useEffect(() => {
        const loadData = async () => {
            if (user) {
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
    }, [user]);

    const handleChapterClick = async (bookName, chapter) => {
        const chapterKey = `${bookName}_${chapter}`;
        const newStatus = !readStatus[chapterKey];
        
        // Update local state immediately
        setReadStatus(prev => ({
            ...prev,
            [chapterKey]: newStatus
        }));

        if (user) {
            // If logged in, sync with server
            try {
                await bible.updateRecords({
                    ...readStatus,
                    [chapterKey]: newStatus
                });
                setSyncStatus({
                    message: 'Changes saved to server',
                    severity: 'success',
                    open: true
                });
            } catch (error) {
                console.error('Failed to sync with server:', error);
                setSyncStatus({
                    message: 'Failed to sync with server',
                    severity: 'error',
                    open: true
                });
                // Revert local state on error
                setReadStatus(prev => ({
                    ...prev,
                    [chapterKey]: !newStatus
                }));
            }
        } else {
            // If not logged in, save to local storage
            localStorage.setItem(chapterKey, newStatus.toString());
        }
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