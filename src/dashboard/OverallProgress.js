import React from 'react';
import { Box, Typography } from "@mui/material";
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { useTheme } from '../theme/ThemeContext';
import { BOOKS } from '../bible/constants.ts';

export default function OverallProgress({ readStatus }) {
    const { currentTheme } = useTheme();

    const calculateStats = (books) => {
        let totalChapters = 0;
        let chaptersRead = 0;

        books.forEach(book => {
            for (let i = 1; i <= book.numChapters; i++) {
                const chapterKey = book.name + "_" + i;
                totalChapters++;
                if (readStatus[chapterKey]) {
                    chaptersRead++;
                }
            }
        });

        return {
            total: totalChapters,
            read: chaptersRead,
            percentage: (chaptersRead / totalChapters) * 100
        };
    };

    const totalStats = calculateStats(BOOKS);

    return (
        <Box sx={{ 
            backgroundColor: currentTheme.background,
            p: 2,
            width: 200,
            minWidth: 200,
            height: 165,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <Typography sx={{ color: currentTheme.text, textAlign: 'center' }}>
                {totalStats.read} of {totalStats.total} chapters read
            </Typography>
            <div style={{width: 120, height: 120, margin: '5px auto'}}>
                <CircularProgressbar 
                    value={totalStats.percentage} 
                    text={`${totalStats.percentage.toFixed(1)}%`}
                    styles={{
                        path: {
                            stroke: currentTheme.primary,
                        },
                        text: {
                            fill: currentTheme.text,
                            fontSize: '16px'
                        },
                        trail: {
                            stroke: currentTheme.progressTrail
                        }
                    }}
                />
            </div>
        </Box>
    );
} 