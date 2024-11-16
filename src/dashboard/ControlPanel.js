import React, {useRef} from 'react';
import Button from "@mui/material/Button";
import {Box} from "@mui/material";
import exportFromJSON from "export-from-json";
import { BOOKS } from '../bible/constants.ts';

export default function ControlPanel(props) {

    const {readStatus, setReadStatus} = props;
    const inputRef = useRef(null);

    const handleSave = () => {
        const data = [{readStatus: readStatus}];
        const fileName = "application-state";
        const exportType = exportFromJSON.types.json;
        exportFromJSON({data, fileName, exportType});
    };
    const handleInputLoad = (event) => {
        if (event.target.files.length) {
            event.target.files[0]
                .text()
                .then((data) => JSON.parse(data))
                .then((data) => {
                    setReadStatus(data[0].readStatus);
                    Object.entries(data[0].readStatus).forEach(
                        ([key, value]) => localStorage.setItem(key, value)
                    );
                });
        }
    };

    const handleLoad = () => {
        if (!inputRef || !inputRef.current) return;
        inputRef.current.click();
    };

    const handleClearAll= () => {
        console.log("Clearing all");
        const readStatus = {}
        BOOKS.map(book => {
            for (let i = 1; i < book.numChapters+1; i++) {
                const chapterKey = book.name+"_"+i;
                // readStatus[chapterKey] = false;
                localStorage.setItem(chapterKey, "false");
            }
        })
        console.log(readStatus);
        setReadStatus(readStatus);
    };


    return (
        <div>
            <Button variant={"contained"} onClick={handleClearAll}>Clear All</Button>
            <Box sx={{
                flex: '0 0 32px'
            }}></Box>
            <Button variant={"contained"} onClick={handleSave}>Save bible study record</Button>
            <Box sx={{
                flex: '0 0 32px'
            }}></Box>
            <Button variant={"contained"} onClick={handleLoad}>
                Load bible study record
                <input
                    ref={inputRef}
                    type="file"
                    onChange={handleInputLoad}
                    accept=".json"
                    hidden
                />
            </Button>

        </div>
    );
};
