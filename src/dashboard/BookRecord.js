import '../App.css';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import { useTheme } from '../theme/ThemeContext';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useRef, useEffect, useState } from 'react';
import { useUser } from 'reactfire';
import { useBibleService } from '../services/BibleServiceContext';

export default function BookRecord(props) {
    const { currentTheme, fillBoxes } = useTheme();
    const muiTheme = useMuiTheme();
    const {book, readStatus, setReadStatus} = props;
    const { data: user } = useUser();
    const bibleService = useBibleService();
    const containerRef = useRef(null);
    const [buttonsPerRow, setButtonsPerRow] = useState(20);

    const bookRecordstyle = {
        display: 'flex',
        backgroundColor: currentTheme.background,
        alignItems: 'flex-start',
        width: '100%'
    };
    const bookNameStyle = { 
        width: 120,
        minWidth: 120,
        color: currentTheme.text,
        textAlign: 'right',
        pr: 2
    }

    const handleChapterClick = async (event) => {
        const chapterKey = event.currentTarget.value;
        const newStatus = !readStatus[chapterKey];
        
        // Update local state immediately
        setReadStatus(prev => ({
            ...prev,
            [chapterKey]: newStatus
        }));

        if (user) {
            // If logged in, sync with service
            try {
                // Create a new object with just the read status data
                const readStatusData = { ...readStatus };
                readStatusData[chapterKey] = newStatus;
                
                console.log('Sending update to Firebase:', {
                    userId: user.uid,
                    chapterKey,
                    newStatus,
                    readStatusData
                });
                
                await bibleService.updateBibleRecords(user.uid, readStatusData);
            } catch (error) {
                console.error('Failed to sync with service:', error);
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

    const getReadStatus = (chapterKey) => {
        return readStatus[chapterKey];
    };

    // Calculate number of buttons that can fit in a row
    useEffect(() => {
        const calculateButtonsPerRow = () => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.clientWidth;
                const buttonWidth = 38; // Fixed button width
                const buttonsPerRow = Math.floor(containerWidth / buttonWidth);
                setButtonsPerRow(buttonsPerRow);
            }
        };

        // Calculate initially
        calculateButtonsPerRow();

        // Add resize listener
        window.addEventListener('resize', calculateButtonsPerRow);

        // Cleanup
        return () => window.removeEventListener('resize', calculateButtonsPerRow);
    }, []);

    // Calculate number of placeholder boxes needed
    const getPlaceholderCount = () => {
        if (!fillBoxes) return 0;
        const remainder = book.numChapters % buttonsPerRow;
        return remainder === 0 ? 0 : buttonsPerRow - remainder;
    };

    const buttonStyle = {
        minWidth: 38,
        maxWidth: 38,
        minHeight: 28,
        maxHeight: 28,
        p: 0,
        m: 0,
        borderRadius: 0,
        fontSize: '0.875rem',
        lineHeight: 1,
        boxShadow: 'none',
        color: currentTheme.button.text,
        borderColor: currentTheme.button.border,
        backgroundColor: 'transparent',
        '&:hover': {
            boxShadow: 'none',
            backgroundColor: 'transparent'
        }
    };

    return (
        <Box sx={bookRecordstyle}>
            <Box sx={bookNameStyle}>{book.name}</Box>
            <Box ref={containerRef} sx={{ display: 'flex', flexWrap: 'wrap', flex: 1 }}>
                {/* Chapter buttons */}
                {Array.from({length: book.numChapters}, (_, i) => i + 1).map(chapter => {
                    const chapterKey = book.name + "_" + chapter;
                    const isRead = getReadStatus(chapterKey);
                    return (
                        <Button
                            key={chapterKey}
                            value={chapterKey}
                            onClick={handleChapterClick}
                            variant={isRead ? "contained" : "outlined"}
                            sx={{
                                ...buttonStyle,
                                backgroundColor: isRead ? currentTheme.button.background.read : currentTheme.button.background.default,
                                '&:hover': {
                                    boxShadow: 'none',
                                    backgroundColor: isRead ? currentTheme.button.background.read : currentTheme.button.background.hover
                                }
                            }}
                        >
                            {chapter}
                        </Button>
                    );
                })}
                {/* Placeholder boxes */}
                {Array.from({length: getPlaceholderCount()}).map((_, index) => (
                    <Box
                        key={`placeholder-${index}`}
                        sx={{
                            ...buttonStyle,
                            border: `1px solid ${currentTheme.button.border}`,
                            // opacity: 0.3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxSizing: 'border-box'
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
}
