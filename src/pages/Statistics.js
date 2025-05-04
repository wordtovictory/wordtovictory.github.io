import React from 'react';
import { Box, Container } from "@mui/material";
import StatisticsPanel from "../dashboard/StatisticsPanel";
import { useTheme } from '../theme/ThemeContext';

function Statistics({ readStatus }) {
    const { currentTheme } = useTheme();

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