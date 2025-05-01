import '../App.css';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import { useRef, useEffect, useState } from 'react';

const bookRecordstyle = {display: 'flex'};
const bookNameStyle = {flex: '0 0 120px'}

// Button dimensions
const BUTTON_WIDTH = 32;
const BUTTON_HEIGHT = 24;
const BUTTON_FONT_SIZE = '0.75rem';
const BUTTON_UNIT = 5; // Number of buttons as a unit (e.g., 5, 10, 15, 20)
const MAX_BUTTONS_PER_ROW = 20;
const MAX_CONTAINER_WIDTH = BUTTON_WIDTH * MAX_BUTTONS_PER_ROW; // 640px for 20 buttons

export default function BookRecord(props) {

    const {book, readStatus, setReadStatus} = props;
    const containerRef = useRef(null);
    const [buttonsPerRow, setButtonsPerRow] = useState(BUTTON_UNIT);

    useEffect(() => {
        const calculateButtonsPerRow = () => {
            if (!containerRef.current) return;
            
            const containerWidth = containerRef.current.clientWidth - 120 - 40;
            // console.log(containerWidth);
            const maxButtonsThatFit = Math.floor(containerWidth / BUTTON_WIDTH);

            // Calculate the largest number of buttons that fits, rounded down to the nearest BUTTON_UNIT
            const buttonsPerRow = Math.min(
                Math.floor(maxButtonsThatFit / BUTTON_UNIT) * BUTTON_UNIT,
                MAX_BUTTONS_PER_ROW
            );

            setButtonsPerRow(buttonsPerRow);
        };

        // Calculate initially
        calculateButtonsPerRow();

        // Add resize listener
        window.addEventListener('resize', calculateButtonsPerRow);

        // Cleanup
        return () => window.removeEventListener('resize', calculateButtonsPerRow);
    }, []);

    const toggleRead = (event) => {
        const chapterKey = event.currentTarget.value;
        const currentRead = readStatus[chapterKey];
        const newRead = !currentRead;
        const newReadStatus = {...readStatus};
        newReadStatus[chapterKey] = newRead;
        setReadStatus(newReadStatus);
        localStorage.setItem(chapterKey, JSON.stringify(newRead));
    };

    const getReadStatus = (chapterKey) => {
        return readStatus[chapterKey];
    };

    const getButtonVariant = (chapterKey) => {
        let isRead = getReadStatus(chapterKey);
        return isRead? "contained" : "outlined";
    };

    const getButtonColor = (chapterKey) => {
        let isRead = getReadStatus(chapterKey);
        return "primary";
    };

    const renderChapterButtons = () => {
        const chapters = Array.from({length: Math.ceil(book.numChapters)}, (_, i) => {
            const chapterNum = i + 1;
            const chapterKey = book.name + "_" + chapterNum;
            return (
                <Button
                    key={chapterKey}
                    size="small"
                    variant={getButtonVariant(chapterKey)}
                    color={getButtonColor(chapterKey)}
                    disableElevation
                    value={chapterKey}
                    sx={{
                        minWidth: BUTTON_WIDTH,
                        maxWidth: BUTTON_WIDTH,
                        minHeight: BUTTON_HEIGHT,
                        maxHeight: BUTTON_HEIGHT,
                        padding: 0,
                        margin: 0,
                        fontSize: BUTTON_FONT_SIZE
                    }}
                    onClick={toggleRead}
                >
                    {chapterNum}
                </Button>
            );
        });

        // Split chapters into rows
        const rows = [];
        for (let i = 0; i < chapters.length; i += buttonsPerRow) {
            rows.push(
                <Box key={i} sx={{ 
                    display: 'flex',
                    flexWrap: 'nowrap',
                    width: '100%',
                    maxWidth: `${buttonsPerRow * BUTTON_WIDTH}px`
                }}>
                    {chapters.slice(i, i + buttonsPerRow)}
                </Box>
            );
        }

        return rows;
    };

    return (
        <Box sx={bookRecordstyle} ref={containerRef}>
            <Box sx={bookNameStyle}>{book.name}</Box>
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                width: '100%',
                maxWidth: `${MAX_CONTAINER_WIDTH}px`
            }}>
                {renderChapterButtons()}
            </Box>
        </Box>
    );
}
