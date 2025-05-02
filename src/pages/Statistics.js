import React, { useState, useEffect } from 'react';
import { Box, Container } from "@mui/material";
import StatisticsPanel from "../dashboard/StatisticsPanel";
import { useTheme } from '../theme/ThemeContext';
import { BOOKS } from '../bible/constants.ts';

function Statistics() {
    const [readStatus, setReadStatus] = useState({});
    const { currentTheme } = useTheme();

    useEffect(() => {
        const readStatus = {}
        BOOKS.map(book => {
            for (let i = 1; i < book.numChapters + 1; i++) {
                const chapterKey = book.name + "_" + i;
                readStatus[chapterKey] = localStorage.getItem(chapterKey) === "true";
            }
        })
        setReadStatus(readStatus);
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