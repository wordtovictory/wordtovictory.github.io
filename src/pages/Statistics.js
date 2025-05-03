import React, { useState, useEffect } from 'react';
import { Box, Container } from "@mui/material";
import StatisticsPanel from "../dashboard/StatisticsPanel";
import { useTheme } from '../theme/ThemeContext';
import { BOOKS } from '../bible/constants.ts';
import { bible } from '../services/api';

function Statistics() {
    const [readStatus, setReadStatus] = useState({});
    const { currentTheme } = useTheme();

    useEffect(() => {
        const loadData = async () => {
            try {
                // Try to load from server first
                const serverData = await bible.getRecords();
                if (serverData && serverData.readStatus) {
                    setReadStatus(serverData.readStatus);
                    // Update local storage with server data
                    Object.entries(serverData.readStatus).forEach(([key, value]) => {
                        localStorage.setItem(key, value.toString());
                    });
                }
            } catch (error) {
                // If server load fails, load from local storage
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
                <StatisticsPanel readStatus={readStatus} />
            </Box>
        </Container>
    );
}

export default Statistics; 