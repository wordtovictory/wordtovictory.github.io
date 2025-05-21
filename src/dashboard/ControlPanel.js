import React, {useRef} from 'react';
import Button from "@mui/material/Button";
import {Box} from "@mui/material";
import exportFromJSON from "export-from-json";
import {BOOKS} from '../bible/constants.ts';
import { useTheme } from '../theme/ThemeContext';
import { useSigninCheck, useUser } from 'reactfire';
import { useBibleService } from '../services/BibleServiceContext';

export default function ControlPanel(props) {
    const { currentTheme } = useTheme();
    const {readStatus, setReadStatus} = props;
    const inputRef = useRef(null);
    const { status, data: signInCheckResult } = useSigninCheck();
    const { data: user } = useUser();
    const bibleService = useBibleService();

    const getButtonColor = () => {
        return currentTheme.buttonColor;
    };

    const controlPanelButtonStyles = {
        minWidth: 250,
        maxWidth: 250,
        color: currentTheme.text,
        '&:hover': {
            color: currentTheme.text
        }
    }

    const handleSave = () => {
        const data = [{readStatus: readStatus}];
        const fileName = "application-state";
        const exportType = exportFromJSON.types.json;
        exportFromJSON({data, fileName, exportType});
    };

    const handleInputLoad = async (event) => {
        if (event.target.files.length) {
            try {
                const data = await event.target.files[0].text();
                const parsedData = JSON.parse(data);
                const newReadStatus = parsedData[0].readStatus;
                
                // Update local state
                setReadStatus(newReadStatus);
                
                if (signInCheckResult?.signedIn) {
                    // If logged in, sync with service
                    await bibleService.updateBibleRecords(user.uid, newReadStatus);
                } else {
                    // If not logged in, save to local storage
                    Object.entries(newReadStatus).forEach(
                        ([key, value]) => localStorage.setItem(key, value)
                    );
                }
            } catch (error) {
                console.error('Failed to load or sync data:', error);
            }
        }
    };

    const handleLoad = () => {
        if (!inputRef || !inputRef.current) return;
        inputRef.current.click();
    };

    const handleClearAll = () => {
        console.log("Clearing all");
        const readStatus = {}
        if (!localStorage.getItem('token')) {
            BOOKS.map(book => {
                for (let i = 1; i < book.numChapters + 1; i++) {
                    const chapterKey = book.name + "_" + i;
                    localStorage.setItem(chapterKey, "false");
                }
            });
        }
        console.log(readStatus);
        setReadStatus(readStatus);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTheme.background
        }}>
            <Button variant={"contained"} color={getButtonColor()} onClick={handleClearAll} sx={controlPanelButtonStyles}>Clear All</Button>
            <Box sx={{
                flex: '0 0 12px'
            }}></Box>
            <Button variant={"contained"} color={getButtonColor()} onClick={handleSave} sx={controlPanelButtonStyles}>Save bible study record</Button>
            <Box sx={{
                flex: '0 0 12px'
            }}></Box>
            <Button variant={"contained"} color={getButtonColor()} onClick={handleLoad} sx={controlPanelButtonStyles}>
                Load bible study record
                <input
                    ref={inputRef}
                    type="file"
                    onChange={handleInputLoad}
                    accept=".json"
                    hidden
                />
            </Button>
        </Box>
    );
};
